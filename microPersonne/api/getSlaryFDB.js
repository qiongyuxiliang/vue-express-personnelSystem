/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.get("/", function (req, res, next) {
    const getSlaryFDB = sqlSentence.getSlaryFDB;
    conn(getSlaryFDB(),function(err,row,fields){
        if(err){
            res.json({
                result:global.FAILURE,
                msg:'服务器错误',
                err:err,
            })
        }else{
            res.json({
                data:row,
            })
        }
    })
   
});

module.exports = router;