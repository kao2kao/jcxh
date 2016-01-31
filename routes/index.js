var express = require('express');
var router = express.Router();

//数据库操作对象
var DbOpt = require("../models/Dbopt");
// 文档对象
var Content = require("../models/Content");
// 文档对象
var SubOrg = require("../models/SubOrg");
//文章类别对象
var ContentCategory = require("../models/ContentCategory");
//短id
var shortid = require('shortid');
//校验
var validator = require("validator");
//时间格式化
var moment = require('moment');
//站点配置
var settings = require("../models/db/settings");
var siteFunc = require("../models/db/siteFunc");
var url = require('url');


/* GET home page. */
router.get('/', function (req, res, next) {
    siteFunc.renderToTargetPageByType(req, res, 'index');
});

router.get('/content', function (req, res, next) {

    siteFunc.renderToTargetPageByType(req, res, 'content');

});

router.get('/details/:url', function (req, res, next) {

    var url = req.params.url;
    var currentId = url.split('.')[0];
    if (shortid.isValid(currentId)) {
        Content.findOne({
            '_id': currentId,
            'state': true
        }).populate('category').populate('author').exec(function (err, result) {
            siteFunc.renderToTargetPageByType(req, res, 'newsDetail', {
                detail: result
            });
        });
    } else {
        siteFunc.renderToTargetPageByType(req, res, 'error', {
            info: '非法操作!',
            message: settings.system_illegal_param,
            page: 'do500'
        });
    }

});


//协会详情
router.get('/orgdetail', function (req, res, next) {
    siteFunc.renderToTargetPageByType(req, res, 'orgDetail');
});
//组织架构
router.get('/orgleader', function (req, res, next) {
    siteFunc.renderToTargetPageByType(req, res, 'orgLeader');
});
//组织架构
router.get('/subOrg/:url', function (req, res, next) {
    var url = req.params.url;
    var code = url.split('.')[0];
    SubOrg.findOne({
        'code': code
    }).exec(function (err, result) {
        siteFunc.renderToTargetPageByType(req, res, 'subOrg', {
            detail: result
        });
    });

});

//缓存站点地图
router.get("/sitemap.html", function (req, res, next) {
    var siteMapNeedData;
    cache.get(settings.session_secret + '_siteMapHtml', function (siteMapHtml) {
        if (siteMapHtml) {
            siteMapNeedData = siteMapHtml;
            siteFunc.renderToTargetPageByType(req, res, 'sitemap', {docs: siteMapNeedData});
        } else {
            Content.find({'type': 'content', 'state': true}, 'title', function (err, docs) {
                if (err) {
                    res.end(err);
                } else {
                    siteMapNeedData = docs;
                    siteFunc.renderToTargetPageByType(req, res, 'sitemap', {docs: siteMapNeedData});
                }
            })
        }
    });
});


//分类列表页面  http://127.0.0.1/DoraCms___VylIn1IU-1.html
router.get('/:defaultUrl', function (req, res, next) {

    var defaultUrl = req.params.defaultUrl;
    var url = defaultUrl.split('___')[1];
    var indexUrl = defaultUrl.split('—')[0];
    if (indexUrl == 'page') { // 首页的分页
        var indexPage = defaultUrl.split('—')[1].split(".")[0];
        if (indexPage && validator.isNumeric(indexPage)) {
            req.query.page = indexPage;
        }
        siteFunc.renderToTargetPageByType(req, res, 'index');
    } else {
        var currentUrl = url;
        if (url) {
            if (url.indexOf("—") >= 0) {
                currentUrl = url.split("—")[0];
                var catePageNo = (url.split("—")[1]).split(".")[0];
                if (catePageNo && validator.isNumeric(catePageNo)) {
                    req.query.page = catePageNo;
                }
            }
            queryCatePage(req, res, currentUrl);
        } else {
            next();
        }
    }

});

//分类列表页面  http://127.0.0.1/front-development/AngluarJs___EyW7kj6w
router.get('/:forder/:defaultUrl', function (req, res, next) {

    var defaultUrl = req.params.defaultUrl;
    var url = defaultUrl.split('___')[1];
    var currentUrl = url;
    if (url) {
        if (url.indexOf("—") >= 0) {
            currentUrl = url.split("—")[0];
            var catePageNo = (url.split("—")[1]).split(".")[0];
            if (catePageNo && validator.isNumeric(catePageNo)) {
                req.query.page = catePageNo;
            }
        }
        queryCatePage(req, res, currentUrl);
    } else {
        next();
    }


});

//分类页面路由设置
function queryCatePage(req, res, cateId) {

    if (shortid.isValid(cateId)) {
        ContentCategory.findOne({"_id": cateId}).populate('contentTemp').exec(function (err, result) {
            if (err) {
                siteFunc.renderToTargetPageByType(req, res, 'error', {
                    info: '页面未找到!',
                    message: err.message,
                    page: 'do500'
                });
            } else {
                if (result) {
                    var contentQuery = {'sortPath': {$regex: new RegExp(result._id, 'i')}, 'state': true};
                    var cateParentId = result.sortPath.split(',')[1];
                    var cateQuery = {'sortPath': {$regex: new RegExp(cateParentId, 'i')}};

                    siteFunc.renderToTargetPageByType(req, res, 'contentList', {
                        contentQuery: contentQuery,
                        cateQuery: cateQuery,
                        result: result
                    });
                }
                else {
                    siteFunc.renderToTargetPageByType(req, res, 'error', {
                        info: '非法操作!',
                        message: settings.system_illegal_param,
                        page: 'do500'
                    });
                }
            }
        });
    } else {
        siteFunc.renderToTargetPageByType(req, res, 'error', {
            info: '非法操作!',
            message: settings.system_illegal_param,
            page: 'do500'
        });
    }

}

module.exports = router;
