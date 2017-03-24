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
router.get('/meetconfig',  wechat(config,function(req, res, next) {
  console.log("access");
}));
router.post('/meetconfig', wechat(config,function(req, res, next) {
  
  // 微信输入信息都在req.weixin上
  var message = req.weixin;
  console.log(message);
  if (message.FromUserName === 'diaosi') {
    // 回复屌丝(普通回复)
    res.reply('hehe');
  } else if (message.FromUserName === 'text') {
    //你也可以这样回复text类型的信息
    res.reply({
      content: 'text object',
      type: 'text'
    });
  } else if (message.FromUserName === 'hehe') {
    // 回复一段音乐
    res.reply({
      type: "music",
      content: {
        title: "来段音乐吧",
        description: "一无所有",
        musicUrl: "http://mp3.com/xx.mp3",
        hqMusicUrl: "http://mp3.com/xx.mp3",
        thumbMediaId: "thisThumbMediaId"
      }
    });
  } else {
    // 回复高富帅(图文回复)
    res.reply([
      {
        title: '你来我家接我吧',
        description: '这是女神与高富帅之间的对话',
        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        url: 'http://nodeapi.cloudfoundry.com/'
      }
    ]);
  }
}));

// var api = new API(config.appid, config.appsecret);
// console.log("wechatapi:"+api);

module.exports = router;
