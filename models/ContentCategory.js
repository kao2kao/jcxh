/**
 * Created by Administrator on 2015/4/15.
 * 文章类别对象
 */
var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;
var settings = require('./db/settings');


var ContentCategorySchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    uid : { type: Number, default: 0 },
    name:  String,
    keywords : String,
    sortId : { type: Number, default: 1 }, // 排序 正整数
    parentID : { type: String, default: "0" },
    state : { type: String, default: "1" },  //是否公开 默认公开
    date: { type: Date, default: Date.now },
    defaultUrl : { type: String, default: "" }, // 父类别的默认目录
    homePage : { type: String, default: "ui" }, // 必须唯一
    sortPath : { type: String, default: "0" }, //存储所有父节点结构
    comments : String
});


ContentCategorySchema.statics = {
    //根据Id查询类别信息
    getCateInfoById : function(cateId,callBack){
        ContentCategory.findOne({"_id": cateId}).populate('contentTemp').exec(function(err,doc){
            if(err){
                res.end(err);
            }else{

                callBack(doc);
            }
        })
    }

};


var ContentCategory = mongoose.model("ContentCategory",ContentCategorySchema);

module.exports = ContentCategory;

