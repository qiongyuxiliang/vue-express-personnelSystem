/*获取数据接口*/
var express = require('express'),
    router = express.Router(),
    uuidV4 = require('uuid/v4'),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),
    encrt = require('../config/token.js'),
    sqlSentence = require('../sql/sql.js'),
    offlineProduct = require('../mongooseModel/offlineProduct.js');

router.post('/', function (req, res, next) {
    var sqladdNewProduct = sqlSentence.addNewProduct;
    /*id, productName, productId, brand, type, description, firstUrl, price, status, createDate, secondType, productClassId, productPrefecture, productAmount, teacherName, parentProductId, astrict*/
    var productName = req.body.productName,
        productId = req.body.productId,
        productBrand = req.body.brand,
        productRetailPrice = req.body.price,
        productMarketPrice = req.body.productDetail.productMarketPrice,
        productStock = req.body.productAmount,
        productCreateDate = req.body.createDate,
        productDetail = req.body.description,
        productFirstUrl = req.body.firstUrl || 'urlError',
        productStatus = req.body.status,
        spec = req.body.productDetail.spec, /*品种*/
        tag = req.body.productDetail.tag, /*包邮*/
        id = uuidV4().split('-').join(''),
        type = req.body.type,
        detailPic = req.body.productDetail.detailPic,
        listPic = req.body.productDetail.listPic,
        productSalesVolume = req.body.productDetail.productSalesVolume,
        services = req.body.productDetail.services,
        senderAddress = req.body.productDetail.senderAddress;

    var data = {
        productId: productId,
        tag: tag,
        spec: spec,
        detailPic: detailPic,
        listPic: listPic,
        productMarketPrice: productMarketPrice,
        productSalesVolume: productSalesVolume,
        senderAddress: senderAddress,

    }
    var addNewProduct = new offlineProduct(data);

    /* productId: {type: String},//产品id
    tag: {type: Array}, //是否包邮
    listPic: {type: Array},//list图片地址
    services: {type: Array},//发货以及营业
    spec: {type: Array},//样式
    detailPic: {type: Array},//详情图
    senderAddress: {type: String},//发货地址
    productSalesVolume: {type: String},//高的售价
    productMarketPrice: {type: String},//市场价
    productAmount: {type: Number},//产品的数量*/
    function SqlSearch(callback) {
        offlineProduct.find({productId: productId,}, function (err, doc) {
            if (err) {
                res.json({
                    errorInfo: '0x00002',
                    mongoErr:err,
                })
            } else {
                if(doc.length==0){
                    addNewProduct.save(function (err, doc) {
                        if (err) {
                            res.json({
                                errorInfo: '0x00002',
                                mongoErr:err,
                            })
                        } else {
                            callback(doc)
                        }
                    })
                }else if(doc.length>0){
                    res.json({
                        errorInfo: '0x00002',
                        err:'该商品id在mongodb中存在，请换个商品id',
                    })
                }
            }
        })

    }
    SqlSearch(function(data){
        querySql(sqladdNewProduct(id, productName, productId, productBrand, type, productDetail, productFirstUrl, productRetailPrice, productStatus, productCreateDate, '33', '', '', productStock, '', '', ''), function (err, row, fields) {
            if (err) {
                if(err.code=="ER_DUP_ENTRY"){
                    res.json({
                        errorInfo: '0x00002',
                        err: '商品id已经在SQL存在，请换个商品id输入',
                    })
                }
            } else {
                res.json({
                    errorInfo: '0x00001',
                    data: row,
                    mongoData:data,
                })
            }
        })
    })



});

module.exports = router;