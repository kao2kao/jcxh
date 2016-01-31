/**
 * Created by Administrator on 2015/4/29.
 * 系统支持功能
 */
var express = require('express');
var router = express.Router();
//文件上传类
var formidable = require('formidable'),
    util = require('util'), fs = require('fs');

//时间格式化
var moment = require('moment');
//var gm = require('gm');
var images = require("images");
var url = require('url');
var mime = require('../util/mime').types;
var system = require('../util/system');
//站点配置
var settings = require("../models/db/settings");
var ossUtil = require('../util/ossUtil.js');
var fs = require('fs');
/* GET users listing. */
router.post('/upload', function (req, res, next) {

//    获取传入参数
    var params = url.parse(req.url, true);
    var fileType = params.query.type;
    var fileKey = params.query.key;
    var form = new formidable.IncomingForm(), files = [], fields = [], docs = [];
    console.log('start upload');

    //存放目录
    var updatePath = "public/upload/images/";
    var smallImgPath = "public/upload/smallimgs/";
    var newFileName = "";
    form.uploadDir = updatePath;

    form.on('field', function (field, value) {
        fields.push([field, value]);
    }).on('file', function (field, file) {
        files.push([field, file]);
        docs.push(file);

        //校验文件的合法性
        var realFileType = system.getFileMimeType(file.path);
        var contentType = mime[realFileType.fileType] || 'unknown';
        if (contentType == 'unknown') {
            res.end('typeError');
        }

        var typeKey = "others";
        var thisType = file.name.split('.')[1];
        var date = new Date();
        var ms = moment(date).format('YYYYMMDDHHmmss').toString();

        if (fileType == 'images') {
            typeKey = "img"
        }
        newFileName = typeKey + ms + "." + thisType;

        if (fileType == 'images') {
            if (realFileType.fileType == 'jpg' || realFileType.fileType == 'jpeg' || realFileType.fileType == 'png' || realFileType.fileType == 'gif') {
                if (settings.imgZip) {
                    fs.rename(file.path, updatePath + newFileName, function (err) {
                        if (err) {
                            console.log(err)
                        } else {
                            // 图片缩放
                            var input = updatePath + newFileName;
                            var out = smallImgPath + newFileName;
                            images(input)                     //加载图像文件
                                .size(800)                          //等比缩放图像到400像素宽
                                .save(out, {               //保存图片到文件,图片质量为50
                                    quality: 80
                                });
                            ossUtil.putFile(smallImgPath, newFileName);
                        }
                    })
                } else {
                    fs.rename(file.path, updatePath + newFileName, function (err) {
                        if (err) {
                            console.log(err)
                        }
                    })
                }
            } else {
                res.end('typeError');
            }

        }

    }).on('end', function () {
        var ossUrl = "http://klmyjcxh.oss-cn-beijing.aliyuncs.com/" + newFileName;
        res.end(ossUrl);

        // 返回文件路径
        //var ossUrl = ossUtil.putFile(smallImgPath, newFileName);
        //fs.unlink(smallImgPath + newFileName);
        //fs.unlink(updatePath + newFileName);
        //res.end(ossUrl);

        /*if (settings.imgZip && (fileKey == 'ctTopImg' || fileKey == 'plugTopImg' || fileKey == 'userlogo')) {
         var ossUrl =  ossUtil.putFile(smallImgPath,newFileName);
         fs.unlink(smallImgPath+newFileName);
         fs.unlink(updatePath+newFileName);
         res.end('/upload/smallimgs/' + newFileName);
         } else {
         res.end('/upload/images/' + newFileName);
         }*/

    });

    form.parse(req, function (err, fields, files) {
        err && console.log('formidabel error : ' + err);
        console.log('parsing done');
    });
});


module.exports = router;