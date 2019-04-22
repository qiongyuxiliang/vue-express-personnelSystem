/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.get("/", function (req, res, next) {
    const getJobLevels = sqlSentence.getJobLevels;
    
    
    conn(getJobLevels(),function(err,row,fields){
        if(err){
            res.json({
                result:global.FAILURE,
                msg:'服务器错误',
                err:err,
            })
        }else{
            res.send(row)
        }
    })
   
});

module.exports = router;