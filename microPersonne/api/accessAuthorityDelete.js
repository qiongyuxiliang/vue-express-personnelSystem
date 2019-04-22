/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.delete("/system/basic/role/:id", function (req, res, next) {
    const accessAuthorityDelete = sqlSentence.accessAuthorityDelete;
    let id = req.params.id;
    conn(accessAuthorityDelete(id), function (err, row, fields) {
        if (err) {
            res.json({
                result: global.FAILURE,
                msg: '服务器错误',
                err: err,
            });
        } else {
            res.json({
                msg:'删除成功！',
                status:200,
                object:row,
            });
        }
    });
});
module.exports = router;