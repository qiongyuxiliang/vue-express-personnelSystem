/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    bodyParser = require('body-parser'),
    sqlSentence = require('../sql/sql'),
    {
        encrypt,
        decrypt
    } = require('../enAndDecryption'),
    {
        verifyToken
    } = require('../config/token');


router.post("/", function (req, res, next) {
    const updateHrUserInfo = sqlSentence.updateHrUserInfo;
    let hrInfo = req.body;
    hrInfo.password = encrypt(req.body.password,global.secret);
    conn(updateHrUserInfo(hrInfo),function(err,row,fields){
        if(err){
            res.json({
                err:err,
                msg:'服务器错误！'
            });
        }else{
            res.json({
                msg:'更新成功！',
                res:row,
            });
        }
    });
});

module.exports = router;