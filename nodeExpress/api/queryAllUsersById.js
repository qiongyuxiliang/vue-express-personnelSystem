/*获取数据接口*/
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),
    sqlSentence = require('../sql/sql.js');

router.get('/', function (req, res, next) {
    var SqlqueryAllUsersById = sqlSentence.queryAllUsersById,
        id = req.query.sysUserId;
    function personalInfo(callback) {
        querySql(SqlqueryAllUsersById(id).queryPersonalInfo, function (err, row, fields) {

            if (err) {
                res.json({
                    errorInfo: '0x00002',
                    err:err
                })
            }
            callback(row)
        })
    }
function sumaryPersonal(callback){
    personalInfo(function (data) {
        querySql(SqlqueryAllUsersById(id).queryPersonalPtInfo, function (err, row, fields) {

            if (err) {
                res.json({
                    errorInfo: '0x00002',
                    err:err
                })
            }
            callback(row.concat(data))
        })
    })
}

/*父级的信息*/
    function parentInfo(callback){
        querySql(SqlqueryAllUsersById(id).queryParentsInfo, function (err, row, fields) {

            if (err) {
                res.json({
                    errorInfo: '0x00002',
                    err:err
                })
            }
            callback(row)
        })
    }
    function parentsInfo(callback){
        parentInfo(function(data){
            if(data.length==0){
                querySql(SqlqueryAllUsersById(id).queryParentsPTInfo, function (err, row, fields) {

                    if (err) {
                        res.json({
                            errorInfo: '0x00002',
                            err:err
                        })
                    }
                    callback(row)
                })
            }else{
                callback(data)
            }
        })
    }
    /*子级元素*/
    function childInfo(callback){
        querySql(SqlqueryAllUsersById(id).queryChildrenInfo, function (err, row, fields) {

            if (err) {
                res.json({
                    errorInfo: '0x00002',
                    err:err
                })
            }
            callback(row)
        })
    }
    function childrenInfo(callback){
        childInfo(function(data){

                querySql(SqlqueryAllUsersById(id).queryChildrenPtInfo, function (err, row, fields) {

                    if (err) {
                        res.json({
                            errorInfo: '0x00002',
                            err:err
                        })
                    }
                    callback(row.concat(data))
                })
        })
    }
    childrenInfo(function(child){
        parentsInfo(function(parent){
            sumaryPersonal(function(personal){
                res.json({
                    result:'0x00001',
                    personal:personal,
                    parent:parent,
                    child:child,
                })
            })
        })
    })

});

module.exports = router;