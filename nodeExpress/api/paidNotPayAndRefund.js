const express = require('express'),
    moment = require('moment'),
    /*moment 插件用于格式化日期*/
    router = express.Router(),
    querySql = require('../mx99Conn.js'),
    sqlSentence = require('../sql/mx99Sql');
router.get('/', function (req, res, next) {
    const recentAlreadyPay = sqlSentence.recentAlreadyPay;
    const recentNotyetPay = sqlSentence.recentNotyetPay;
    const recentRefund = sqlSentence.recentRefund;
    let dayThree = req.query.dayThree || 0;
    if (dayThree == 0) {
        dayThree = 7;
    } else if (dayThree == 1) {
        dayThree = 15;
    } else if (dayThree == 2) {
        dayThree = 30;
    } else if (dayThree == 3) {
        dayThree = 90;
    }
    let arr = [];
    function alreadyPaid(date, callback) {
        querySql(recentAlreadyPay(date), function (err, row, fields) {
            if (err) {

                res.json({
                    errorInfo: '0x00002',
                    err: err,
                })
            } else {
                callback(row[0])
            }
        })
    };
    function readyTopay(date,callback) {
        querySql(recentNotyetPay(date), function (err, row, fields) {
            if (err) {

                res.json({
                    errorInfo: '0x00002',
                    err: err,
                })
            } else {
                alreadyPaid(date,function(paid){
                    callback(paid,row[0])
                })
            }
        })
    }
    for (let i = 1; i <= dayThree; i++) {
        let date = moment().subtract(i, 'days').format('YYYY-MM-DD')
        readyTopay(date, function (paid,readyPay) {
            let p = new Promise((resolve, reject) => {
                querySql(recentRefund(date), function (err, row, fields) {
                    if (err) {
                        res.json({
                            errorInfo: '0x00002',
                            err: err,
                        })
                    } else {
                        /*因为其为异步执行，无法保证执行返回数据的顺序，且需要保证执行效率，不改动为同步，利用sequence对其进行添加序号*/
                        resolve({ alreadyPaid: paid.sum,notYetPay:readyPay.sum,refund: row[0].sum,sequence: i,date:date});
                    }
                })
            })

            async function arrPush() {
                await p;
                arr.push(p);
                if (arr.length == dayThree) {
                    Promise.all(arr).then((result) => {
                        res.json({
                            data: result,
                            errorInfo: '0x00001',
                        })
                    }).catch((error) => {
                        res.json({
                            errorInfo: '500',
                            err: err,
                        })
                    })
                }
            }

            arrPush();
        })

    }
});
module.exports = router;