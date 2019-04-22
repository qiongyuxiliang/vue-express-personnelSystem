/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql.js'),
    {
        encrypt,
        decrypt
    } = require('../enAndDecryption'),
    bodyParser = require('body-parser');
    /**
     * 注册用户
     */
router.post("/", function (req, res, next) {
    const sqlRegister = sqlSentence.createNewUser;
    let username = req.body.username,
    pass=encrypt(req.body.pass,global.secret);
    conn(sqlRegister(username,pass),function(err, row, fields){
        if(err){
            res.json({
                result:global.FAILURE,
                err:err
            });
        }else{
            res.json({
                result:global.SUCCESS,
            });
        }
    });
});

module.exports = router;