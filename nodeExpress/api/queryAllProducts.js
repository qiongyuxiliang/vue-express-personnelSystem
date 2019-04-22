/*获取数据接口*/
var express = require('express'),
    router = express.Router(),
    querySql = require('../mysqlConn.js'),
    sqlSentence = require('../sql/sql.js');
router.post('/', function (req, res, next) {
    sqlQueryAllProducts = sqlSentence.queryAllProducts;
    sqlGetProductId = sqlSentence.getProductId;
    sqlGetSellNumByProductId = sqlSentence.getSellNumByProductId;
    var pageNo = (req.body.pageNo - 1) * 5>0?(req.body.pageNo - 1)*5:0,
        pageSize = req.body.pageSize,
        status = req.body.requestData.status,
        productName = req.body.requestData.productName,
        productId = req.body.requestData.productId;
    const arr = new Array()
    async function getData(product_id, callback, index) {
        var data0;
        var data1;
        var data = null;
        await
            querySql(sqlGetSellNumByProductId(product_id), function (err, row1, fields) {
                if (err) {
                    res.json({
                        errorInfo: '0x00002',
                    })
                } else {
                    data1 = row1;
                    querySql(sqlQueryAllProducts(product_id), function (err, row0, fields) {
                        if (err) {
                            res.json({
                                errorInfo: '0x00002',
                            })
                        } else {
                            data0 = row0;
                            data = Object.assign({}, data0[0], {sellNum: data1[0]['IFNULL(SUM(product_num),0)']})
                            arr.push(data);
                            callback(arr);
                        }
                    })
                }
            })
    }

    async function fetchData(callback) {
        await
            querySql(sqlGetProductId(pageNo, pageSize, status, productId, productName), function (err, rows, fields) {

                if (err) {
                    res.json({
                        errorInfo: '0x00002',
                        err: err
                    })
                } else {
                    const len = rows.length;
                    if (len == 0) {
                        res.json({
                            data: {
                                totalCount: 0,
                                errorInfo: '0x00001',
                                data: ''
                            }
                        })
                        return;
                    } else {
                        for (let i = 0; i < len; i++) {
                            product_id = rows[i].product_id;
                            getData(product_id, function (arr) {
                                if (arr.length == len) {
                                    callback(arr)
                                }
                            });
                        }
                    }
                }
            })
    }

    async function getDataLength(callback) {
        // 获取长度
        await
            querySql(sqlGetProductId('', '', status, productId, productName), function (err, rows, fields) {

                if (err) {
                    res.json({
                        code: '0x00002',
                        err: err,
                        length: '00'
                    })
                } else {
                    var le = rows.length;
                    callback(le)
                }
            })
    }

    /*时间排序*/
    function compare(property) {
        return function (obj1, obj2) {
            var value1 = obj1[property];
            var value2 = obj2[property];
            return value2 - value1; // 升序
        }
    }

    /*获取回调函数的值*/
    fetchData(function (data) {
        var sortObj = data.sort(compare("create_date"));
        getDataLength(function (l) {
            res.json({
                data: {
                    errorInfo: '0x00001',
                    totalCount: l,
                    data: sortObj,
                }
            })
        })
    })
});

module.exports = router;