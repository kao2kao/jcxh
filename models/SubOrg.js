/**
 * 分协会页面
 * @type {*|exports|module.exports}
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shortid = require('shortid');
var SubOrgSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    title: String,
    code: String,
    author: {type: String, ref: 'AdminUser'}, // 文档作者
    comments: {} //详情
});


var SubOrg = mongoose.model("SubOrg", SubOrgSchema);

module.exports = SubOrg;

