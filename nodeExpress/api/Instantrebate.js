/*获取数据接口*/
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),
    encrt = require('../config/token.js'),
    sqlSentence = require('../sql/sql.js');
router.post('/', function (req, res, next) {
    var sqlInstantrebate = sqlSentence.instantrebate,
        pageNo = (req.body.pageNo - 1) * 5,
        type = req.body.requestData.incomeType,
        pageSize = req.body.pageSize,
        tel = req.body.requestData.mobile || '',
        timeStart = req.body.startTime || '',
        timeEnd = req.body.endTime || '',
        checkStatus = req.body.requestData.checkStatus || '',
        financeStaffStatus,
        operationalStaffStatus;
    if (checkStatus == '') {
        /*全部状态*/
        financeStaffStatus = '';
        operationalStaffStatus = '';
    } else if (checkStatus == 0) {
        /*未审核*/
        financeStaffStatus = '2';
        operationalStaffStatus = '2';
    } else if (checkStatus == 1) {
        /*运营审核*/
        operationalStaffStatus = '0';
        financeStaffStatus = '';
    } else if (checkStatus == 2) {
        /*财务审核*/
        operationalStaffStatus = '';
        financeStaffStatus = '0';
    } else if (checkStatus == 3) {
        /*双方已审核*/
        operationalStaffStatus = '0';
        financeStaffStatus = '0';
    } else if (checkStatus == 4) {
        /*拒绝*/
        operationalStaffStatus = '1';
        financeStaffStatus = '1';
    }

    async function getLength(callback) {
        await querySql(sqlInstantrebate(type, '', '', tel, checkStatus, timeStart, timeEnd, financeStaffStatus, operationalStaffStatus), function (err, row1, fields) {
            // console.log(type, pageNo, pageSize, tel, widrawstatus, timeStart, timeEnd)
            if (err) {
                res.json({
                    errorInfo:'0x00002',
                    err:err
                })
            } else {
                callback(row1)
            }
        })
    }

    getLength(function (dat) {
        querySql(sqlInstantrebate(type, pageNo, pageSize, tel, checkStatus, timeStart, timeEnd, financeStaffStatus, operationalStaffStatus), function (err, row, fields) {
            if (err) {
                res.json({
                    errorInfo: err,
                })
            } else {
                res.json({
                    errorInfo: '0x00001',
                    data: row,
                    totalCount: dat[0]['count(*)']
                })
            }
        })
    })
});

module.exports = router;