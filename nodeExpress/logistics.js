/**
 * 物流查询
 */
var mongoose = require('./db.js'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    transactionId: { type: String }, //交易流水号
    logisticCode: { type: String }, //快递单号
    date: { type: Date }, //时间
}, {
    versionKey: false
});


module.exports = mongoose.model('logistics', UserSchema);