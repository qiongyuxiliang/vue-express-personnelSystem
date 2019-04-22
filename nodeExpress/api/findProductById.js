/*商品上架*/
var express = require('express');
router = express.Router(),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),
    querySql = require('../mysqlConn.js'),
    sqlSentence = require('../sql/sql.js'),
    /*从mongoDB里查询数据*/
    offlineProduct = require('../mongooseModel/offlineProduct.js');
router.get('/', function (req, res, next) {
    var id = req.query.productId,
        sqlFindProductById = sqlSentence.findProductById;

    function SqlSearch(callback) {
        offlineProduct.find({productId: id,}, function (err, doc) {
            if (err) {
                res.json({
                    errorInfo: '0x00002'
                })
            } else {
                callback(doc)
            }
        })
    }

    querySql(sqlFindProductById(id), function (err, rows, fields) {
        if (err) {
            res.json({
                code: '0x00002',
                err: err
            })
        } else {
            SqlSearch(function (doc) {
                rows[0].productDetail = doc[0];
                // console.log(rows[0])
                res.json({
                    result: '0x00001',
                    data: rows[0],
                    sql:sqlFindProductById(id),
                })
            })

        }
    })
});
module.exports = router;