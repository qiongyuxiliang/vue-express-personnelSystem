const express = require('express'),
    moment = require('moment'),
    /*moment 插件用于格式化日期*/
    router = express.Router(),
    querySql = require('../mx99Conn.js'),
    sqlSentence = require('../sql/mx99Sql');
router.get('/', function (req, res, next) {

    const getRecentOrderSum = sqlSentence.getRecentOrderSum;
    const getRecentGoodsSum = sqlSentence.getRecentGoodsSum;
    let dayOne = req.query.dayOne || 0;
    if (dayOne == 0) {
        dayOne = 7;
    } else if (dayOne == 1) {
        dayOne = 15;
    } else if (dayOne == 2) {
        dayOne = 30;
    } else if (dayOne == 3) {
        dayOne = 90;
    }
    let arr = [];
    function getPromiseArr(date, callback) {
        querySql(getRecentGoodsSum(date), function (err, row, fields) {
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
    for (let i = 1; i <= dayOne; i++) {
        let date = moment().subtract(i, 'days').format('YYYY-MM-DD')
        getPromiseArr(date, function (data) {
            let p = new Promise((resolve, reject) => {
                querySql(getRecentOrderSum(date), function (err, row, fields) {
                    if (err) {
                        reject(err);
                        res.json({
                            errorInfo: '0x00002',
                            err: err,
                        })
                    } else {
                        /*因为其为异步执行，无法保证执行返回数据的顺序，且需要保证执行效率，不改动为同步，利用sequence对其进行添加序号*/
                        resolve({OrderSum: row[0].daysOrderNum, goodsSum: data.GoodsSum, sequence: i,date:date});
                    }
                })
            })

            async function arrPush() {
                await p;
                arr.push(p);
                if (arr.length == dayOne) {
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