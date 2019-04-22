/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.put("/", function (req, res, next) {
    const hrRolesIsEnabled = sqlSentence.hrRolesIsEnabled;
    let hrRoleInfo = req.body;
    conn(hrRolesIsEnabled(hrRoleInfo),function(err,row,fields){
        if(err){
            res.json({
                result:global.FAILURE,
                msg:'服务器错误',
                err:err,
            });
        }else{
           res.send({
               msg:req.body.enabled=='true'?'启用成功！':'禁用成功！',
               object:row,
           });
        }
    });
   
});

module.exports = router;