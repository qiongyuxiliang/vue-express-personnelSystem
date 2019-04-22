var express = require('express');
var http = require('http');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var path = require("path");
var fs = require('fs');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
/*引入mongoDB的Model*/
var offlineProduct = require('./mongooseModel/offlineProduct.js');
var DotLog = require("./dotLog.js");
var Logistics = require("./logistics.js");
var querystring = require('querystring');
var querySql = require('./mysqlConn.js');
// var encrt = require('../config/token.js');
var app = express();
/*加载路由---上届线*/
var indexRouter = require('./api/index.js');
var userRouter = require('./api/user.js');
var loginRouter = require('./api/login.js');
var queryAllProducts = require('./api/queryAllProducts.js');
var editProducts = require('./api/editProduct.js');
var putAwayProductById = require('./api/putAwayProductById.js');
var delProductById = require('./api/delProductById.js');
var findProductById = require('./api/findProductById.js');
// var queryUserTypeOrTel = require('./api/queryUserTypeOrTel.js');
var checkUserDetailInfoById = require('./api/checkUserDetailInfo.js');
var instantrebate = require('./api/instantrebate.js');
var getChatNextUser = require('./api/getChatNextUser.js');
var auditCommission = require('./api/auditCommission.js');
var addNewProduct = require('./api/addNewProduct.js');
var updateProductById = require('./api/updateProductById');
var orderManagement = require('./api/orderManagement');
var queryOrderBuinessByOrderId = require('./api/queryOrderBuinessByOrderId');
var queryUserInfoDTOByParameters = require('./api/queryUserInfoDTOByParameters');
var queryAllUsersById = require('./api/queryAllUsersById');
var getBannerList = require('./api/getBannerList');
var addBannerPic = require('./api/addBannerPic');
var editBannerPic =require('./api/editBannerPic');
var deleteBannerPic =require('./api/deleteBannerPic');
var moveBannerPic = require('./api/moveBannerPic');
/*加载路由---下届线*/
/*美享99加载路由---上届线*/
var queryTodayOrderPaidNum = require('./api/queryTodayOrderPaidNum');
var getRecentOrderSum = require('./api/getRecentOrderSum');
var newUserAndOldUserOrders= require('./api/newUserAndOldUserOrders');
var paidNotPayAndRefund =require('./api/paidNotPayAndRefund');
var sysUserSumChange =require('./api/sysUserSumChange');
var exportExcel = require('./api/exportExcel');
/*美享99加载路由---下届线*/
/*测试*/
// var exportExcel = require('./api/exportExcel');
/*测试*/
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,loginToken");
    next();
});
// var routes = require("./routes/index.js");
app.use(express.static(path.resolve(__dirname, '../../')));
// bodyParser.urlencoded解析form表单提交的数据
app.use(bodyParser.urlencoded({extended: false}));
// bodyParser.json解析json数据格式的
app.use(bodyParser.json());
app.use(cookieParser());
/*托管静态文件目录*/
app.use(express.static( 'public'))
app.use(function (req, res, next) {
    var url = req.url;
    if (url == '/microManagement/') {
        res.sendFile(path.resolve(__dirname, '../../../templates/angular/microManagementIndex.html'));
    }
    else {
        next();
    }
})
/*引用路由---上届线*/
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/login', loginRouter);
app.use('/queryAllProducts', queryAllProducts);
app.use('/editProducts', editProducts);
app.use('/putAwayProductById', putAwayProductById);
app.use('/delProductById', delProductById);
app.use('/findProductById', findProductById);
// app.use('/queryUserTypeOrTel', queryUserTypeOrTel);
app.use('/checkUserDetailInfoById', checkUserDetailInfoById);
app.use('/instantrebate', instantrebate);
app.use('/getChatNextUser', getChatNextUser);
app.use('/auditCommission',auditCommission);
app.use('/addNewProduct',addNewProduct);
app.use('/updateProductById',updateProductById);
app.use('/business/transaction/orderManagement',orderManagement);
app.use('/business/transaction/queryOrderBuinessByOrderId',queryOrderBuinessByOrderId);
app.use('/queryUserInfoDTOByParameters',queryUserInfoDTOByParameters);
app.use('/queryAllUsersById',queryAllUsersById);
app.use('/getBannerList',getBannerList);
app.use('/addBannerPic',addBannerPic);
app.use('/editBannerPic',editBannerPic);
app.use('/deleteBannerPic',deleteBannerPic);
app.use('/moveBannerPic',moveBannerPic);
// app.use('/examinToken',examinToken);
/*引用路由---下届线*/
/*美享99引用路由--上届线*/
app.use('/meixiang99/queryTodayOrderPaidNum',queryTodayOrderPaidNum);
app.use('/meixiang99/getRecentOrderSum',getRecentOrderSum);
app.use('/meixiang99/newUserAndOldUserOrders',newUserAndOldUserOrders);
app.use('/meixiang99/paidNotPayAndRefund',paidNotPayAndRefund);
app.use('/meixiang99/sysUserSumChange',sysUserSumChange);
app.use('/meixiang99/exportExcel',exportExcel);

/*美享99引用路由--下届线*/
/*每个都要经过登录的验证,上*/
// var exa = require('./api/examinToken.js');
/*测试*/

