/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    {
        encrypt,
        decrypt
    } = require('../enAndDecryption'),
    {
        verifyToken
    } = require('../config/token'),
    bodyParser = require('body-parser');
router.get("/", function (req, res, next) {
    const getSysMessage = sqlSentence.getSysMessage;
    const searchUser = sqlSentence.searchUser;
    let token = req.headers['x-access-token'];
    let vToken = verifyToken(token);
    let username = vToken.split('&')[0];
    let password = encrypt(vToken.split('&')[1],global.secret);
    /**
     * 根据token查询用户的id
     */
    let p0 = new Promise(function(resolve,reject){
        conn(searchUser(username,password),function(err,row,fields){
            if(err){
                res.json({
                    result:global.FAILURE,
                    err:err,
                    msg:'服务器错误！'
                });
            }
            resolve(row);
        });
    });
    p0.then(function(idArr){
        let id = idArr[0].id;
        conn(getSysMessage(id,0,10), function (err, row, fields) {
            if (err) {
                res.json({
                    err: err,
                    result: global.FAILURE,
                    msg: '服务器错误！',
                });       
            } else {
                res.json({
                    data:row,
                });
            }
        });
    })
    




});

module.exports = router;