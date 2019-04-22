/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.get("/", function (req, res, next) {
    const getEmployePosition = sqlSentence.getEmployePosition,
        getEmployePlotics = sqlSentence.getEmployePlotics,
        getEmployeNation = sqlSentence.getEmployeNation,
        getEmployeJoblevel = sqlSentence.getEmployeJoblevel,
        getEmployeDepartment = sqlSentence.getEmployeDepartment;
        getConglomerateInfo = sqlSentence.getConglomerateInfo;
    let p1 = new Promise(function(resolve,reject){
        conn(getEmployePosition(),function(err, row, fields){
            if(err){
                res.json({
                    err:err,
                    result:global.FAILURE,
                })
            }
            resolve(row);
        })
    });
    let p2 = new Promise(function(resolve,reject){
        conn(getEmployePlotics(),function(err, row, fields){
            if(err){
                res.json({
                    err:err,
                    result:global.FAILURE,
                })
            }
            resolve(row);
        })
    });
    let p3 = new Promise(function(resolve,reject){
        conn(getEmployeNation(),function(err, row, fields){
            if(err){
                res.json({
                    err:err,
                    result:global.FAILURE,
                })
            }
            resolve(row);
        })
    });
    
    let p4 = new Promise(function(resolve,reject){
        conn(getEmployeJoblevel(),function(err, row, fields){
            if(err){
                res.json({
                    err:err,
                    result:global.FAILURE,
                })
            }
            resolve(row);
        })
    })
    let p5 = new Promise(function(resolve,reject){
        conn(getEmployeDepartment(),function(err, row, fields){
            if(err){
                res.json({
                    err:err,
                    result:global.FAILURE,
                })
            }
            resolve(row);
        })
    });
    let p6 = new Promise(function(resolve,reject){
        conn(getConglomerateInfo(),function(err, row, fields){
            if(err){
                res.json({
                    err:err,
                    result:global.FAILURE,
                });
            }
            resolve(row);
        });
    });
    function dataRelation(data){
        for(let i = 0;i<data.length;i++){
            data[i]['children']=[];
          // if(data[i]['parentId']==-1){
            for(let j =0;j<data.length;j++){
                if(data[j]['parentId']==data[i]['id']){
                    if(data[i]['children']&&data[i]['children'].length){
                        data[i]['children'].push(data[j])
                    }else{                  
                    data[i]['children'][0]=data[j];   
                    }
                }
            }
       
    }
    return [data[0]];
}
    Promise.all([p1,p2,p3,p4,p5,p6]).then((result) => {
        let len = result.length,obj={};
        for(let i = 0;i<len;i++){
            if(i==0){
                obj.positions=result[i];
            }else if(i==1){
                obj.politics=result[i];
            }else if(i==2){
                obj.nations=result[i];
            }else if(i==3){
                obj.joblevels=result[i];
            }else if(i==4){
                obj.deps=dataRelation(result[i]);
            }else if(i==5){
                obj.conglomerateInfo=result[i];
            }
        }
        res.json({
            data:obj,
            result: global.SUCCESS,
        })
    }).catch((error) => {
        res.json({
            errorInfo: '500',
            err:err,
        })
    })


});

module.exports = router;