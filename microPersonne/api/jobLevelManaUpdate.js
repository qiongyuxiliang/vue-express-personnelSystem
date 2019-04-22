/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.put("/", function (req, res, next) {
    const jobLevelManaUpdate = sqlSentence.jobLevelManaUpdate;
    let jobLevel = req.body;
    conn(jobLevelManaUpdate(jobLevel), function (err, row, fields) {
        if (err) {
            res.json({
                result: global.FAILURE,
                msg: '服务器错误',
                err: err,
            });
        } else {
            res.json({
                msg:'更新成功！',
                obj:row,
                status:200,
            });
        }
    });
});
module.exports = router;