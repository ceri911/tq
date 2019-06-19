'use strict';

const mysql = require('mysql');
const util = require('util');
const log = require('./logger')(module);
var nconf = require('./config')

var db_config = nconf.get('database');

var pool = mysql.createPool(db_config);

const query = util.promisify(pool.query).bind(pool);

var createUser = async function(username,email,pass){
    if (username && pass) {
        await query("INSERT INTO `users`(`username`,`password`,`email`) VALUES (?,?,?)", [username, pass, email])
    }
}

var getUser = async function (username, pass, id) {
    if (username && pass) {
        var user = await query("SELECT * FROM `users` WHERE `username` = ? AND `password` = ?", [username, pass])
    } else if (+id) {
        var user = await query("SELECT * FROM `users` WHERE `id` = ? ", [id])
    } else {
        return 
    }
    
    return user[0]
}

var createToken = async function (user, token, exp) {

    let data = await query("SELECT COUNT(*) as `count` FROM `tokens` WHERE `user_id` = ?", [user])

    if (+data[0].count >= 10) {
        await deleteToken(user)
        throw "TOO_MANY_TOKENS"
    }

    await query("INSERT INTO `tokens` (`user_id`,`token`,`expires`) VALUES (?,?,?)", [user, token, exp])

    return
}

var getToken = async function (user, token) {
    let data = await query("SELECT * FROM `tokens` WHERE `user_id` = ? AND `token` = ?", [user, token])

    return data[0]
}

var deleteToken = async function (user, token) {

    if (token) {
        await query("DELETE FROM `tokens` WHERE `user_id` = ? AND `token` = ?", [user, token])

    } else {
        await query("DELETE FROM `tokens` WHERE `user_id` = ? ", [user])

    }
    return

}

var getUser = async function (username, pass, id) {
    if (username && pass) {
        var user = await query("SELECT * FROM `users` WHERE `username` = ? AND `password` = ?", [username, pass])
    } else if (+id) {
        var user = await query("SELECT * FROM `users` WHERE `id` = ? ", [id])
    } else {
        return
    }

    return user[0]
}

var getPosts = async function () {
    var posts = await query("SELECT * FROM `posts`");

    return posts
}

var createPost = async function (title,text,author_id,username,create_at) {
    await query("INSERT INTO `posts`(`title`,`text`,`username`,`create_at`,`author_id`) VALUES (?,?,?,?,?)", [title, text, username, create_at, author_id])
}

var updatePost = async function (title,text,author_id,username,create_at,id) {
    await query("UPDATE `posts` SET ? WHERE ?", [{Title: title, Text: text, Username: username, Create_at: create_at, Author_id: author_id}, {Id: id}])
}

var deletePost = async function (id) {
    await query("DELETE FROM `posts` WHERE `id` = ?", [id])
}

module.exports = {
    createUser,
    getUser,
    createToken,
    getToken,
    deleteToken,
    getPosts,
    createPost,
    updatePost,
    deletePost
}