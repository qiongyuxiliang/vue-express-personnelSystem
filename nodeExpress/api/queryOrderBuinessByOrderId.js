/*获取数据接口*/
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),
    sqlSentence = require('../sql/sql.js');

router.get('/', function (req, res, next) {
    var SqlqueryOrderBuinessByOrderId = sqlSentence.queryOrderBuinessByOrderId,

        orderId = req.query.orderId;

        querySql(SqlqueryOrderBuinessByOrderId(orderId), function (err, row, fields) {

            if (err) {
                res.json({
                    errorInfo: '0x00002',
                    err:err
                })
            }
            res.json({
                errorInfo: '0x00001',
                data:row[0]
            })
        })


});

module.exports = router;