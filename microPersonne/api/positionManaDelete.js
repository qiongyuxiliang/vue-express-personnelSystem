/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.delete("/system/basic/position/:ids", function (req, res, next) {
    const positionManaDelete = sqlSentence.positionManaDelete;
    let id = req.params.ids;
    let tempIds = id.replace(/,$/,'');
    let ids = `(${tempIds})`;
    conn(positionManaDelete(ids), function (err, row, fields) {
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