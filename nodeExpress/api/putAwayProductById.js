/*商品上架*/
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    querySql = require('../mysqlConn.js'),
    querySql = require('../mysqlConn.js'),
    sqlSentence = require('../sql/sql.js');

router.get('/', function (req, res, next) {
    var id = req.query.id;
    const arr = new Array()
    var sqlPutAwayProductById = sqlSentence.putAwayProductById;
    querySql(sqlPutAwayProductById(id), function (err, rows, fields) {
        if (err) {
            res.json({
                code: '0x00002',
                err: err
            })
        } else {
            res.json({
                result: '0x00001'
            })
        }
    })
});

module.exports = router;