/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');

router.get("/system/basic/menuTree/:rid", function (req, res, next) {
    const fetchMenue = sqlSentence.fetchMenue;
    const getRoleMenu = sqlSentence.getRoleMenu;
    let rid = req.params.rid;
    let p1 =new Promise(function(resolve,reject){
        conn(fetchMenue(),function(err, row, fields){
            if(err){
                res.json({
                    result:global.FAILURE,
                    err:err,
                    msg:'服务器错误',
                })
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
                let menus = [{id: 1, path: null, component: null, name: "所有", iconCls: null,children:arr}];
                resolve(menus);
            }
        });
    });
    let p2 = new Promise(function(resolve,reject){
        conn(getRoleMenu(rid),function(err,row,fields){
            if(err){
                res.json({
                    result:global.FAILURE,
                    err:err,
                    msg:'服务器错误',
                });
            }else{
                resolve(row)
            }
        });

    });
    Promise.all([p1,p2]).then(function(result){
        let lastResult = {};
        lastResult.menus=result[0];
        let temp = result[result.length-1].map(function(item){
            return item['mid']
        })
        lastResult.mids=temp;
        res.send(lastResult);
    })


});

module.exports = router;