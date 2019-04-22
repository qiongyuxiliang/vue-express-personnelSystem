const express = require('express'),
    moment = require('moment'),
    /*moment 插件用于格式化日期*/
    router = express.Router(),
    querySql = require('../mx99Conn.js'),
    sqlSentence = require('../sql/mx99Sql');
router.get('/', function (req, res, next) {

    const recentNewUserOrderSum = sqlSentence.recentNewUserOrderSum;
    const recentOldUserOrderSum = sqlSentence.recentOldUserOrderSum;
    let dayTwo = req.query.dayTwo || 0;
    if (dayTwo == 0) {
        dayTwo = 7;
    } else if (dayTwo == 1) {
        dayTwo = 15;
    } else if (dayTwo == 2) {
        dayTwo = 30;
    } else if (dayTwo == 3) {
        dayTwo = 90;
    }
    let arr = [];
    function getPromiseArr(date, callback) {
        querySql(recentNewUserOrderSum(date), function (err, row, fields) {
            if (err) {
                reject(err);
                res.json({
                    errorInfo: '0x00002',
                    err: err,
                })
            } else {
                callback(row[0])
            }
        })
    };
    for (let i = 1; i <= dayTwo; i++) {
        let date = moment().subtract(i, 'days').format('YYYY-MM-DD')
        getPromiseArr(date, function (data) {
            let p = new Promise((resolve, reject) => {
                querySql(recentOldUserOrderSum(date), function (err, row, fields) {
                    if (err) {
                        reject(err);
                        res.json({
                            errorInfo: '0x00002',
                            err: err,
                        })
                    } else {
                        /*因为其为异步执行，无法保证执行返回数据的顺序，且需要保证执行效率，不改动为同步，利用sequence对其进行添加序号*/
                        resolve({oldUserOrderSum: row[0].oldUserOrderSum, newUserOrderSum: data.newUserOrderSum, sequence: i,date:date});
                    }
                })
            })

            async function arrPush() {
                await p;
                arr.push(p);
                if (arr.length == dayTwo) {
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