/*获取数据接口*/
var express = require('express');
router = express.Router(),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),
    encrt = require('../config/token.js'),
    sqlSentence = require('../sql/sql.js');
router.get('/', function (req, res, next) {
    var sqlCheckUserDetailInfoById = sqlSentence.checkUserDetailInfoById,
        userId = req.query.userId;

    function fetchData(callback) {
        querySql(sqlCheckUserDetailInfoById(userId, ''), function (err, row2, fields) {
            if (err) {
                res.json({
                    errorInfo: '0x00002',
                })
            } else {
                callback(row2)
            }
        })
    }

    function getData(callback) {
        querySql(sqlCheckUserDetailInfoById('', userId), function (err, row1, fields) {
            if (err) {
                res.json({
                    errorInfo: '0x00002',
                })
            } else {
                callback(row1)
            }
        })
    }

    getData(function (data) {
        querySql(sqlCheckUserDetailInfoById(userId, ''), function (err, row, fields) {
            if (err) {
                res.json({
                    errorInfo: '0x00002',
                })
            } else {
                fetchData(function (da) {
                    /*为普通用户时*/
                    if (!row) {
                        res.json({
                            data: {
                                curUser: da,
                                nxtUser: ''
                            }
                        })
                    } else {
                        res.json({
                            data: {
                                curUser: da,
                                nxtUser: row[0]
                            }
                        })
                    }
                })
            }
        })
    })
});

module.exports = router;