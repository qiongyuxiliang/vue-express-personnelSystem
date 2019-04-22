const ejsExcel = require("ejsExcel"),
    fs = require("fs"),
    path = require("path"),
    express = require('express'),
    router = express.Router(),
    querySql = require('../mx99Conn.js'),
    sqlSentence = require('../sql/mx99Sql');

router.get('/', function (req, res, next) {
    const st = req.query.st,
        et = req.query.et;
    const exportExcelData = (sqlSentence.exportExcelData)(st,et),
        orderSumPerday = exportExcelData.orderSumPerday,
        usersActive = exportExcelData.usersActive,
        readyToPayAndPaidSum = exportExcelData.readyToPayAndPaidSum,
        PaidSum = exportExcelData.PaidSum,
        addUserSum = exportExcelData.addUserSum,
        scanUserAdded = exportExcelData.scanUserAdded,
        searchUserAdded = exportExcelData.searchUserAdded,
        userOrderSum = exportExcelData.userOrderSum,
        newUsersGenerantedGevenue = exportExcelData.newUsersGenerantedGevenue;
     if((new Date(et)-new Date(st))<0){
         return;
     }else if(!et||!st){
         return;
     }
    const len = (new Date(et)-new Date(st))/(1000*24*60*60)+1
    let p1 =new Promise((resolve, reject) => {
        querySql(orderSumPerday(st,et), function (err, row, fields) {
            if (err) {

                res.json({
                    errorInfo: '0x00002',
                    err:err,
                })
            } else {
                if(!row.length){
                    row.length=len;
                    resolve(row);
                }
                else {
                    resolve(row);
                }
            }
        })
    })

    let p2 = new Promise((resolve, reject) => {
        querySql(usersActive(st,et), function (err, row, fields) {
            if (err) {
                res.json({
                    errorInfo: '0x00002',
                    err: err,
                })
            } else {
                if(!row.length){
                    row.length=len;
                    resolve(row);
                }
                else {
                    resolve(row);
                }
            }
        })
    })

    let p3 = new Promise((resolve, reject) => {
        querySql(readyToPayAndPaidSum(st,et), function (err, row, fields) {
            if (err) {

                res.json({
                    errorInfo: '0x00002',
                    err: err,
                })
            } else {
                if(!row.length){
                    row.length=len;
                    resolve(row);
                }
                else {
                    resolve(row);
                }
            }
        })
    })
    let p4 = new Promise((resolve, reject) => {
        querySql(PaidSum(st,et), function (err, row, fields) {
            if (err) {

                res.json({
                    errorInfo: '0x00002',
                    err: err,
                })
            } else {
                if(!row.length){
                    row.length=len;
                    resolve(row);
                }
                else {
                    resolve(row);
                }
            }
        })
    })
    let p5 = new Promise((resolve, reject) => {
        querySql(addUserSum(st,et), function (err, row, fields) {
            if (err) {

                res.json({
                    errorInfo: '0x00002',
                    err: err,
                })
            } else {
                if(!row.length){
                    row.length=len;
                    resolve(row);
                }
                else {
                    resolve(row);
                }
            }
        })
    })
    let p6 = new Promise((resolve, reject) => {
        querySql(scanUserAdded(st,et), function (err, row, fields) {
            if (err) {

                res.json({
                    errorInfo: '0x00002',
                    err: err,
                })
            } else {
                if(!row.length){
                    row.length=len;
                    resolve(row);
                }
                else {
                    resolve(row);
                }
            }
        })
    })
    let p7 = new Promise((resolve, reject) => {
        querySql(searchUserAdded(st,et), function (err, row, fields) {
            if (err) {

                res.json({
                    errorInfo: '0x00002',
                    err: err,
                })
            } else {
                if(!row.length){
                    row.length=len;
                    resolve(row);
                }
                else {
                    resolve(row);
                }
            }
        })
    })
    let p8 = new Promise((resolve, reject) => {
        querySql(userOrderSum(st,et), function (err, row, fields) {
            if (err) {

                res.json({
                    errorInfo: '0x00002',
                    err: err,
                })
            } else {
                if(!row.length){
                    row.length=len;
                    resolve(row);
                }
                else {
                    resolve(row);
                }
            }
        })
    })

    let p9 = new Promise((resolve, reject) => {
        querySql(newUsersGenerantedGevenue(st,et), function (err, row, fields) {
            if (err) {
                reject(err);
                res.json({
                    errorInfo: '0x00002',
                    err: err,
                })
            } else {
                if(!row.length){
                    row.length=len;
                    console.log(len)
                    resolve(row);
                }
                else {
                    resolve(row);
                }

            }
        })
    })
    Promise.all([p1,p2,p3,p4,p5,p6,p7,p8,p9]).then((result) => {
        return result;
    }).then((data)=>{

        var leng=data.length,dt=[];
        dt.length=len;
        for(let j=0;j<len;j++){
            for(let i = 0;i<leng;i++){
                if(i==0){
                    dt[j]={};
                }
                dt[j]=Object.assign(dt[j],data[i][j]);
                if(i==leng-1){
                    costPer={costPer:(dt[j]['paidTotalAmount']/dt[j]['userActive']).toFixed(4)} ;
                    dt[j]=Object.assign(dt[j],costPer);
                }
            }
        }
        return dt;
    }).then(function(data){
        produceExcle(data)

    }).catch((error) => {
        res.json({
            errorInfo: '500',
            err: error,
        })
    })

    //获得Excel模板的buffer对象
    function produceExcle(data){
        let exlBuf = fs.readFileSync(path.resolve(__dirname, '../excelTemplate/01.xlsx'));
        //数据源
        // var data = [{"a": "li", "b": "si444"},{"a": "lie", "b": "siee444"}];

        //用数据源(对象)data渲染Excel模板
        ejsExcel.renderExcel(exlBuf, data).then(function (exlBuf2) {
            fs.writeFileSync("./download.xlsx", exlBuf2);

            res.json({
                path:'download.xlsx'
            })
        }).catch(function (err) {
            console.error(err);
        });
    }

})
module.exports = router;