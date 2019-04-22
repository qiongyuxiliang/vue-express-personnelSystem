/*商品上架*/
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),

    sqlSentence = require('../sql/sql.js'),
    /*从mongoDB里查询数据*/
    bannerList = require('../mongooseModel/bannerList.js');
router.post('/', function (req, res, next) {

    var uri = req.body.uri,
        bannerType = req.body.bannerType,
        forward = req.body.forward,
        bannerId = req.body.bannerId,
        data;
    console.log(req.body)
    if (!uri) {
        data = {
            bannerType: bannerType,
            forward: forward,
        }
    } else {
        data = {
            uri: uri,
            bannerType: bannerType,
            forward: forward,
        }
    }
    bannerList.findOneAndUpdate({bannerId: bannerId}, data, {new:true}, function (err, doc) {
        if (err) {
            res.json({
                errorInfo: '0x00002',
                mongoErr: err,
            })
        }
        res.json({
            data: doc,
            result: '0x00001',
        })
    })
})
;
module.exports = router;