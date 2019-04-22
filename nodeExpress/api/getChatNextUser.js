/*获取数据接口*/
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),
    encrt = require('../config/token.js'),
    sqlSentence = require('../sql/sql.js');
router.get('/', function (req, res, next) {
    var sqlGetChatNextUser = sqlSentence.getChatNextUser,
        transactionId = req.query.transactionId,
        sysUserId = req.query.sysUserId;
    querySql(sqlGetChatNextUser(sysUserId, transactionId), function (err, row, fields) {
        if (err) {
            res.json({
                errorInfo: '0x00002',
                err1: err
            })
        } else {
            res.json({
                errorInfo: '0x00001',
                data: row,
            })
        }
    })
});

module.exports = router;