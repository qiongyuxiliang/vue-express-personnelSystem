/*获取数据接口*/
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),
    sqlSentence = require('../sql/sql.js');

router.post('/', function (req, res, next) {
    var SqlqueryUserInfoDTOByParameters = sqlSentence.queryUserInfoDTOByParameters,
        pageSize = req.body.pageSize,
        pageNo = (req.body.pageNo-1)*pageSize<0? (req.body.pageNo-1)*pageSize:0,
        st = req.body.st || '',
        et = req.body.et || '',
        userType = req.body.userType || '',
        mobile = req.body.mobile;

    function getLength(callback) {
    querySql(SqlqueryUserInfoDTOByParameters('','',userType,mobile,st,et), function (err, row, fields) {

        if (err) {
            res.json({
                errorInfo: '0x00002',
                err:err
            })
        }
       callback(row[0]["COUNT(1)"])
    })
    }

    getLength(function (data) {
        querySql(SqlqueryUserInfoDTOByParameters(pageNo,pageSize,userType,mobile,st,et), function (err, row, fields) {

            if (err) {
                res.json({
                    errorInfo: '0x00002',
                    err:err
                })
            }
            res.json({
                data: {
                    data: row,
                    totalCount: data,
                    errorInfo: '0x00001',
                    sql:SqlqueryUserInfoDTOByParameters(pageNo,pageSize,userType,mobile,st,et)
                }
            })
        })
    })

});

module.exports = router;