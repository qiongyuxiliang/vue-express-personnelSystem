/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    {
        encrypt,
        decrypt
    } = require('../enAndDecryption'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    sqlSentence = require('../sql/sql'),
    {
        verifyToken
    } = require('../config/token');


router.get("/", function (req, res, next) {
    const fetchMenue = sqlSentence.fetchMenue;
    const searchUser = sqlSentence.searchUser;
    let token = req.headers['x-access-token'];
    let vToken = verifyToken(token);
    let username = vToken.split('&')[0];
    let password = encrypt(vToken.split('&')[1],global.secret);
    let p0 = new Promise(function(resolve,reject){
        conn(searchUser(username,password),function(err,row,fields){
            if(err){
                res.json({
                    result:global.FAILURE,
                    err:err,
                    msg:'服务器错误！'
                });
            }
            resolve(row);
        });
    });
    p0.then(function(idArr){
        let id = idArr[0].id;
        conn(fetchMenue(id),function(err, row, fields){
            if(err){
                res.json({
                    result:global.FAILURE,
                    err:err,
                });
            }else{
                let arr = [],data=row;
                for (let j = 0; j < data.length; j++) {
                    let keyList = Object.keys(data[j])
                    let projectList = { "children": [{ "meta": {} }], "meta": {} }
                    let rex = /[0-9]$/g
                    for (i = 0; i < keyList.length; i++) {
                        latNum = keyList[i].match(rex);
                        if (rex.test(keyList[i])) {
                            if (keyList[i].indexOf('requireAuth') > -1 || keyList[i].indexOf('keepAlive') > -1) {
                                
                                projectList["children"][0]['meta'][keyList[i].replace(rex, '')] = !!data[j][keyList[i]]
                                delete projectList["children"][keyList[i]]
                            }
                            projectList["children"][0][keyList[i].replace(rex, '')] = data[j][keyList[i]]
                        }
                        if (latNum === null) {
                            if (keyList[i].indexOf('requireAuth') > -1 || keyList[i].indexOf('keepAlive') > -1) {
                                
                                projectList['meta'][keyList[i]] = !!data[j][keyList[i]]
                                delete projectList[keyList[i]]
                            }
                            projectList[keyList[i]] = data[j][keyList[i]]
                        }
                    }
                    let flag = true;
                    for (let k = 0; k < arr.length; k++) {     
                        if (arr[k]['id'] == data[j]['id']) {
                             arr[k]['children'].push(projectList['children'][0]);
                             /*push有返回值*/
                            flag = false;
                            break;
                        }
                    }               
                    if (flag) {
                        arr.push(projectList);
                    }
                }  
                /**
                 * 获取请求路径
                 */
               
                res.json({
                    menu:arr,
                })
            }
        });
    });
});

module.exports = router;