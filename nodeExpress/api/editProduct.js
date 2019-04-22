var express = require('express');
router = express.Router(),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),
    encrt = require('../config/token.js'),
    sqlSentence = require('../sql/sql.js'),
    mongodb_con = require('../db.js');
router.get('/', function (req, res, next) {
    res.json({
        data: mongodb_con
    })

})
module.exports = router;