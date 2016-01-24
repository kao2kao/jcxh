var ALY = require('aliyun-sdk/index.js');
var request = require('request');
var fs = require('fs');
var moment = require('moment');

var oss = new ALY.OSS({
    "accessKeyId": "z6N7uvvpNVMXIYeg",
    "secretAccessKey": "bcV6saoc4r4gY6JT5qvmj2WI7NJuVp",
    endpoint: 'http://oss-cn-beijing.aliyuncs.com',
    // ���� oss sdk Ŀǰ֧�����µ� api �汾, ����Ҫ�޸�
    apiVersion: '2013-10-15'
});

var bucketName = "klmyjcxh";

var OssUtil = function () {
};

OssUtil.prototype.putFile = function (filePath, fileName, callback) {

    fs.readFile(filePath + fileName, function (err, data) {
        oss.putObject({
                Bucket: bucketName,
                Key: fileName,                 // ע��, Key ��ֵ������ / ��ͷ, ����᷵�ش���.
                Body: data,
                AccessControlAllowOrigin: '',
                ContentType: 'image/pjpeg',
                CacheControl: 'no-cache',         // �ο�: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
                ContentDisposition: '',           // �ο�: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
                ContentEncoding: 'utf-8',         // �ο�: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
                ServerSideEncryption: 'AES256',
                Expires: 4070883661      // �ο�: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
            },
            function (err, data) {
                if (err) {
                    console.log('error:', err);
                    return;
                }
                console.log('success:', data);
            });
    });
}

module.exports = new OssUtil();
