//站点配置
var mongoose = require('mongoose');
var settings = require("../models/db/settings");
var db = mongoose.connect(settings.DBURL);
//var db = mongoose.connect(settings.DBURL, settings.DBOptions);
//db= mongoose.connect('mongodb://'+settings.USERNAME+':'+settings.PASSWORD+'@'+settings.HOST+':'+settings.PORT+'/'+settings.DB+'');

module.exports = mongoose;