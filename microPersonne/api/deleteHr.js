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
router.delete("/system/hr/:hrId", function (req, res, next) {
    const deleteHr = sqlSentence.deleteHr;
    let hrId = req.params.hrId;
    conn(deleteHr(hrId),function(err,row,fields){
        if(err){
            res.json({
                msg:'服务器错误！',
                status:500,
            });
        }else{
            res.json({
                msg:'删除成功！',
                status:'success',
            });
        }
    });
    


});

module.exports = router;