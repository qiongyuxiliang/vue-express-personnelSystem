/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
const difference = (a, b) => {
    const s = new Set(b);
    return a.filter(x => !s.has(x));
};
router.put("/system/hr/id/:hrId", function (req, res, next) {
    const refreshHr = sqlSentence.refreshHr;
    let hrId = req.params.hrId;
    conn(refreshHr(hrId),function(err,row,fields){
        if(err){
            res.json({
                msg:'服务器错误！',
                status:500,
            });
        }else{
            let arr=[];
            row.map(function(item){
                arr.push({
                    id:item.rid,
                    name:item.rname,
                    nameZh:item.rnameZh,
                });
            });
            if(row.length){
                row[0].roles=arr;
                delete row[0].password;
                delete row[0].rid;
                delete row[0].rname;
                delete row[0].rnameZh;
            }
            res.send(row[0]);
        }
    });
    


});

module.exports = router;