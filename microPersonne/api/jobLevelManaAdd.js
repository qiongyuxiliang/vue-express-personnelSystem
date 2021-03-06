/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.post("/", function (req, res, next) {
    const jobLevelManaAdd = sqlSentence.jobLevelManaAdd;
    let jobLevel = req.body;
    conn(jobLevelManaAdd(jobLevel), function (err, row, fields) {
        if (err) {
            res.json({
                result: global.FAILURE,
                msg: '服务器错误',
                err: err,
            });
        } else {
            res.json({
                msg:'添加成功！',
                obj:row,
                status:200,
            });
        }
    });
});
module.exports = router;