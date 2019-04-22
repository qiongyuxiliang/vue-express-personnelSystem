var querySql = require('../mysqlConn.js'),
    encrt = require('../config/token.js'),
    sql = require('../sql/sql.js');

function testToken(req, res, next) {
    var sqlLoginByMobile = sql.loginByMobile,
        url = req.originalUrl;
    if (url !== '/microManagement/') {
        var logintoken = req.get('logintoken');
        const verToken = encrt.verifyToken(logintoken).res || '';
        const type = encrt.verifyToken(logintoken).type || '';
        var mixs = verToken.split('-'),
            mobile = mixs[0],
            pass = mixs[1];
        if (!mixs) {
            res.json({
                result: '0x00002',
                errorInfo: '0x00006'
            })
        }
        else {
            querySql(sqlLoginByMobile(mobile, pass), function (err, rows, fields) {
                if (err) {

                    res.json({
                        code: '0x00002',
                        err: err
                    })
                } else {
                    if (!!rows) {
                        res.json({
                            result: '0x00002',
                            errorInfo: '0x00006'
                        })
                    } else {
                        next();
                    }
                }
            })
        }
    } else {
        next();
    }
};
module.exports = testToken;