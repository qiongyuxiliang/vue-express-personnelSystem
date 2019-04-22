var http = require('http');
var crypto = require('crypto');
var querystring = require('querystring');


var apiKey = 'cd6f65a3-9dc3-4d3a-a844-b7e5fc127926';
//发送 http Post 请求  

var dataJson = "{'OrderCode':'','ShipperCode':'YD','LogisticCode':'3101634954375'}";
var requestData = escape(dataJson).replace(/\%u/g, '\\u');

var md5 = crypto.createHash("md5");
md5.update(dataJson + apiKey);
var str = md5.digest('hex');
var s = new Buffer(str).toString('base64');
var utfData = escape(s).replace(/\%u/g, '\\u');

var postData = querystring.stringify({
    "RequestType": '1002',
    "EBusinessID": '1325705',
    "RequestData": requestData,
    "DataSign": utfData,
    "DataType": '2',
});
console.log(postData);
var options = {
    hostname: 'api.kdniao.cc',
    //host: 'http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx',
    port: 80,
    path: '/Ebusiness/EbusinessOrderHandle.aspx',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Content-Length': Buffer.byteLength(postData)
    }
}
var req = http.request(options, function (res) {
    //console.log('Status:', res.statusCode);
    //console.log('headers:', JSON.stringify(res.headers));
    res.setEncoding('utf-8');
    res.on('data', function (chun) {
        console.log('body分隔线---------------------------------\r\n');
        console.info(chun);
    });
    res.on('end', function () {
        console.log('No more data in response.********');
    });
});
req.on('error', function (err) {
    console.error(err);
});
req.write(postData);
req.end();