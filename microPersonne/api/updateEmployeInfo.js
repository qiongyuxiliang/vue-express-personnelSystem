/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.put("/", function (req, res, next) {
    const updateEmployeInfo = sqlSentence.updateEmployeInfo;
    
   let emp = req.body;
    let workState,notWorkDate;
    workState=!!workState?workState:null;
    notWorkDate=!!notWorkDate?notWorkDate:null;
    conn(updateEmployeInfo(emp),function(err,row,fields){
        if(err){ 
            res.json({ 
                err:err,
                result:global.FAILURE,
            })
        }else{
            res.json({
                data:row,
            })
        }
      
    })
  


});

module.exports = router;