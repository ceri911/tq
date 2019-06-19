﻿'use strict';
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var passport = require("passport");
var db = require('../lib/db')
var log = require('../lib/logger')(module)
var crypto = require('crypto')

var jwtOptions = {}

jwtOptions.secretOrKey = 'monopolyNoOne';

/* GET users listing. */

router.options('*', function (req, res) { 
    if (req.method == 'OPTIONS') {
        console.log(req.method)
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
        return res.sendStatus(200)
    }
})

router.all('/login', async (req, res)=> {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With") 

    log.debug(req.body.username, req.body.password)
    if (req.body.username && req.body.password) {
        var username = req.body.username;
        var password = req.body.password;
    } else {
        return res.status(400).json({ ERROR: "NO_DATA_ENTERED" });
    }
    try {
        var user = await db.getUser(username, password)
    } catch (err) {
        log.error(err)
        return res.status(500).json({ ERROR: "SERVER_ERROR" })
    }
    if (!user) {
        return res.status(400).json({ ERROR: "USER_NOT_FOUND" });

    }

    if (user.password === password) {
        // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
        var refresh = crypto.randomBytes(16).toString('hex');
        let exp = new Date().getTime() + 2592000000

        try {
            await db.createToken(user.id, refresh, exp) //need catch
        } catch (err) {
            log.debug(err)
            if (err == "TOO_MANY_TOKENS") {
                return res.status(400).json({ ERROR: "TOO_MANY_TOKENS" })
            }
            return res.status(500).json({ ERROR: "SERVER_ERROR" })
        }
        var payload = { name: user.username , id:user.id, rToken: refresh};
        var token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '1d' });
        res.json({ message: "OK", token: token });
    } else {
        return res.status(400).json({ ERROR: "USER_NOT_FOUND" });
    }
});

router.all('/registration', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const nameRegex = /^(?=.{4,15}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    console.log(req.body)
    if (req.body.username && req.body.password) {
        var username = req.body.username;
        var password = String(req.body.password);
        var email = req.body.email;
    } else {
        return res.status(400).json({ ERROR: "NO_DATA_ENTERED" });
    }
    if (password.length < 6) {
        return res.status(400).json({ ERROR: "PASS_TOO_SHORT" });
    } if (!regex.test(email)) {
        return res.status(400).json({ ERROR: "EMAIL_INVALID" });
    } if (!nameRegex.test(username)) {
        return res.status(400).json({ ERROR: "USERNAME_INVALID" });
    }


    try {
        await db.createUser(username, email, password)
    } catch (err) {
        log.debug(err)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ ERROR: "USERNAME_OR_EMAIL_EXISTS" }) //Переделать проверку на существующий ник
        }

        return res.status(500).json({ ERROR: "SERVER_ERROR" })
    }

    
    res.json({ "OK": "Register_was_successfully"})
});

router.all('/getUser', passport.authenticate('jwt', { session: false }), async (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")


    try {
        var user = await db.getUser(null,null,req.user.id)
    } catch (err) {
        log.debug(err)
        return res.status(500).json({ ERROR: "SERVER_ERROR" })
    }

    res.json(user)
});

router.post('/refresh', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")

    if (!req.body.token) {
        return res.status(400).json({ ERROR: "NO_DATA_ENTERED" });
    }

    let token = req.body.token

    let time = new Date().getTime()

    try {
        var data = jwt.verify(token, jwtOptions.secretOrKey, { ignoreExpiration: true })
    } catch (err) {
        return res.status(500).json({ ERROR: "SERVER_ERROR" }, err)
    }
    try {
        var rToken = await db.getToken(data.id, data.rToken)
    } catch (err) {
        log.debug(err)
        return res.status(500).json({ ERROR: "SERVER_ERROR" })
    }

    if (rToken && rToken.expires > time) {
        var refresh = crypto.randomBytes(16).toString('hex');
        let exp = new Date().getTime() + 2592000000

        try {
            await db.createToken(data.id, refresh, exp).catch()
            await db.deleteToken(data.id, data.rToken).catch()
        } catch (err) {
            log.debug(err)

            if (err == "TOO_MANY_TOKENS") {
                return res.status(400).json({ ERROR: "TOO_MANY_TOKENS" })
            }
            return res.status(500).json({ ERROR: "SERVER_ERROR" })
        }

        var payload = { id: data.id, rToken: refresh };
        let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '1d' });

        return res.json({ message: "OK", token: token });

    } else {
        return res.sendStatus(400).json({ ERROR: "TOKEN_INVALID"})
    }
});

router.all('/takePosts', async (req, res)=> {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")


    try {
        var posts = await db.getPosts()
    } catch (err) {
        log.debug(err)
        return res.status(500).json({ ERROR: "SERVER_ERROR" })
    }

    res.json(posts)
});
router.all('/deletePost', async (req, res)=> {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")

    try {
        var posts = await db.deletePost(Object.keys(req.body)[0])
    } catch (err) {
        log.debug(err)
        return res.status(500).json({ ERROR: "SERVER_ERROR" })
    }

    res.json(posts)
});

router.all('/createPost', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")

    if (req.body.title && req.body.text && req.body.token && req.body.data) {
        var title = req.body.title;
        var text = String(req.body.text);
        var data = req.body.data;
        var token = req.body.token
        var extoken = jwt.verify(token, jwtOptions.secretOrKey, { ignoreExpiration: true })
    } else {
        return res.status(400).json({ ERROR: "NO_DATA_ENTERED" });
    }

    if (title < 6) {
        return res.status(400).json({ ERROR: "TITLE_TOO_SHORT" });
    }
    if (text < 6) {
        return res.status(400).json({ ERROR: "TEXT_TOO_SHORT" });
    }

    try {
        await db.createPost(title, text, extoken.id, extoken.name, data)
    } catch (err) {
        log.debug(err)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ ERROR: "SOMETHING_IS_EXISTS" })
        }

        return res.status(500).json({ ERROR: "SERVER_ERROR" })
    }


    res.json({ "OK": "Post_was_successfully_created"})
});

router.all('/updatePost', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")

    if (req.body.title && req.body.text && req.body.token && req.body.data) {
        var title = req.body.title;
        var text = String(req.body.text);
        var data = req.body.data;
        var token = req.body.token
        var id = req.body.id
        var extoken = jwt.verify(token, jwtOptions.secretOrKey, { ignoreExpiration: true })
    } else {
        return res.status(400).json({ ERROR: "NO_DATA_ENTERED" });
    }

    if (title < 6) {
        return res.status(400).json({ ERROR: "TITLE_TOO_SHORT" });
    }
    if (text < 6) {
        return res.status(400).json({ ERROR: "TEXT_TOO_SHORT" });
    }

    try {
        await db.updatePost(title, text, extoken.id, extoken.name, data, id)
    } catch (err) {
        log.debug(err)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ ERROR: "SOMETHING_IS_EXISTS" })
        }

        return res.status(500).json({ ERROR: "SERVER_ERROR" })
    }


    res.json({ "OK": "Post_was_successfully_updated"})
});


module.exports = router;
