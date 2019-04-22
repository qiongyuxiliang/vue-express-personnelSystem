/**
 * by zhang zhenchuan 2018-11-28
 * express es6
 */
/*jshint esversion: 6 */
const express = require('express'),
    http = require('http'),
    path = require("path"),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    jwt = require('jsonwebtoken'),
    tokenEx = require('./validate'),
    app = express(),
    favicon = require('serve-favicon'),
    xlsx = require('node-xlsx');
    
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(favicon(path.resolve(__dirname+'/public/favicon.ico')));
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,x-access-token");
    next();
});
// bodyParser.json解析json数据格式的
app.use(bodyParser.json());
app.use(cookieParser());
/*验证token */
app.all(['/api/*','/employee/*','/salary/*','/system/*'],tokenEx);


/*加载路由---上届线*/
/**
 * 登录
 */
const login = require('./api/login.js');
/**
 * 添加新用户
 */
const register = require('./api/register');
/**
 * 获取菜单
 */
const fetchMenue = require('./api/fetchMenue');
/**
 * 员工资料的api
 */
const getEmployeInfo = require('./api/getEmployeInfo');
const getBasicData =require('./api/getBasicData');
const getMaxworkId = require('./api/getMaxworkId');
const updateEmployeInfo = require('./api/updateEmployeInfo');
const addNewEmploye = require('./api/addNewEmploye');
const deleteEmploye = require('./api/deleteEmploye');
const getEmployeInfoToExcel = require('./api/getEmployeInfoToExcel');
const importEmployeFromExcel = require('./api/importEmployeFromExcel');
/**
 * 获取工资账套
 */
const getSlaryFDB = require('./api/getSlaryFDB');
const getEmployeFDB = require('./api/getEmployeFDB');
const getAccinformation = require('./api/getAccinformation');
const updateAccinformation = require('./api/updateAccinformation');
const addSalary = require('./api/addSalary');
const deleteSalary = require('./api/deleteSalary');
const updateSalary = require('./api/updateSalary');


/**系统管理 */
/**
 * 基础信息设置
 */
const getRoles = require('./api/getRoles');
const getJobLevels = require('./api/getJobLevels');
const getPositions = require('./api/getPositions');
const menuTree = require('./api/menuTree');
const updateMenuByRid = require('./api/updateMenuByRid');
const getDepartment =require('./api/getDepartment');
const addDepartment = require('./api/addDepartment');
const deleteDepartment = require('./api/deleteDepartment');
const accessAuthorityAdd = require('./api/accessAuthorityAdd');
const accessAuthorityDelete = require('./api/accessAuthorityDelete');
const positionManaAdd = require('./api/positionManaAdd');
const positionManaUpdate = require('./api/positionManaUpdate');
const positionManaDelete = require('./api/positionManaDelete');
const jobLevelManaAdd = require('./api/jobLevelManaAdd');
const jobLevelManaUpdate = require('./api/jobLevelManaUpdate');
const jobLevelManaDelete = require('./api/jobLevelManaDelete');

/**
 * 操作员管理
 */
const addRolesForHr = require('./api/addRolesForHr');
const managerInfoAndAuthor = require('./api/managerInfoAndAuthor');
const hrRolesIsEnabled = require('./api/hrRolesIsEnabled');
const refreshHr = require('./api/refreshHr');
const deleteHr = require('./api/deleteHr');
const addNewHr = require('./api/addNewHr');

/**
 * 个人中心
 */
const fetchPass = require('./api/fetchPass');
const updateHrUserInfo = require('./api/updateHrUserInfo');
/**上传图片 */
const uploadImage = require('./api/uploadImage');

/**
 * 系统通知与聊天
 */
const chatSysmsgs = require('./api/chatSysmsgs');
const chatMarkread = require('./api/chatMarkread');
const getAllHrUsers = require('./api/getAllHrUsers');
/*加载路由---下届线*/


/*引用路由--- 上届线*/
/**
 * 登录
 */
app.use('/login', login);
/**
 * 添加新用户
 */
app.use('/register',register);
/**
 * 获取菜单
 */
app.use('/api/fetchMenue',fetchMenue);
/**
 * 员工基本资料的api
 */
app.use('/employee/basic/emp',getEmployeInfo);
app.use('/employee/basic/basicdata',getBasicData);
app.use('/employee/basic/maxWorkID',getMaxworkId);
app.use('/employee/basic/updateEmployeInfo',updateEmployeInfo);
app.use('/employee/basic/addNewEmploye',addNewEmploye);
app.use('/',deleteEmploye);
app.use('/employee/basic/getEmployeInfoToExcel',getEmployeInfoToExcel);
app.use('/employee/basic/importEmployeFromExcel',importEmployeFromExcel);
/**
 * 账套管理
 */
app.use('/salary/sob/getSlaryFDB',getSlaryFDB);
app.use('/salary/sob/addSalary',addSalary);
app.use('/salary/sob/updateSalary',updateSalary);
app.use('/',deleteSalary);

app.use('/salary/getEmployeFDB',getEmployeFDB);
app.use('/salary/getAccinformation',getAccinformation);
app.use('/salary/updateAccinformation/',updateAccinformation);




