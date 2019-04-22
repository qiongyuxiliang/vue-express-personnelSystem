/*jshint esversion: 6 */
const express = require('express'),
    router = express.Router(),
    conn = require('../config/mysqlConn.js'),
    global = require('../config/globalPar.js'),
    sqlSentence = require('../sql/sql'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    path = require("path"),
    fs = require('fs'),
    moment = require('moment'),
    xlsx = require('node-xlsx');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, "upload." + fileFormat[fileFormat.length - 1]);

    }
});
// 创建文件夹
const createFolder = function (folder) {
    try {
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder);
    } catch (e) {
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }
};

const uploadFolder = './upload/';
createFolder(uploadFolder);

// 创建 multer 对象
const upload = multer({
    storage: storage
});

router.post("/", upload.single('file'), function (req, res, next) {
    const addNewEmploye = sqlSentence.addNewEmploye;
    const updateEmployeInfo = sqlSentence.updateEmployeInfo;
    const changeDataThroughTables = sqlSentence.changeDataThroughTables;
    const isExistEmployeWorkId = sqlSentence.isExistEmployeWorkId;
    ["编号", "集团", "部门", "集团负责人职位", "姓名", "笔名", "曾用名", "出生年月日", "身份证号码", "性别", "员工状态", "员工类别", "担任本职位日期", "试用期", "个人手机", "工作手机", "分机号", "QQ号", "Email地址",
        "婚姻", "民族", "年龄", "工龄", "异动日期", "户口性质", "籍贯", "户口住址", "现住址", "学历", "学校毕业", "专业",
        "政治面貌", "入司日期", "合同期限起", "合同期限止", "距离合同到期天数", "续签合同期限起", "续签合同期限止", "转正日期", "保密协议", "社保", "竞业限制协议", "弃权商业保险协议", "担保协议", "身份证复印件", "学历证", "一寸照片", "离职证明", "体检报告", "是否领取合同", "工资卡号", "开户行地址", "新参保银行卡卡号", "开户行地址", "备注"
    ]
    let file = req.file;
    let filename = path.resolve(__dirname, '../upload/upload.xlsx');
    let obj = xlsx.parse(filename);
    /**
     * 添加新的用户，如果不是新的用户则更新用户的信息
     * na.id AS nationId,
        po.id AS politicId,
        de.id AS departmentId,
        job.id AS jobLevelId,
        pos.id AS posId
     */
    let data = obj[0]['data'];
    data.splice(0, 1);
    let conglomerateId, departmentId, principalPosId, name, penName, extName, birthday, idCard,
        gender, workState, posId, atPosDays, probationPeriod, phone, workPhone, extPhone, qq_num, email, wedlock, nationId,
        age, workAge, transDate, accountPro, nativePlace, liveAddr, accountAddr, tiptopDegree, school, specialty, politicId,
        atComponyDate, beginContract, endContract, toEndcontractDays, continueContractSt, continueContractEd, conversionTime,
        nda, socialSecurity, compePro, dropCommercePro, assurePro, workID, notWorkDate, idCarCopy, degree, photo, isGetContract, employSepCerti,
        bodyExamin, wCardAddr, xcbCard, wageCard, comments, xcbAddr;
    let i = 0,
        j = 0,
        k = 0;
    //    str.replace(/\s+/g,""); 去掉空格
    console.log(data)
    // var date = new Date(1900, 0, dateVal - 1);
    let dt = data.map(item => {
        // item.map(ele=>{
        //     ele.replace(/\s+/g,"");
        // });
        workID=item[0];
        conn(isExistEmployeWorkId(workID), function (err, row, fields) {
            [workID, conglomerateId, departmentId, principalPosId, name, penName, extName, birthday, idCard,
                gender, workState, posId, atPosDays, probationPeriod, phone, workPhone, extPhone, qq_num, email, wedlock, nationId,
                age, workAge, transDate, accountPro, nativePlace, liveAddr, accountAddr, tiptopDegree, school, specialty, politicId,
                atComponyDate, beginContract, endContract, toEndcontractDays, continueContractSt, continueContractEd, conversionTime,
                nda, socialSecurity, compePro, dropCommercePro, assurePro, notWorkDate, idCarCopy, degree, photo, isGetContract, employSepCerti,
                bodyExamin, wageCard, wCardAddr, xcbCard, xcbAddr, comments
            ] = item;
            if (row[0].count) {
                /**
                 * 更新
                 */
                conn(changeDataThroughTables(conglomerateId, departmentId, principalPosId, posId, nationId, politicId), function (err, ro, fields) {
                   
                    let tem = [ro[0].conglomerateId, ro[0].nationId, ro[0].politicId, ro[0].departmentId, ro[0].principalPosId, ro[0].posId];
                    [conglomerateId, nationId, politicId, departmentId, principalPosId, posId] = tem;
                   let dateTime = [birthday,
                        atPosDays,
                        transDate,
                        atComponyDate,
                        beginContract,
                        endContract,
                        continueContractSt,
                        continueContractEd,
                        conversionTime
                    ].map(ele => {
                        return moment(new Date(1900, 0, ele - 1)).format("YYYY-MM-DD");
                    });
                    [birthday,
                        atPosDays,
                        transDate,
                        atComponyDate,
                        beginContract,
                        endContract,
                        continueContractSt,
                        continueContractEd,
                        conversionTime
                    ]=dateTime;
                    console.log(dateTime)
                    // conn(updateEmployeInfo({
                    //     workID,
                    //     conglomerateId,
                    //     departmentId,
                    //     principalPosId,
                    //     name,
                    //     penName,
                    //     extName,
                    //     birthday,
                    //     idCard,
                    //     gender,
                    //     workState,
                    //     posId,
                    //     atPosDays,
                    //     probationPeriod,
                    //     phone,
                    //     workPhone,
                    //     extPhone,
                    //     qq_num,
                    //     email,
                    //     wedlock,
                    //     nationId,
                    //     age,
                    //     workAge,
                    //     transDate,
                    //     accountPro,
                    //     nativePlace,
                    //     liveAddr,
                    //     accountAddr,
                    //     tiptopDegree,
                    //     school,
                    //     specialty,
                    //     politicId,
                    //     atComponyDate,
                    //     beginContract,
                    //     endContract,
                    //     toEndcontractDays,
                    //     continueContractSt,
                    //     continueContractEd,
                    //     conversionTime,
                    //     nda,
                    //     socialSecurity,
                    //     compePro,
                    //     dropCommercePro,
                    //     assurePro,
                    //     notWorkDate,
                    //     idCarCopy,
                    //     degree,
                    //     photo,
                    //     isGetContract,
                    //     employSepCerti,
                    //     bodyExamin,
                    //     wageCard,
                    //     wCardAddr,
                    //     xcbCard,
                    //     xcbAddr,
                    //     comments
                    // }), function (err, row0, fields) {
                    //     if (err) {
                    //         res.json({
                    //             err: err,
                    //             ro: ro
                    //         });
                    //         return;
                    //     }
                    //     i++;
                    //     k++;
                    //     if (i == data.length) {
                    //         res.json({
                    //             msg: `更新了${k}条员工信息，添加了${j}个员工`,
                    //         })
                    //     }
                    // })
                })
            } else {
                /**
                 * 添加员工
                 */
                conn(changeDataThroughTables(nationName, poName, deName, jobName, posName), function (err, ro, fields) {
                    let tem = [ro[0].nationId, ro[0].politicId, ro[0].departmentId, ro[0].jobLevelId, ro[0].posId];
                    [nationId, politicId, departmentId, jobLevelId, posId] = tem;
                    conn(addNewEmploye(name, gender, birthday, idCard, wedlock, nationId, nativePlace, politicId, email, phone, address, departmentId, jobLevelId, posId, engageForm, tiptopDegree, specialty, school, beginDate, workID, contractTerm, conversionTime, beginContract, endContract, workAge), function (err, row1, fields) {

                        if (err) {
                            res.json({
                                err: err,
                                ro: ro
                            })
                            return;
                        }
                        i++;
                        j++;
                        if (i == data.length) {
                            res.json({
                                msg: `更新了${k}条员工信息，添加了${j}个员工`,
                            })
                        }
                    })
                })
            }
        })
    })


});

module.exports = router;