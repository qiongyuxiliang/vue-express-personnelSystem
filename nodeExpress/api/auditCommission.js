/*获取数据接口*/
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),
    encrt = require('../config/token.js'),
    sqlSentence = require('../sql/sql.js');
router.get('/', function (req, res, next) {
    /*incomeRecordId,status,sysUserId,sysUserType*/
    var sqlAuditCommission = sqlSentence.auditCommission,
        sqlAuditCommissionSelect = sqlSentence.auditCommissionSelect,
        incomeRecordId = req.query.incomeRecordId,
        status = req.query.status,
        sysUserId = req.query.sysUserId,
        sysUserType = req.query.sysUserType,
        operateDate = new Date();
    function checkIsChecked(callback) {
        querySql(sqlAuditCommissionSelect(incomeRecordId, sysUserType), function (err, row, fields) {
            if (err) {
                res.json({
                    errorInfo: '0x00002',
                    err: err,
                })
            } else {
                callback(row[0])
            }
        })
    }
    /*转化日期的格式*/
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "/";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    }

    if (sysUserType == 'manager-1') {
        checkIsChecked(function (data) {
            if (!(data.operator_user_id)) {
                querySql(sqlAuditCommission(incomeRecordId, status, sysUserId, sysUserType,getNowFormatDate()), function (err, row, fields) {
                    if (err) {
                        res.json({
                            errorInfo: '0x00002',
                            err: err,
                        })
                    } else {
                        res.json({
                            errorInfo: '0x00001',
                            result: '审核成功'
                        })
                    }
                })
            } else {
                res.json({
                    data: data,
                    errorInfo: '0x00001',
                    result: '已有相关人员审核，不能重复修改'
                })
            }
        })
    } else if (sysUserType == 'finance-1') {
        checkIsChecked(function (data) {
            if (!(data.finance_user_id)) {
                querySql(sqlAuditCommission(incomeRecordId, status, sysUserId, sysUserType,getNowFormatDate()), function (err, row, fields) {
                    if (err) {
                        res.json({
                            errorInfo: '0x00002',
                            err: err,
                        })
                    } else {
                        res.json({
                            errorInfo: '0x00001',
                            result: '审核成功'
                        })
                    }
                })
            } else {
                res.json({
                    data: data,
                    result: '已有相关人员审核，不能重复修改'
                })
            }
        })
    }
});

module.exports = router;