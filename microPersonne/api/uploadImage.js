/*jshint esversion: 6 */
const fs = require("fs"), //操作文件
    express = require('express'),
    router = express.Router(),
    global = require('../config/globalPar.js'),
    conn = require('../config/mysqlConn.js'),
    {
        encrypt,
        decrypt
    } = require('../enAndDecryption'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    sqlSentence = require('../sql/sql'),
    {
        verifyToken
    } = require('../config/token'),
    multer = require('multer'), //接收图片
    upload = multer({
        dest: '../public/public/images'
    }); //定义图片上传的临时目录

router.post('/images/upload', upload.single('imageFile'), function (req, res, next) {
    const updateHrPortrait = sqlSentence.updateHrPortrait;
    let token = req.headers['x-access-token'];
    let vToken = verifyToken(token);
    let username = vToken.split('&')[0];
    let password = encrypt(vToken.split('&')[1], global.secret);
    let time = (new Date()).getTime();
    let hrInfo = {
        username: username,
        password: password,
        userface: "public/images/" + time + "-" + req.file.originalname,
    };
    conn(updateHrPortrait(hrInfo), function (err, row, fields) {
        if (err) {
            res.json({
                result: global.FAILURE,
                err: err,
                msg: '服务器错误！'
            });
        } else {
            // req.file 是 前端表单name=="imageFile" 的文件信息（不是数组）
            fs.rename(req.file.path, "public/public/images/" + time + '-' + req.file.originalname, function (err) {
                if (err) {
                    throw err;
                }
                console.log('上传成功!');
            });
            res.json({
                uri: "public/images/" + time + "-" + req.file.originalname,
            });
        }

    });


});
module.exports = router;