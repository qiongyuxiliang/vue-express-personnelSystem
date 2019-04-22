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
    var sqlSqlUpdatePoduct = sqlSentence.updateProduct;
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

    function SqlSearch(callback) {
        offlineProduct.findOneAndUpdate ({productId: productId,},data, function (err, doc) {
            if (err) {
                res.json({
                    errorInfo: '0x00002',
                    mongoErr:err,
                })
            } else {

               callback(doc);
            }
        })
    }
    SqlSearch(function(data){
        // updateProduct: function (id,productId,productName,brand,description,firstUrl,type,price,status,secondType,productClassId,productAmount,productPrefecture,astrict) {
        querySql(sqlSqlUpdatePoduct(productId, productId,productName, productBrand, productDetail,productFirstUrl,type,productRetailPrice, productStatus, '-',  '', productStock, '', ''), function (err, row, fields) {
            // console.log(id,type,productFirstUrl,productName,productId)
            if (err) {
                    res.json({
                        errorInfo: '0x00002',
                        err:err,
                    })
            } else {
                res.json({
                    result: '0x00001',
                    data: row,
                    mongoData:data,
                })
            }
        })
    })
});

module.exports = router;