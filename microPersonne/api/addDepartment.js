/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.post("/", function (req, res, next) {
    const addDepartment = sqlSentence.addDepartment;
    const addDepRencetId = sqlSentence.addDepRencetId;
    let name = req.body.name,
        parentId = req.body.parentId,
        enable = true;
    conn(addDepartment(name, parentId), function (err, row, fields) {
        if (err) {
            res.json({
                msg: '服务器错误',
                err: err,
            });
        } else {
            conn(addDepRencetId(),function(err, rw, fields){
                if (err) {
                    res.json({
                        msg: '服务器错误',
                        err: err,
                    });
                }else{
                    res.json({
                        msg:'添加成功！',
                        msgT: {
                            children: [],
                            enabled: enable,
                            id: rw[0]['MAX(id)'],
                            name: name,
                            parent: false,
                            parentId: parentId,
                        },
                    });
                }
            });
        }
    });
});

module.exports = router;