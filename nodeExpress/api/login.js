var express = require('express'),
    router = express.Router(),
    login = require('../mysqlConn.js'),
    checkToken = require('../config/token.js'),
    global = require('../globalPar.js'),
    sqlSentence = require('../sql/sql.js');

router.post('/', function (req, res, next) {

    var mixed = req.body.userPhone + '-' + req.body.code;
    var response = {}

    login(sqlSentence.loginByMobile(req.body.userPhone, req.body.code), function (err, rows, fields) {
        if(null == rows || '' == rows){
            response.result = global.FAILURE
            response.errorInfo = '用户名不存在'
        }else{
            response.rows = rows
            response.token = checkToken.generateToken(mixed) + 'type?@=' + rows[0]['user_type'] || ''
        }
        res.json(response)
    })

});

module.exports = router;