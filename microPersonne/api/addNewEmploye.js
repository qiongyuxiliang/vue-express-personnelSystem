/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    moment=require('moment'),
    bodyParser = require('body-parser');
router.post("/", function (req, res, next) {
    const addNewEmploye = sqlSentence.addNewEmploye;
    let emp = req.body;
    emp.beginContract = moment(new Date(emp.contractTime.split(',')[0])).format("YYYY-MM-DD");
    emp.endContract = moment(new Date(emp.contractTime.split(',')[1])).format("YYYY-MM-DD");
    emp.continueContractSt = moment(new Date(emp.continueContract.split(',')[0])).format("YYYY-MM-DD");
    emp.continueContractEd = moment(new Date(emp.continueContract.split(',')[1])).format("YYYY-MM-DD");
    emp.probationP = emp.probationP.split(',').map(item=>moment(new Date(item)).format("YYYY-MM-DD")).join(',');
        
    conn(addNewEmploye(req.body),function(err,row,fields){
        if(err){ 
            res.json({            
                err:err,
                result:global.FAILURE,
            });
        }else{
            res.json({
                status:200,
                msg:'成功添加员工！',
                data:row,
            });
        }
      
    });
});

module.exports = router;