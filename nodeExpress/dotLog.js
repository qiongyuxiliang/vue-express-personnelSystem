/**
 * 用户信息
 */
var mongoose = require('./db.js'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    openId: {type: String}, //微信ID
    dotLogName: {type: String}, //埋点名称
    productId: {type: String},
    transactionId: {type: String}, //订单号
    waybillId: {type: String}, //运单编号
    date: {type: Date}, //埋点时间
}, {
    versionKey: false
});


module.exports = mongoose.model('dotLog', UserSchema);