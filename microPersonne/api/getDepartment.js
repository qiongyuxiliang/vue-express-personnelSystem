/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.get("/", function (req, res, next) {
    const getDepartment = sqlSentence.getDepartment;
    conn(getDepartment(),function(err,row,fields){
        if(err){
            res.json({
                err:err,
                msg:'服务器错误！'
            });
        }else{
            res.send(row);
        }
    })
});

module.exports = router;