/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser'),
    path = require("path"),
    fs = require('fs'),
    
    xlsx = require('node-xlsx');
router.get("/", function (req, res, next) {
    const getEmployeInfoToExcel = sqlSentence.getEmployeInfoToExcel;
    let size = req.query.size,
        page = (req.query.page - 1) * size,
        keywords = req.query.keywords,
        politicId = req.query.politicId,
        nationId = req.query.nationId,
        posId = req.query.posId,
        jobLevelId = req.query.jobLevelId,
        engageForm = req.query.engageForm,
        departmentId = req.query.departmentId,
        beginDateScope = req.query.beginDateScope;
    let title = ["编号", "集团", "部门", "集团负责人职位", "姓名", "笔名", "曾用名", "出生年月日", "身份证号码", "性别", "员工状态", "员工类别", "担任本职位日期", "试用期", "个人手机", "工作手机", "分机号", "QQ号", "Email地址",
     "婚姻", "民族", "年龄", "工龄", "异动日期", "户口性质","籍贯","户口住址","现住址","学历","学校毕业","专业",
     "政治面貌","入司日期","合同期限起","合同期限止","距离合同到期天数","续签合同期限起","续签合同期限止","转正日期","保密协议","社保","竞业限制协议","弃权商业保险协议","担保协议","身份证复印件","学历证","一寸照片","离职证明","体检报告","是否领取合同","工资卡号","开户行地址","新参保银行卡卡号","开户行地址","备注"];
    conn(getEmployeInfoToExcel(keywords, politicId, nationId, posId, jobLevelId, engageForm, departmentId, beginDateScope), function (err, row, fields) {
        
        if (err) {
            res.json({
                err: err,
                result: global.FAILURE,
                msg: '服务器错误！',
            })
        }
        let key = Object.keys(row[0]);
        let formatData = row.map((item)=>{
            let arr=[]           
            key.map(k=>{               
                 arr.push(item[k]);
            })
            return arr;
        })
        formatData.unshift(title);
        console.log(formatData)
        let buffer = xlsx.build([{name: "员工表", data: formatData}]);
        fs.writeFileSync('b.xlsx', buffer, 'binary');
        res.sendFile(path.resolve(__dirname, '../b.xlsx'));
       
    })
    

});

module.exports = router;