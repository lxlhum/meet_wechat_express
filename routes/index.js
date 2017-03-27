var express = require('express');
var router = express.Router();

var wechat = require('wechat');
var API = require('wechat-api');
var config = require('../profile.json');

var api = new API(config.appid, config.appsecret);
// console.log("wechatapi:"+api);
api.getAccessToken(function (err, token) {
  console.log("getAccessToken-err:" + err);
  console.log("accessToken:" + token);  //accessToken
});
var menu = JSON.stringify(require('./menu.json'));

// createMenu:errcode
// createMenu:errmsg

api.createMenu(menu, function (err, result) {
  for (menuitem in result) {
    // console.log("createMenu:" + result[menuitem]); // { errcode: 0, errmsg: 'ok' }
  }

});

// getFollowers:total
// getFollowers:count
// getFollowers:data
// getFollowers:next_openid


api.getFollowers(function (err, data, res) {
  var mydata = data["data"]["openid"];
  for (Followers in mydata) {
    console.log("getFollowers:" + mydata[Followers]); // { errcode: 0, errmsg: 'ok' }
    api.getUser(mydata[Followers], function (err, data, res) {
      for (key in data) {
        console.log(key + ":" + data[key]); // { errcode: 0, errmsg: 'ok' }
      }
    });
  }
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/meetconfig', wechat(config, function (req, res, next) {
  console.log("access");
}));
router.post('/meetconfig', wechat(config, function (req, res, next) {

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
        title: 'meet_test_shell',
        description: 'meet_test_shell',
        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        url: 'http://www.yangtz.com'
      }
    ]);
  }
}));



module.exports = router;