/**权限管理 包括前端的路由权限和后端的接口权限*/
/**
 * 基础信息设置
 */
app.use('/system/basic/roles',getRoles);
app.use('/system/basic/joblevels',getJobLevels);
app.use('/system/basic/positions',getPositions);
app.use('/system/basic/dep/-1',getBasicData);
app.use('/',menuTree);
app.use('/system/basic/updateMenuRole',updateMenuByRid);
app.use('/system/basic/deps',getDepartment);
app.use('/system/basic/dep',addDepartment);
app.use('/',deleteDepartment);
app.use('/system/basic/addRole',accessAuthorityAdd);
app.use('/',accessAuthorityDelete);
app.use('/system/basic/position',positionManaAdd);
app.use('/system/basic/position',positionManaUpdate);
app.use('/',positionManaDelete);
app.use('/system/basic/joblevel',jobLevelManaAdd);
app.use('/system/basic/joblevel',jobLevelManaUpdate);
app.use('/',jobLevelManaDelete);

/**
 * 操作员管理
 */
app.use('/system/hr/roles',addRolesForHr);
app.use('/',managerInfoAndAuthor);
app.use('/system/hr/',hrRolesIsEnabled);
app.use('/',refreshHr);
app.use('/',deleteHr);
app.use('/system/hr/newHr',addNewHr);

/**
 * 个人中心
 */
app.use('/personal/hr/fetchPass',fetchPass);
app.use('/personal/hr/updateHrInfo',updateHrUserInfo);

/**上传图片 */
app.use('/',uploadImage);

/**
 * 系统通知和聊天
 */
app.use('/chat/sysmsgs',chatSysmsgs);
app.use('/chat/markread',chatMarkread);
app.use('/chat/getAllHrUsers',getAllHrUsers);




/*引用路由--- 上届线*/

/**
 * 设置公共文件夹
 */
app.use('/',express.static(path.join(__dirname, 'public')));

/**websocket通信 */
const sqlSentence = require('./sql/sql'),
conn = require('./config/mysqlConn.js'),
util = require('util'),
expressWs = require('express-ws')(app);
let arr=[],index=1;
app.ws('/ws/chat', function (ws, req) {
    var aWss = expressWs.getWss('/ws/chat');
    if(req.query.hrId){
        var clientId = 'ws'+req.query.hrId;
        let newClient = {[clientId]:Array.from(aWss.clients)[1]};
        arr.push(newClient);
        aWss.clients.clear();
    }
    ws.onclose=function(){
        console.log('websocket 关闭');
    };
    ws.onmessage=function(mes){
        let sendToId = mes.data.split(';')[mes.data.split(';').length-1];
        let fromId = mes.data.split(';')[mes.data.split(';').length-2];
        let tempArr = mes.data.split(';');
        tempArr.splice(tempArr.length-2,2);
        let sendToMess;
        if(tempArr.length-1>0){
            sendToMess = tempArr.jon(';');
        }else{
            sendToMess=tempArr[0];
        }
        console.log(sendToId,tempArr,arr);
        let prop = 'ws'+sendToId;
       arr.map(function(item,index){
           if(item.hasOwnProperty(prop)){
               item[prop].send(JSON.stringify({'msg':sendToMess,'from':fromId}));
           }
       });
    };
});
// app.ws('/ws/queue/chat', function (ws, req) {
//     setInterval(function(){
//         ws.send('wwwwpppp')
//     },1000)
// });
// app.get('/ws/endpointChat/info', function (req,res,next) {
    
    // res.header('X-Frame-Options', 'DENY');
    // res.header('connection', 'keep-alive');
    // res.header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    // res.header('X-Content-Type-Options', 'nosniff');
    // res.header('X-XSS-Protection','1; mode=block');
    // res.header('Content-Type', 'application/json;charset=UTF-8')
    // res.send({
    //     entropy: (new Date).getTime(), origins:' ["*:*"]', cookie_needed: true, websocket: true
    // })
    // res.send('11')
// });
// app.ws('/user/queue/chat', function (ws, req) {
//     setInterval(function(){
//         ws.send('wwww')
//     },1000)
// });
// app.ws('/chat/sysmsgs', function (ws, req) {
//     console.log('connnect.........2222');
//     ws.on('open', function (msg) {
//         ws.send('msg');
//     });
// });
/**
 * excel导入and导出
 */
/* GET import excel test. */


app.get('/importExcel', function(req, res, next) {
    let filename='./public/test.xlsx';
 
    console.error(filename);
    // read from a file
   var obj = xlsx.parse(filename);
   console.log(JSON.stringify(obj));
    
   res.send('import successfully!');
   });
/* GET export excel test. */
app.get('/exportExcel', function(req, res, next) {
   // write
   let data = [[1,2,3],[true, false, null, 'sheetjs'],['foo','bar',new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
   let buffer = xlsx.build([{name: "mySheetName", data: data}]);
   fs.writeFileSync('b.xlsx', buffer, 'binary');
   res.send('export successfully!');
});
app.listen(8083);
console.log('Listening on port 8083...');