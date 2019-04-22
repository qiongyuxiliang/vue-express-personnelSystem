/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.get("/", function (req, res, next) {
    const getEmployeFDB = sqlSentence.getEmployeFDB;
    const getEmployeCount = sqlSentence.getEmployeCount;
    let size = req.query.size,
        page = (req.query.page - 1) * size;
    let p =new Promise(function(resolve,reject){
        conn(getEmployeCount(),function(err,row,fields){
            if(err){
                res.json({
                    result:global.FAILURE,
                    msg:'服务器错误',
                    err:err,
                })
            }else{
                resolve(row[0]['count'])
            }
        })
    })
    p.then(function(data){
        conn(getEmployeFDB(page,size),function(err,row,fields){
            if(err){
                res.json({
                    result:global.FAILURE,
                    msg:'服务器错误',
                    err:err,
                })
            }else{
                let arr=row.map(function(item,index){
                    item={...item,salary:{}}
                    for (var el in item){
                        if(el.indexOf('_')!=-1){ 
                           let typeEl = el.split('_')[0]
                           item['salary'][typeEl]=item[el];
                            delete item[el];       
                        }
                    }
                    return item;
                });
                res.json({
                    data:arr,
                    count:data,
                });
            }
        })
    })
 
   
});

module.exports = router;