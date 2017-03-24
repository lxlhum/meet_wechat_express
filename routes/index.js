var express = require('express');
var router = express.Router();

var wechat = require('wechat');
var API = require('wechat-api');

var config = {
  token: 'meet',
  appid: 'wx3a3f138d198893c4',
  appsecret:'95bdcfaa2bd98f2b9c1bf294570252bd',
  encodingAESKey: 'AjF2DgN0oCc7aq9sWXGvo8VtKXoWfQREoMOO6eVxfDc',
  checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test',  wechat(config,function(req, res, next) {}));

var api = new API(config.appid, config.appsecret);
console.log("wechatapi:"+api);

module.exports = router;
