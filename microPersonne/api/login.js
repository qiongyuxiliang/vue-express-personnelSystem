/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser'),
    {
        encrypt,
        decrypt
    } = require('../enAndDecryption'),
    {generateToken,verifyToken} = require('../config/token');
    // sqlSentence = require('../sql/sql.js');
router.post("/", function (req, res, next) {
    const mixed = req.body.username+'&'+req.body.password;
    const pass = encrypt(req.body.password,global.secret);
    const userLogin = sqlSentence.userLogin;
    const getLoginInfo = sqlSentence.getLoginInfo;
    let p1 = new Promise(function(resolve,reject){
        conn(userLogin(req.body.username,pass),function(err, row, fields){
            if(err){
                res.json({
                    result:global.FAILURE,
                    err:err,
                });
            }else if(row.length&&row[0].id){
                const tokenValue = generateToken(mixed);
                resolve({
                    tokenValue:tokenValue,
                    id:row[0].id,
                });
            }else{
                res.json({
                    result:global.FAILURE,
                    msg:'用户名和密码错误！！',
                    status:500,
                });
            }
        });
    });
    p1.then(function(data){
        let id = data.id;
        conn(getLoginInfo(id),function(err, row, fields){
            if(err){
                res.json({
                    result:global.FAILURE,
                    err:err,
                });
            }else{
                row[0].roles=[{id:row[0].rid,name:row[0].rname,nameZh:row[0].rnameZh}];
                delete row[0].rname;
                delete row[0].rnameZh;
                // delete row[0].password;
                res.json({
                    tokenValue:data.tokenValue,
                    msg:'登录成功！',
                    obj:row[0],
                    result:global.SUCCESS,
                });
            }
        });
    });
});

module.exports = router;