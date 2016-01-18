/**
 * Created by Administrator on 2015/5/30.
 */
// 文档对象
var Content = require("../Content");
//文章类别对象
var ContentCategory = require("../ContentCategory");
//文章标签对象
var ContentTags = require("../ContentTags");
//广告对象
var Ads = require("../Ads");
//留言对象
var Message = require("../Message");
var settings = require("./settings");

//数据库操作对象
var DbOpt = require("../Dbopt");
//消息对象
var UserNotify = require("../UserNotify");
//时间格式化
var moment = require('moment');

//系统消息
var Notify = require("../Notify");
function isLogined(req) {
    return true;//req.session.logined;
}

var siteFunc = {

    siteInfos: function (title, cmsDescription, keyWords) {
        var discrip;
        var key;

        if (cmsDescription) {
            discrip = cmsDescription;
        } else {
            discrip = settings.CMSDISCRIPTION;
        }

        if (keyWords) {
            key = keyWords + ',' + settings.SITEBASICKEYWORDS;
        } else {
            key = settings.SITEKEYWORDS;
        }

        return {
            title: title + " | " + settings.SITETITLE,
            cmsDescription: discrip,
            keywords: key,
            siteIcp: settings.SITEICP,
            version: settings.SITEVERSION
        }
    },

    setConfirmPassWordEmailTemp: function (name, token) {

        var html = '<p>您好：' + name + '</p>' +
            '<p>我们收到您在 <strong>' + settings.SITETITLE + '</strong> 的注册信息，请点击下面的链接来激活帐户：</p>' +
            '<a href="' + settings.SITEDOMAIN + '/users/reset_pass?key=' + token + '">重置密码链接</a>' +
            '<p>若您没有在 <strong>' + settings.SITETITLE + '</strong> 填写过注册信息，说明有人滥用了您的电子邮箱，请忽略或删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
            '<p> <strong>' + settings.SITETITLE + ' </strong> 谨上。</p>';

        return html;

    },

    setNoticeToAdminEmailTemp: function (obj) {
        var msgDate = moment(obj.date).format('YYYY-MM-DD HH:mm:ss');
        var html = '';
        html += '主人您好，<strong>' + obj.author.userName + '</strong> 于 ' + msgDate + ' 在 <strong>' + settings.SITETITLE + '</strong> 的文章 <a href="' + settings.SITEDOMAIN + '/details/' + obj.contentId + '.html">' + obj.contentTitle + '</a> 中留言了';
        return html;
    },

    setNoticeToUserEmailTemp: function (obj) {
        var msgDate = moment(obj.date).format('YYYY-MM-DD HH:mm:ss');
        var html = '';
        var targetEmail;
        if (obj.author) {
            targetEmail = obj.author.userName;
        } else if (obj.adminAuthor) {
            targetEmail = obj.adminAuthor.userName;
        }
        html += '主人您好，<strong>' + targetEmail + '</strong> 于 ' + msgDate + ' 在 <strong>' + settings.SITETITLE + '</strong> 的文章 <a href="' + settings.SITEDOMAIN + '/details/' + obj.contentId + '.html">' + obj.contentTitle + '</a> 中回复了您';
        return html;
    },

    setBugToAdminEmailTemp: function (obj) {
        var msgDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        var html = '';
        html += '主人您好，测试管理员（' + obj.email + ')于 ' + msgDate + ' 在 <strong>' + settings.SITETITLE + '</strong> 的后台模块 <strong>' + obj.contentFrom + '</strong> 中说：<br>' + obj.content;
        return html;
    },

    setNoticeToUserRegSuccess: function (obj) {
        var html = '';
        html += '亲爱的 ' + obj.userName + ' （' + obj.email + ') ，恭喜您成为 <strong>' + settings.SITETITLE + '</strong> 的新用户！ 您现在可以 <a href="' + settings.SITEDOMAIN + '/users/login" target="_blank">点击登录</a>';
        return html;
    },

    getCategoryList: function () {
        return ContentCategory.find({'parentID': '0', 'state': '1'}, 'name defaultUrl').sort({'sortId': 1}).find();
    },

    getHotItemListData: function (q) {
        return Content.find(q, 'stitle').sort({'clickNum': -1}).skip(0).limit(10);
    },

    getNewItemListData: function (q) {
        return Content.find(q, 'stitle').sort({'date': -1}).skip(0).limit(10);
    },

    getRecommendListData: function (cateQuery, contentCount) {
        return Content.find(cateQuery).sort({'date': -1}).skip(Math.floor(contentCount * Math.random())).limit(4);
    },

    getFriendLink: function () {
        return Ads.find({'category': 'friendlink'});
    },

    getMessageList: function (contentId) {
        return Message.find({'contentId': contentId}).sort({'date': 1}).populate('author').populate('replyAuthor').populate('adminAuthor').exec();
    },

    sendSystemNoticeByType: function (req, res, type, value) {
        var noticeObj;
        if (type == 'reg') {
            noticeObj = {
                type: '2',
                systemSender: 'doraCMS',
                title: '用户注册提醒',
                content: '新增注册用户 ' + value,
                action: type
            };
        } else if (type == 'msg') {
            noticeObj = {
                type: '2',
                sender: value.author,
                title: '用户留言提醒',
                content: '用户 ' + value.author.userName + ' 给您留言啦！',
                action: type
            };
        }
        Notify.sendSystemNotice(res, noticeObj, function (users, notify) {
            UserNotify.addNotifyByUsers(res, users, notify);
        });
    },

    setDataForIndex: function (req, res, params, defaultTempPath) {
        var requireField = 'title date commentNum discription clickNum isTop sImg tags';
        var documentList = DbOpt.getPaginationResult(Content, req, res, params, requireField);
        var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        return {
            siteConfig: this.siteInfos("首页"),
            documentList: documentList.docs,
            hotItemListData: this.getHotItemListData({}),
            friendLinkData: this.getFriendLink(),
            cateTypes: this.getCategoryList(),
            cateInfo: '',
            tagsData: tagsData,
            pageInfo: documentList.pageInfo,
            pageType: 'index',
            logined: isLogined(req),
            layout: defaultTempPath
        }
    },

    setDataForHtmlSiteMap: function (req, res, params, defaultTempPath) {

        return {
            siteConfig: siteFunc.siteInfos("网站地图"),
            documentList: params.docs,
            cateTypes: siteFunc.getCategoryList(),
            logined: req.session.logined,
            layout: defaultTempPath
        }

    },

    setDataForCate: function (req, res, params, defaultTempPath) {
        var requireField = 'title date commentNum discription clickNum comments isTop sImg';
        var documentList = DbOpt.getPaginationResult(Content, req, res, params.contentQuery, requireField);
        var currentCateList = ContentCategory.find(params.cateQuery).sort({'sortId': 1});
        var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        return {
            siteConfig: this.siteInfos(params.result.name, params.result.comments, params.result.keywords),
            documentList: documentList.docs,
            currentCateList: currentCateList,
            hotItemListData: this.getHotItemListData(params.contentQuery),
            friendLinkData: this.getFriendLink(),
            tagsData: tagsData,
            cateInfo: params.result,
            cateTypes: this.getCategoryList(),
            pageInfo: documentList.pageInfo,
            pageType: 'cate',
            logined: isLogined(req),
            layout: defaultTempPath
        }
    },

    setDetailInfo: function (req, res, params, defaultTempPath) {
        var currentCateList = ContentCategory.find(params.cateQuery).sort({'sortId': 1});
        //var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        return {
            siteConfig: this.siteInfos(params.detail.title, params.detail.discription, params.detail.keywords),
            cateTypes: this.getCategoryList(),
            currentCateList: currentCateList,
            hotItemListData: this.getHotItemListData({}),
            newItemListData: this.getNewItemListData({}),
            friendLinkData: this.getFriendLink(),
            reCommendListData: this.getRecommendListData(params.cateQuery, params.count),
            documentInfo: params.detail,
            messageList: this.getMessageList(params.detail._id),
            pageType: 'detail',
            logined: isLogined(req),
            layout: defaultTempPath
        }
    },

    setDataForSearch: function (req, res, params, defaultTempPath) {
        req.query.searchKey = params.searchKey;
        var requireField = 'title date commentNum discription clickNum sImg';
        var documentList = DbOpt.getPaginationResult(Content, req, res, params.query, requireField);
        return {
            siteConfig: this.siteInfos("文档搜索"),
            documentList: documentList.docs,
            cateTypes: this.getCategoryList(),
            cateInfo: '',
            pageInfo: documentList.pageInfo,
            pageType: 'search',
            logined: isLogined(req),

            layout: defaultTempPath
        }
    },

    setDataForError: function (req, res, params, defaultTempPath) {
        return {
            siteConfig: this.siteInfos(params.info),
            cateTypes: this.getCategoryList(),
            errInfo: params.message,
            pageType: 'error',
            logined: isLogined(req),

            layout: defaultTempPath
        }
    },

    setDataForUser: function (req, res, params, defaultTempPath) {
        return {
            siteConfig: this.siteInfos(params.title),
            cateTypes: this.getCategoryList(),
            userInfo: req.session.user,
            tokenId: params.tokenId,

            layout: defaultTempPath
        }
    },

    setDataForUserReply: function (req, res, params, defaultTempPath) {
        req.query.limit = 5;
        var documentList = DbOpt.getPaginationResult(Message, req, res, {'author': req.session.user._id});
        return {
            siteConfig: this.siteInfos(params.title),
            cateTypes: this.getCategoryList(),
            userInfo: req.session.user,
            replyList: documentList.docs,
            pageInfo: documentList.pageInfo,
            pageType: 'replies',

            layout: defaultTempPath
        }
    },

    setDataForUserNotice: function (req, res, params, defaultTempPath) {
        req.query.limit = 10;
        var documentList = UserNotify.getNotifyPaginationResult(req, res, req.session.user._id);
        return {
            siteConfig: this.siteInfos(params.title),
            cateTypes: this.getCategoryList(),
            userInfo: req.session.user,
            userNotifyListData: documentList.docs,
            pageInfo: documentList.pageInfo,
            pageType: 'notifies',

            layout: defaultTempPath
        }
    },

    setDataForInfo: function (params, defaultTempPath) {

        return {
            siteConfig: this.siteInfos('操作提示'),
            cateTypes: this.getCategoryList(),
            infoType: params.key,
            infoContent: params.value,

            layout: defaultTempPath
        }

    },

    setDataForSiteMap: function (req, res) {

        var root_path = settings.SITEDOMAIN;
        var priority = 0.8;
        var freq = 'weekly';
        var lastMod = moment().format('YYYY-MM-DD');
        var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        xml += '<url>';
        xml += '<loc>' + root_path + '</loc>';
        xml += '<changefreq>daily</changefreq>';
        xml += '<lastmod>' + lastMod + '</lastmod>';
        xml += '<priority>' + 1 + '</priority>';
        xml += '</url>';
        ContentCategory.find({}, 'defaultUrl', function (err, cates) {
            if (err) {
                console.log(err);
            } else {
                cates.forEach(function (cate) {
                    xml += '<url>';
                    xml += '<loc>' + root_path + '/' + cate.defaultUrl + '___' + cate._id + '</loc>';
                    xml += '<changefreq>weekly</changefreq>';
                    xml += '<lastmod>' + lastMod + '</lastmod>';
                    xml += '<priority>0.8</priority>';
                    xml += '</url>';
                });

                Content.find({}, 'title', function (err, contentLists) {
                    if (err) {
                        console.log(err);
                    } else {
                        contentLists.forEach(function (post) {
                            xml += '<url>';
                            xml += '<loc>' + root_path + '/details/' + post._id + '.html</loc>';
                            xml += '<changefreq>weekly</changefreq>';
                            xml += '<lastmod>' + lastMod + '</lastmod>';
                            xml += '<priority>0.5</priority>';
                            xml += '</url>';
                        });
                        xml += '</urlset>';
                        res.end(xml);
                    }
                })
            }

        })

    },
    //缓存文章总数，避免多次查询
    getContentsCount: function (req, res, cateParentId, cateQuery, callBack) {

        Content.count(cateQuery, function (err, count) {
            if (err) {
                res.end(err);
            } else {
                callBack(count)
            }
        })
    },
    //根据id获取模板单元的forder
    getTempItemById: function (defatulTemp, id) {
        var targetForder = '';
        var targetTemps = defatulTemp.items;
        for (var i = 0; i < targetTemps.length; i++) {
            var temp = targetTemps[i];
            if (temp && temp._id == id) {
                targetForder = temp.forder;
                break;
            }
        }
        return targetForder;
    },

    //获取默认模板中的默认模板单元
    getDefaultTempItem: function (temp) {

        var defaultTempForder = '';
        if (temp) {
            var targetTemps = temp.items;
            for (var i = 0; i < targetTemps.length; i++) {
                var temp = targetTemps[i];
                if (temp && temp.isDefault) {
                    defaultTempForder = temp.forder;
                    break;
                }
            }
        }
        return defaultTempForder;

    },

    //根据模板获取跳转链接
    renderToTargetPageByType: function (req, res, type, params) {

        var defaultTempPath = settings.SYSTEMTEMPFORDER + '/public/defaultTemp';
        if (type == 'index') {
            targetPath = settings.SYSTEMTEMPFORDER + '/index';
            res.render(targetPath, siteFunc.setDataForIndex(req, res, {
                'type': 'content',
                'state': true
            }, defaultTempPath));
        } else if (type == 'sitemap') {
            targetPath = settings.SYSTEMTEMPFORDER + '/sitemap';
            res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, defaultTempPath));
        } else if (type == 'contentList') {
            if (params.result.contentTemp) {
                targetPath = settings.SYSTEMTEMPFORDER + '/' + params.result.contentTemp.forder + '/contentList';
            } else {
                targetPath = settings.SYSTEMTEMPFORDER + '/' + siteFunc.getDefaultTempItem(temp) + '/contentList';
            }
            res.render(targetPath, siteFunc.setDataForCate(req, res, params, defaultTempPath));
        } else if (type == 'detail') {
            if (params.detail.category.contentTemp) {
                var targetForder = siteFunc.getTempItemById(temp, params.detail.category.contentTemp);
                targetPath = settings.SYSTEMTEMPFORDER + '/' + targetForder + '/detail';
            } else {
                targetPath = settings.SYSTEMTEMPFORDER + '/' + siteFunc.getDefaultTempItem(temp) + '/detail';
            }
            res.render(targetPath, siteFunc.setDetailInfo(req, res, params, defaultTempPath));
        } else if (type == 'user') {
            targetPath = settings.SYSTEMTEMPFORDER + '/users/' + params.page;
            res.render(targetPath, siteFunc.setDataForUser(req, res, params, defaultTempPath));
        } else if (type == 'userNotice') {
            targetPath = settings.SYSTEMTEMPFORDER + '/users/' + params.page;
            res.render(targetPath, siteFunc.setDataForUserNotice(req, res, params, defaultTempPath));
        } else if (type == 'userInfo') {
            targetPath = settings.SYSTEMTEMPFORDER + '/users/' + params.page;
            res.render(targetPath, siteFunc.setDataForInfo(params, defaultTempPath));
        } else if (type == 'userReply') {
            targetPath = settings.SYSTEMTEMPFORDER + '/users/' + params.page;
            res.render(targetPath, siteFunc.setDataForUserReply(req, res, params, defaultTempPath));
        } else if (type == 'search') {
            targetPath = settings.SYSTEMTEMPFORDER + '/public/' + params.page;
            res.render(targetPath, siteFunc.setDataForSearch(req, res, params, defaultTempPath));
        } else if (type == 'error') {
            targetPath = settings.SYSTEMTEMPFORDER + '/public/' + params.page;
            res.render(targetPath, siteFunc.setDataForError(req, res, params, defaultTempPath));
        }


    }

};
module.exports = siteFunc;