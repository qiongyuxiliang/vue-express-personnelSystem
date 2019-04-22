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
        status=req.query.status,
        bannerRank=req.query.bannerRank;
    if(bannerRank==1&&status=='up'){
        res.json({
            result:'已经是第一张'
        })
        return;
    }
    if(status=='up'){
        /*向上移动*/
        // bannerList.update({bannerRank: parseInt(bannerRank),status:'1',place:'home'},{$inc:{bannerRank:-1}},{multi:false},function(err,doc){
        //     if(err){
        //         res.json({
        //             errorInfo: '0x00002',
        //             mongoErr:err,
        //         })
        //     }else{
                bannerList.update({bannerRank:(parseInt(bannerRank)-1),status:'1',place:'home'},{$inc:{bannerRank:1}},{multi:false},function(err,docs){
                    if(err){
                        res.json({
                            errorInfo: '0x00002',
                            mongoErr:err,
                        })
                    }else{
                        bannerList.update({bannerId: bannerId,status:'1',place:'home'},{$inc:{bannerRank:-1}},{multi:false},function(err,doc){
                                if(err){
                                    res.json({
                                        errorInfo: '0x00002',
                                        mongoErr:err,
                                    })
                                }else{
                                    res.json({
                                        data:docs,
                                        result:'0x00001',
                                    })
                                }
                })
            }
        })

    }else if(status=='down'){
        /*向下移动 先移动他的上一个元素*/

        bannerList.update({bannerRank: (parseInt(bannerRank)+1),status:'1',place:'home'},{$inc:{bannerRank:-1}},{multi:false},function(err,doc){
            /*age:{ $ne:24}*/
            console.log(parseInt(bannerRank)+1)
            if(err){
                res.json({
                    errorInfo: '0x00002',
                    mongoErr:err,
                })
            }else{
                bannerList.update({bannerId: bannerId,status:'1',place:'home'},{bannerRank:(parseInt(bannerRank)+1)},{multi:false},function(err,docs){
                    if(err){
                        res.json({
                            errorInfo: '0x00002',
                            mongoErr:err,
                        })
                    }else{
                        res.json({
                            data:docs,
                            data2:doc,
                            result:'0x00001',
                        })
                    }
                })
            }
        })
    }

});
module.exports = router;