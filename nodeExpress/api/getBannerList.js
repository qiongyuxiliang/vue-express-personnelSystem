/*商品上架*/
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),

    sqlSentence = require('../sql/sql.js'),
    /*从mongoDB里查询数据*/
    bannerList = require('../mongooseModel/bannerList.js');
router.get('/', function (req, res, next) {
        bannerList.find({place: 'home',status:'1'}).sort({bannerRank : 'asc'}).exec(function (err, doc) {
            if (err) {
                res.json({
                    errorInfo: '0x00002'
                })
            } else {
                res.json({
                    result:'0x00001',
                    data:doc
                })
            }
        })


});
module.exports = router;