/*商品上架*/
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),
    sqlSentence = require('../sql/sql.js'),
    /*从mongoDB里查询数据*/
    bannerList = require('../mongooseModel/bannerList.js');
router.get('/', function (req, res, next) {
    var bannerId= req.query.bannerId,
        bannerRank= req.query.bannerRank;
    bannerList.update({bannerRank: {$gte:bannerRank}},{$inc:{bannerRank:-1}},{multi:true},function(err,doc){
        if(err){
            res.json({
                errorInfo: '0x00002',
                mongoErr:err,
            })
        }else{
            bannerList.remove({bannerId:bannerId},function(err,doc){
                if(err) {
                    res.json({
                        errorInfo: '0x00002',
                        mongoErr: err,
                    })
                }else{
                    res.json({
                        data:doc,
                        result:'0x00001'
                    })
                }
            })
        }
    })
});
module.exports = router;