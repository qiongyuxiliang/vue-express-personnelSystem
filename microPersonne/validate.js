/*jshint esversion: 6 */
const express = require('express'),
    conn = require('./config/mysqlConn.js'),
    global = require('./config/globalPar.js'),
    {
        encrypt,
        decrypt
    } = require('./enAndDecryption'),
    jwt = require('jsonwebtoken'),
    sqlSentence = require('./sql/sql'),
    bodyParser = require('body-parser'),
    {
        verifyToken
    } = require('./config/token');

function validEx(req, res, next) {
    let searchUser = sqlSentence.searchUser;
    let fetchMenue = sqlSentence.fetchMenue;
    /**
     * 验证token值，一是在headers里，另一个设置在req.query里
     */
    let token = req.headers['x-access-token']||req.query['x-access-token'];
    let vToken = verifyToken(token);

    if (vToken == 'expired') {
        res.json({
            result: global.TOKEN_ERROR,
            msg: 'token过期，请重新登录！'
        });
        return;
    } else {
        let username = vToken.split('&')[0];
        let password = encrypt(vToken.split('&')[1], global.secret);
        /***
         * 检验用户的权限和合法性
         */
        let p0 = new Promise(function (resolve, reject) {
            conn(searchUser(username, password), function (err, row, fields) {
                if (!row.length) {
                    res.json({
                        result: global.FAILURE,
                        msg: 'token错误，请重新登录！',
                    });
                } else {
                    resolve(row);

                }
            });
        });
        p0.then(function (resp) {
            let id = resp[0].id;
            conn(fetchMenue(id), function (err, row, fields) {
                if (err) {
                    res.json({
                        msg: '服务器错误！',
                        status: 500,
                    });
                } else {
                    /**
                     * 获取请求的路径
                     */
                    // let reqApi = req.originalUrl;
                    /**
                     * 验证用户的权限
                     */
                    // let arr = [];
                    // row.map(function (item) {
                    //     switch (item.name) {
                    //         case '员工资料':
                    //             if (item.name2 == '基本资料') {
                    //                 arr.push('/employee/basic');
                    //             } else {
                    //                 arr.push('/employee/adv');
                    //             }
                    //             break;
                    //         case '人事管理':
                    //             break;
                    //         case '统计管理':
                    //             break;
                    //         case '系统管理':
                    //             if (item.name2 == '基础信息设置') {
                    //                 arr.push('/system/basic');
                    //             } else if (item.name2 == '操作员管理') {
                    //                 arr.push('/system/hr');
                    //             }
                    //             break;
                    //     }
                    // });
                    // let i=0;
                    // if(arr.length&&reqApi!='/api/fetchMenue'){
                    //     arr.map(item=>{
                    //         if(reqApi.indexOf(item)==-1){
                    //             i=+1;
                    //         }
                    //     });
                    // }
                    // if(i==arr.length){
                    //     res.json({
                    //         msg:'您没有权限！请联系管理员！'
                    //     });
                    // }
                    next();
                }

            });

        });

    }
}

module.exports = validEx;