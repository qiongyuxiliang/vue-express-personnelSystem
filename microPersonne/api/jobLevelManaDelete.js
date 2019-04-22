/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.delete("/system/basic/joblevel/:ids", function (req, res, next) {
    const jobLevelManaDelete = sqlSentence.jobLevelManaDelete;
    let id = req.params.ids;
    let tempIds = id.replace(/,$/,'');
    let ids = `(${tempIds})`;
    conn(jobLevelManaDelete(ids), function (err, row, fields) {
        if (err) {
            res.json({
                result: global.FAILURE,
                msg: '服务器错误',
                err: err,
            });
        } else {
            res.json({
                msg:'删除成功！',
                obj:row,
                status:200,
            });
        }
    });
});
module.exports = router;