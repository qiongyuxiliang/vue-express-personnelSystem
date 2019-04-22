var mysql = require('mysql'),
    Global = require('./globalPar.js');
var pool = mysql.createPool({
    host: Global.mx99Ip,
    user: Global.mxAdmin,
    password: Global.mx99Pass,
    connectionLimit: 10,
    database: Global.mx99Database,
    port: 3306,
})

 function getCon(sql, callback) {
    pool.getConnection(function (conn_err, conn) {
        if (conn_err) {
            callback(err, null, null);
        } else {
            conn.query(sql, function (query_err, rows, fields) {
                conn.release();
                callback(query_err, rows, fields);
            });
        }
    });
};
module.exports = getCon;