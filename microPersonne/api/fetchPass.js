/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    {
        encrypt,
        decrypt
    } = require('../enAndDecryption'),
    bodyParser = require('body-parser'),
    sqlSentence = require('../sql/sql');
  
router.post("/", function (req, res, next) {
    const fetchPass = sqlSentence.fetchPass;
    let id = req.body.id;
    conn(fetchPass(id),function(err,row,fields){
        if(err){
            res.json({
                msg:'服务器错误',
                err:err,
            });
        }else{
            res.json({
                password:decrypt(row[0].password,global.secret),
            });
        }

    });
});

module.exports = router;