/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    moment = require('moment'),
    bodyParser = require('body-parser');
router.put("/", function (req, res, next) {
    const updateSalary = sqlSentence.updateSalary;
    let salary = req.body;
    /**
     * 如果不点击日期格式会造成日期格式的错误，在此做一次兼容性处理
     */
   req.body.createDate= moment(salary.createDate).format('YYYY-MM-DD')
    conn(updateSalary(salary),function(err,row,fields){
        if(err){
            res.json({
                result:global.FAILURE,
                msg:'服务器错误',
                err:err,
            })
        }else{
            res.json({
                data:row,
                msg:'更新账套成功！'
            })
        }
    })
   
});

module.exports = router;