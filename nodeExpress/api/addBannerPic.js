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
        bannerRank = req.body.bannerRank||'1',
        forward =req.body.forward,
        place='home',
        status ='1',
        createDate=getFormatDate(new Date()),
        bannerId= getDateString(new Date());
    function getFormatDate(date){
        var year = date.getFullYear().toString(),
            month = (date.getMonth() + 1).toString(),
            dat = date.getDate().toString();
        return year+'-'+addZero(month)+'-'+addZero(dat);
    }
    function addZero(num) {
        if (num < 10) {
            return '0' + num;
        }
        return num;
    }
    function getDateString(date){
        var year = date.getFullYear().toString(),
            month = (date.getMonth() + 1).toString(),
            dat = date.getDate().toString(),
            hour = date.getHours().toString(),
            minute = date.getMinutes().toString(),
            second = date.getSeconds().toString(),
            millsecond = date.getMilliseconds().toString();
        if(millsecond<10){
            millsecond = '000'+millsecond;
        }else if(millsecond<100){
            millsecond = '00'+millsecond;
        }
        return year+addZero(month)+addZero(dat)+addZero(hour)+addZero(minute)+addZero(second)+millsecond;
    }
    var data = {
        uri: uri,
        bannerType: bannerType,
        bannerRank: bannerRank,
        forward: forward,
        place: place,
        status: status,
        createDate: createDate,
        bannerId: bannerId,
    }

    function getLen(callback){
        bannerList.find({place: 'home',status:'1'},function(err,dc){
            if(err){
                res.json({
                    errorInfo: '0x00002',
                    mongoErr:err,
                })
            }else{
                callback(dc.length)
            }
        })
    }
    getLen(function(len){
        if(bannerRank>=(len+1)){
            data.bannerRank=len+1;
            bannerRank=len+1;
            console.log(bannerRank,data.bannerRank)
        }
        bannerList.update({bannerRank: {$gte:bannerRank}},{$inc:{bannerRank:1}},{multi:true},function(err,docs){
            if(err){
                res.json({
                    errorInfo: '0x00002',
                    mongoErr:err,
                })
            }else{
                var addNewBannerPic = new bannerList(data);
                addNewBannerPic.save(function (err, doc) {
                    if (err) {
                        res.json({
                            errorInfo: '0x00002',
                            mongoErr:err,
                        })
                    } else {
                        res.json({
                            data:doc,
                            result:'0x00001'
                        })
                    }
                })
            }
        })
    })


});
module.exports = router;