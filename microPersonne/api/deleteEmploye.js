/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.delete("/employee/basic/deleteEmploye/:ids", function (req, res, next) {
    const deleteEmploye = sqlSentence.deleteEmploye;
    let ids = req.params.ids;
    
    let newIdArr;
    if(/,/.test(ids)){
        let idArr = ids.split(',');
        idArr.splice(idArr.length - 1, 1);
         newIdArr = idArr.join(',');
    }else{
         newIdArr =ids;
    }
    
    /*let validNum,extraPos,extraNums,proId;
    function getEmployeId(id){
         validNum = id.toString();
         extraPos = 8-validNum.length;
         extraNums = '00000000000000000000000';
         proId = extraNums.slice(0,extraPos).concat(validNum);
         return proId;
    }
    let newIdArr=idArr.map((item)=>{
        return getEmployeId(item);
    });*/

    conn(deleteEmploye(newIdArr), function (err, row, fields) {
        if (err) {
            res.json({
                err: err,
                result: global.FAILURE,
                msg: '服务器错误！',
            });       
        } else {
            res.json({
                result:global.SUCCESS,
                msg:'删除成功！',

            });
        }
    });




});

module.exports = router;