/*每个都要经过登录的验证，下*/
/*注册*/
app.get('/loginTel', function (req, res) {

})
app.get('/getData', function (req, res) {
    console.log(querySql)
    console.log('111');
    sql = 'select * from sys_dict';

    querySql(sql, function (err, rows, fields) {
        res.json({
            rows: rows,
            filed: fields
        })

    })
})
app.post('/dotLog', function (req, res) {
    var dotLog = new DotLog({
        openId: req.body.openId, //微信ID
        dotLogName: req.body.dotLogName, //埋点名称
        productId: req.body.productId,
        date: new Date(), //埋点时间
    });
    dotLog.save(function (err, ok) {
        if (err) {
            console.log("Error:" + err);
            res.json({
                success: false,
                code: 200
            });
        } else {
            console.log("Res:" + ok);
            res.json({
                dotLogName: req.body.dotLogName,
                success: true,
                code: 200
            });
        }
    });
});
/*测试mongodb*/
app.get('/getfromMongo', function (req, res) {
    offlineProduct.find({productId: "101",}, function (err, doc) {
        if (err) {
            res.json({
                err
            })
        } else {
            res.json({
                data: doc[0].listPic
            })
        }
    })
})
app.post('/bindWaybillId', function (req, res) {
    var logisticCode = req.body.logisticCode;
    var transactionId = req.body.transactionId;
    if (transactionId == null || transactionId == "" || transactionId == undefined || logisticCode == null || logisticCode == "" || logisticCode == undefined) {
        res.json({
            success: false,
            code: 200,
            data: '参数不全'
        });
    } else {
        Logistics.find({transactionId: transactionId}, function (err, doc) {
            if (err) {
                return console.error(err);
            } else {
                if (doc.length != 0) {
                    res.json({
                        data: 'transactionId重复',
                        success: false,
                        code: 200
                    });
                } else {
                    Logistics.find({logisticCode: logisticCode}, function (err, doc) {
                        if (err) {
                            return console.error(err);
                        } else {
                            if (doc.length != 0) {
                                res.json({
                                    data: 'logisticCode重复',
                                    success: false,
                                    code: 200
                                });
                            } else {
                                var logistics = new Logistics({
                                    transactionId: transactionId, //交易流水号
                                    logisticCode: logisticCode, //快递单号
                                    date: new Date(), //埋点时间
                                });

                                logistics.save(function (err, ok) {
                                    if (err) {
                                        return console.error(err);
                                    } else {
                                        res.json({
                                            data: '绑定成功',
                                            success: true,
                                            code: 200
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            }
        })
    }
});
app.post('/demofind', function (req, res) {
    Logistics.find({transactionId: '111'}, function (err, doc) {
        res.json({
            data: doc,
            success: false,
            code: 200
        });
    })
})
app.post('/logisticsQuery', function (req, res) {
    var logisticCode = req.body.logisticCode;
    var transactionId = req.body.transactionId;
    //发送 http Post 请求
    if ((logisticCode == null || logisticCode == "" || logisticCode == undefined) && (transactionId == null || transactionId == "" || transactionId == undefined)) {
        res.json({
            data: '参数不全',
            success: false,
            code: 200,
        });
    } else {
        if (logisticCode == null || logisticCode == "" || logisticCode == undefined) {
            Logistics.find({transactionId: transactionId}, function (err, doc) {
                if (err) {
                    return console.error(err);
                } else {
                    if (doc.length == 0) {
                        res.json({
                            data: 'transactionId未绑定logisticCode',
                            success: false,
                            code: 200,
                        });
                    } else {
                        ebusinessOrderHandle(doc[0].logisticCode, function (data) {
                            res.json({
                                data: data,
                                success: true,
                                code: 200,
                            });
                        })
                    }
                }
            })
        } else {
            ebusinessOrderHandle(logisticCode, function (data) {
                res.json({
                    data: data,
                    success: true,
                    code: 200,
                });
            })
        }
    }
});

function ebusinessOrderHandle(logisticCode, callback) {
    var apiKey = 'cd6f65a3-9dc3-4d3a-a844-b7e5fc127926';
    var dataJson = "{'OrderCode':'','ShipperCode':'YD','LogisticCode':" + logisticCode + "}";
    var requestData = escape(dataJson).replace(/\%u/g, '\\u');
    var md5 = crypto.createHash("md5");
    md5.update(dataJson + apiKey);
    var str = md5.digest('hex');
    var s = new Buffer(str).toString('base64');
    var utfData = escape(s).replace(/\%u/g, '\\u');

    var postData = querystring.stringify({
        "RequestType": '1002',
        "EBusinessID": '1325705',
        "RequestData": requestData,
        "DataSign": utfData,
        "DataType": '2',
    });
    var options = {
        hostname: 'api.kdniao.cc',
        port: 80,
        path: '/Ebusiness/EbusinessOrderHandle.aspx',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Content-Length': Buffer.byteLength(postData),
        }
    }
    var request = http.request(options, function (response) {
        var requestJson = '';
        response.on('data', function (chun) {
            requestJson += chun;
        });
        response.on('end', function () {
            callback && callback(JSON.parse(requestJson))
        });
    });
    request.on('error', function (err) {
        console.error(err);
    });
    request.write(postData);
    request.end();
}

app.listen(3000);
console.log('Listening on port 3000...');