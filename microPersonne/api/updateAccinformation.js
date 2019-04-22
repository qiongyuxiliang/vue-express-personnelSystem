/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.put("/", function (req, res, next) {
    const updateAccinformation = sqlSentence.updateAccinformation;
    let sid = req.body.sid,
    osid= req.body.osid,
    eid = req.body.eid;
    conn(updateAccinformation(eid,sid,osid),function(err,row,fields){
        if(err){
            res.json({
                result:global.FAILURE,
                msg:'服务器错误',
                err:err,
            })
        }else{
            res.json({  
                msg:'成功更新员工账套！'
            })
        }
    })
   
});

module.exports = router;