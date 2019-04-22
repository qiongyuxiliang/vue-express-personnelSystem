/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.delete("/system/basic/dep/:id", function (req, res, next) {
    const deleteDepartment = sqlSentence.deleteDepartment;
    let id = req.params.id;
    conn(deleteDepartment(id),function(err,row,fields){
        if(err){
            res.json({
                msg:'服务器错误',
                err:err,
            })
        }else{
            res.json({
                obj:null,
                status:200,
                msg:'删除成功',
            })
        }
    })
});

module.exports = router;