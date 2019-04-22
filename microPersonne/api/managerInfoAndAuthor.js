/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.get("/system/hr/:keywords", function (req, res, next) {
    const managerInfoAndAuthor = sqlSentence.managerInfoAndAuthor;
    let keywords = req.params.keywords;
    conn(managerInfoAndAuthor(keywords), function (err, row, fields) {
        if (err) {
            res.json({
                result: global.FAILURE,
                msg: '服务器错误',
                err: err,
            });
        } else {
            let obj = {},
                arr = [],
                data=row;
            for (let i = 0; i < data.length; i++) {
                if (!obj.hasOwnProperty(data[i].id)) {
                    obj[data[i].id] = data[i];
                    data[i].roles = [{
                        id: data[i].rid,
                        name: data[i].rname,
                        nameZh: data[i].rnameZh
                    }];
                    delete data[i].rid;
                    delete data[i].rname;
                    delete data[i].rnameZh;
                    delete data[i].password;
                } else {
                    obj[data[i].id].roles.push({
                        id: data[i].rid,
                        name: data[i].rname,
                        nameZh: data[i].rnameZh
                    });
                }
            }
            for (let key in obj) {
                arr.push(obj[key]);
            }
            res.send(arr);
        }
    });
});
module.exports = router;