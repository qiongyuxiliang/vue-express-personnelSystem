/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
const difference = (a, b) => {
    const s = new Set(b);
    return a.filter(x => !s.has(x));
};
router.put("/", function (req, res, next) {
    const addRolesForHr = sqlSentence.addRolesForHr;
    const deleteRoleByHrId = sqlSentence.deleteRoleByHrId;
    const selectHrRole = sqlSentence.selectHrRole;
    let id = req.body.hrId;
    let rids = req.body.rids.replace(/^,/,'').split(',').map(item => parseInt(item));
    let p1 = new Promise(function (resolve, reject) {
        conn(selectHrRole(id), function (err, row, fields) {
            if (err) {
                res.json({
                    err: err,
                    result: global.FAILURE,
                    msg: '服务器错误'
                });
            } else {
                resolve(row);
            }
        });
    });
    p1.then(function (data) {
        /**处理数组 */
        let arr = data.map(item => item.rid);
        let addRequired, deleteRequired;
        addRequired = difference(rids, arr);
        deleteRequired = difference(arr, rids);
        let p10,p11;
        if (addRequired.length) {
            let addItems = '';
            addRequired.map(el => addItems += `(${id},${el}),`);
            let addIte = addItems.replace(/,$/g, '');
             p10 = new Promise(function (resolve, reject) {
                conn(addRolesForHr(addIte), function (err, row, fields) {
                    if (err) {
                        res.json({
                            err: err,
                            result: global.FAILURE,
                            msg: '服务器错误'
                        });
                    } else {
                        resolve(addRequired.length);
                    }
                });
            });
        }
        if (deleteRequired.length) {
            let deleItems = '';
            deleteRequired.map(el => deleItems += `${el},`);
            let deleIte = deleItems.replace(/,$/g, '');
            let dele = `(${deleIte})`;
             p11 = new Promise(function (resolve, reject) {
                conn(deleteRoleByHrId(id,dele), function (err, row, fields) {
                    if (err) {
                        res.json({
                            err: err,
                            result: global.FAILURE,
                            msg: '服务器错误'
                        });
                    } else {
                        resolve(deleteRequired.length);
                    }
                });
            });
        }
        let arrPro=[];
        if(!addRequired.length&&!deleteRequired.length){
            res.json({
                msg:'信息无变动，不需要更新!',
            });
        }else if(!addRequired.length&&deleteRequired.length){
            arrPro=[p11];
        }else if(addRequired.length&&!deleteRequired.length){
            arrPro=[p10];
        }else{
            arrPro=[p10,p11];
        }
        Promise.all(arrPro).then(function(result){
            res.json({
                msg:`更新成功！添加了${addRequired.length}个角色,删除了${deleteRequired.length}个角色！`,
                data:result,
                status:'success',
            });
        });
    });


    // conn(addRolesForHr(),function(err,row,fields){
    //     if(err){
    //         res.json({
    //             err:err,
    //             result:global.FAILURE,
    //         });
    //     }else{

    //     }
    // });


});

module.exports = router;