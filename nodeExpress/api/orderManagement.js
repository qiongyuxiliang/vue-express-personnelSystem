/*获取数据接口*/
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),
    encrt = require('../config/token.js'),
    sqlSentence = require('../sql/sql.js'),
    offlineProduct = require('../mongooseModel/offlineProduct.js');

router.post('/', function (req, res, next) {
    var SqlorderManagement = sqlSentence.orderManagement,
        pageSize = req.body.pageSize,
        pageNo = (req.body.pageNo-1)*pageSize,

        // pageSize = req.body.pageSize,
        stp = req.body.stp || '',
        etp = req.body.etp || '',
        stc = req.body.stc || '',
        etc = req.body.etc || '',
        status = req.body.status || '',
        orderId = req.body.orderId || '',
        sysUserId = req.body.sysUserId || '';
    // console.log(SqlorderManagement('', '', stp, etp, stc, etc, orderId, sysUserId,status);
    // console.log(transactionId)
    // pageNo,pageSize,paySTime,payETime,complishedSTime,complishedETime,transactionId,sysUserId,status
    function getLength(callback) {
        querySql(SqlorderManagement('', '', stp, etp, stc, etc, orderId, sysUserId,status), function (err, row, fields) {

            if (err) {
                res.json({
                    errorInfo: '0x00002'
                })
            }
            callback(row[0]['COUNT(1)']);
        })
    }

    getLength(function (data) {
        querySql(SqlorderManagement(pageNo, pageSize, stp, etp, stc, etc, orderId, sysUserId, status), function (err, row, fields) {
            if (err) {
                res.json({
                    errorInfo: '0x00002',
                    err:err,
                })
            }

            res.json({
                data: {
                    data: row,
                    totalCount: data,
                    errorInfo: '0x00001',
                    sql:SqlorderManagement(pageNo, pageSize, stp, etp, stc, etc, orderId, sysUserId, status)

                }
            })
        })
    })

});

module.exports = router;