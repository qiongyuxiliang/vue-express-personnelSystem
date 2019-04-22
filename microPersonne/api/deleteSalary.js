/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.delete("/salary/sob/deleteSalary/:ids", function (req, res, next) {
    const deleteSalary = sqlSentence.deleteSalary;
    let ids = req.params.ids;
    let idsArr;
    if(ids.indexOf(',')!=-1){
        let idArr=ids.split(',');
        idsArr=idArr.filter(function(item,index){
            return item!='';
        })
    }
    let idss = idsArr.join(',');
    conn(deleteSalary(idss),function(err,row,fields){
        if(err){
            res.json({
                result:global.FAILURE,
                msg:'服务器错误',
                err:err,
            })
        }else{
            res.json({
                data:row,
            })
        }
    })
   
});

module.exports = router;