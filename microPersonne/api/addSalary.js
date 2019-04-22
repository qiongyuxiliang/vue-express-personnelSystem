/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.post("/", function (req, res, next) {
    const addSalary = sqlSentence.addSalary;
    
    let salary={createDate: req.body.createDate,
    basicSalary: req.body.basicSalary,
    trafficSalary: req.body.trafficSalary,
    lunchSalary: req.body.lunchSalary,
    bonus: req.body.bonus,
    pensionBase: req.body.pensionBase,
    pensionPer: req.body.pensionPer,
    medicalBase: req.body.medicalBase,
    medicalPer: req.body.medicalPer,
    accumulationFundBase: req.body.accumulationFundBase,
    accumulationFundPer: req.body.accumulationFundPer,
    name : req.body.name}
    conn(addSalary(salary),function(err,row,fields){
        if(err){
            res.json({
                result:global.FAILURE,
                msg:'服务器错误',
                err:err,
            })
        }else{
            res.json({
                data:row,
                msg:'添加成功！'
            })
        }
    })
   
});

module.exports = router;