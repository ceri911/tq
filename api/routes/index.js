﻿'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/test', function (req, res) {
    res.render('test', { title: 'Express' });
});
router.get('/game', function (req, res) {
    res.render('game', { title: 'Express' });
});
module.exports = router;
