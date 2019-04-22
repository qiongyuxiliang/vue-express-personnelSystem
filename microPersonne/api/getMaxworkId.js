/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.get("/", function (req, res, next) {
    const getMaxworkId = sqlSentence.getMaxworkId;
    function splitName(all,depart){
        let validNum = all.split(depart)[1];
        let tmpStr = '';
        for(let i =0 ;i<validNum.length-(+validNum).toString().length;i++){
            tmpStr+='0';
        }
       return depart.concat(tmpStr).concat(+validNum+1);
    }
    conn(getMaxworkId(),function(err,row,fields){
        if(err){
            res.json({
                err:err,
                result:global.FAILURE,
            })
        }
        /**BJ_MX_000001 */
        let proId = splitName(row[0].workID,'BJ_MX_');
        res.json({
            maxWorkId:proId,
        })

    })
});

module.exports = router;