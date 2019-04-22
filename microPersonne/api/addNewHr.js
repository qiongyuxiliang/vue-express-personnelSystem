/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    {
        encrypt,
        decrypt
    } = require('../enAndDecryption'),
    bodyParser = require('body-parser');
router.post("/", function (req, res, next) {
    const addNewHr = sqlSentence.addNewHr;
    const isExistHrUserName = sqlSentence.isExistHrUserName;
    const lastHrInsertId = sqlSentence.lastHrInsertId;
    const addRolesForHr = sqlSentence.addRolesForHr;
    let hrId = req.body;
    hrId.remark = req.body.remarks;
    hrId.enabled = hrId.enabled == '禁用' ? 1 : 0;
    hrId.password = encrypt( hrId.password, global.secret);
    /**
     * 添加的角色
     */
    let roles = (req.body.roleValue).split(',');
    /**
     * 先判断用户名是否存在，如果存在则返回该用户名已注册，返回错误信息
     */
    let p10 = new Promise(function(resolve,reject){
        conn(isExistHrUserName(hrId.username),function(err,row,fields){
            if(err){
                res.json({
                    result: global.FAILURE,
                    msg: '服务器错误',
                    err: err,
                }); 
            }else{
                if(row.length){
                    res.json({
                        status: 'failed',
                        msg: '用户名已存在，请换个用户名注册！',
                    });
                }else{
                    resolve(row);
                }
            }
        });
    });
    p10.then(function(data){
        conn(addNewHr(hrId), function (err, row, fields) {
            if (err) {
                res.json({
                    result: global.FAILURE,
                    msg: '服务器错误',
                    err: err,
                });
            } else {
                /**
                 * 获取最后插入的Id
                 */
                conn(lastHrInsertId(),function(err,row,fields){
                    if (err) {
                        res.json({
                            result: global.FAILURE,
                            msg: '服务器错误',
                            err: err,
                        });
                    }else{
                        /**
                         * 为新的Hr增加角色
                         */
                        let rid = row[0].rid;
                        if(roles.length){
                            let hrInfo='';
                            roles.map(item=>hrInfo+=`(${rid},${item}),`);
                            let hrInfos = hrInfo.replace(/,$/,'');
                            console.log(hrInfos)
                            conn(addRolesForHr(hrInfos),function(err,row,fields){
                                if (err) {
                                    res.json({
                                        result: global.FAILURE,
                                        msg: '服务器错误',
                                        err: err,
                                    });
                                }else{
                                    res.json({
                                        status: 'success',
                                        msg: '添加成功！',
                                    });
                                }
                            });
                        }else{
                            /**
                             * 未添加角色
                             */
                            res.json({
                                status: 'success',
                                msg: '添加成功！',
                            });
                        }
                    }
                });
            }
        });
    });
});

module.exports = router;