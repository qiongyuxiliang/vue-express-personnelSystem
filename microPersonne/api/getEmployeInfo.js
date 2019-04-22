/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser');

router.get("/", function (req, res, next) {
    let size = req.query.size,
        page = (req.query.page - 1) * size,
        keywords = req.query.keywords,
        politicId = req.query.politicId,
        nationId = req.query.nationId,
        principalPosId = req.query.principalPosId,
        jobLevelId = req.query.jobLevelId,
        engageForm = req.query.engageForm,
        departmentId = req.query.departmentId,
        beginDateScope = req.query.beginDateScope;
    /**
     * 首先获取数量，然后获取指定的数据
     */
    const getEmployNum = sqlSentence.getEmployNum;
    const getEmployeInfo = sqlSentence.getEmployeInfo;
    let p = new Promise(function (resolve, reject) {
        conn(getEmployNum(keywords,politicId,nationId,principalPosId,jobLevelId,engageForm,departmentId,beginDateScope), function (err, row, fields) {
            console.log(row)
          
            resolve(row[0].count);
        })
    })

    function getMess(callback) {
        p.then(function (data) {
            conn(getEmployeInfo(page, size,keywords,politicId,nationId,principalPosId,jobLevelId,engageForm,departmentId,beginDateScope), function (err, row, fields) {
                callback({
                    row: row,
                    data: data,
                })
            })
        })

    }
    getMess(function (rs) {
        let row = rs.row;
        let arr = [];
        if (row && row.length) {
            let reg = /id\d{1}/g;
            for (let j = 0; j < row.length; j++) {
                let index = 1;
                let flag = false;
                let json = {
                    department: {},
                    jobLevel: {},
                    nation: {},
                    politicsStatus: {},
                    position: {},
                    conglomerate:{},
                };
                let gg = Object.getOwnPropertyNames(row[j]);
                for (let i = 0; i < gg.length; i++) {
                    if (reg.test(gg[i])) {
                        index++;
                        flag = true;
                    }
                    if (index == 1) {
                        json[gg[i]] = row[j][gg[i]];
                    } else if (index == 2) {
                        if (flag) {
                            json['department']['id'] = row[j][gg[i]];
                            flag = !flag;
                        } else {
                            json['department'][gg[i]] = row[j][gg[i]];
                        }
                    } else if (index == 3) {
                        if (flag) {
                            json['jobLevel']['id'] = row[j][gg[i]];
                            flag = !flag;
                        } else {
                            json['jobLevel'][gg[i]] = row[j][gg[i]];
                        }
                    } else if (index == 4) {
                        if (flag) {
                            json['nation']['id'] = row[j][gg[i]];
                            flag = !flag;
                        } else {
                            json['nation'][gg[i]] = row[j][gg[i]];
                        }
                    } else if (index == 5) {
                        if (flag) {
                            json['politicsStatus']['id'] = row[j][gg[i]];
                            flag = !flag;
                        } else {
                            json['politicsStatus'][gg[i]] = row[j][gg[i]];
                        }
                    } else if (index == 6) {
                        if (flag) {
                            json['position']['id'] = row[j][gg[i]];
                            flag = !flag;
                        } else {
                            json['position'][gg[i]] = row[j][gg[i]];
                        }
                    } else if (index == 7) {
                        if (flag) {
                            json['conglomerate']['id'] = row[j][gg[i]];
                            flag = !flag;
                        } else {
                            json['conglomerate'][gg[i]] = row[j][gg[i]];
                        }
                    }
                }
                arr.push(json);
            }
        }
        res.json({
            emps: arr,
            length: arr.length,
            count: rs.data,
            sql:getEmployeInfo(page, size,keywords,politicId,nationId,principalPosId,jobLevelId,engageForm,departmentId,beginDateScope)
            
        });
    });





});

module.exports = router;