/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');
router.put("/", function (req, res, next) {
    const deleteMenuByRid = sqlSentence.deleteMenuByRid;
    const addMenuByRid = sqlSentence.addMenuByRid;
    const getRoleMenu = sqlSentence.getRoleMenu;
    let rid = req.body.rid,
        mids = req.body.mids;
    let mid;
    if (!!mids) {
        mid = mids.split(',').map(item => 1 * item);
    } else {
        mid = [];
    }

    const difference = (a, b) => {
        const s = new Set(b);
        return a.filter(x => !s.has(x));
    };
    /**
     * 把所有的与mid都拿出来，与返回来的mid进行对应，相同的则不予改变，不同的返回的mid则进行插入，不同的从数据库拿出来的mid进行删除；
     */
    let p1 = new Promise(function (resolve, reject) {
        conn(getRoleMenu(rid), function (err, row, fields) {
            if (err) {
                res.json({
                    result: global.FAILURE,
                    msg: '服务器错误',
                    err: err,
                })
            } else {
                let result = row.map(item => item.mid);
                resolve(result);
            }
        });
    });

    p1.then(function (result) {
        let addMenu = difference(mid, result);
        let deleteMenu = difference(result, mid);
        let p2, p3;
        if (addMenu.length) {
            let men = '';
            addMenu.map(item => {
                men += `(${item},${rid}),`
            })
            men = men.replace(/,$/, '');
            p2 = new Promise(function (resolve, reject) {
                conn(addMenuByRid(men), function (err, row, fields) {
                    if (err) {
                        res.json({
                            msg: '服務器錯誤！',
                            err: err,
                        })
                    } else {
                        resolve(row);
                    }
                });
            });
        }
        if (deleteMenu.length) {
            let deM = '';
            deleteMenu.map(item => {
                deM += `${item},`;
            })
            deM = deM.replace(/,$/, '');
            deMs = `(${deM})`;
            p3 = new Promise(function (resolve, reject) {
                conn(deleteMenuByRid(deMs), function (err, row, fields) {
                    if (err) {
                        res.json({
                            msg: '服務器錯誤！',
                            err: err,
                        })
                    } else {
                        resolve(row);
                    }
                });
            });
        }
        if (addMenu.length && deleteMenu.length) {
            Promise.all([p2, p3]).then(function (result) {
                res.json({
                    result: result,
                    msg: `该管理员新增了${addMenu.length}项权限，减少了${deleteMenu.length}项权限！`,
                });
            })
        } else if (addMenu.length && !deleteMenu.length) {
            p2.then(function (result) {
                res.json({
                    result: result,
                    msg: `该管理员新增了${addMenu.length}项权限！`,
                });
            });

        } else if (!addMenu.length && deleteMenu.length) {
            p3.then(function (result) {
                res.json({
                    result: result,
                    msg: `该管理员减少了${deleteMenu.length}项权限！`,
                });
            });
        }

    })
});

module.exports = router;