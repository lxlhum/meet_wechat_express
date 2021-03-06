var express = require('express');
var router = express.Router();

var wechat = require('wechat');
var API = require('wechat-api');
var config = require('../profile.json');
var fs = require('fs');

var request = require('request');

var gm = require('gm').subClass({ imageMagick: true });

// var urllib = require('urllib');
// var muk = require('muk');

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


// api.getFollowers(function (err, data, res) {
//   var mydata = data["data"]["openid"];
//   for (Followers in mydata) {
//     console.log("getFollowers:" + mydata[Followers]); // { errcode: 0, errmsg: 'ok' }
//     api.getUser(mydata[Followers], function (err, data, res) {
//       for (key in data) {
//         console.log(key + ":" + data[key]); // { errcode: 0, errmsg: 'ok' }
//       }
//     });
//   }
// });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/meetconfig', wechat(config, function (req, res, next) { }));
router.post('/meetconfig', wechat(config, function (req, res, next) {

  console.log("消息判断和事件响应");

  var message = req.weixin;
  console.log(message);

  switch (message.MsgType) {
    case "text": {
      if (message.Content === 'diaosi') {
        res.reply('hehe');
      } else if (message.Content === 'qr') {
        api.createTmpQRCode(123, 100, function (err, data, response) {
          console.log(data);

          var qucodemedia = api.showQRCodeURL(data.ticket);
          console.log("showQRCodeURL:" + qucodemedia);
          var qr_path = '../wechat/wechat_temp_qr/' + message.FromUserName + message.CreateTime + '.png';
          var a_path = '../wechat/wechat_temp_qr/a.jpg';
          var b_path = '../wechat/wechat_temp_qr/b.jpg';
          var c_path = '../wechat/wechat_temp_qr/c.png';
          var qr_path_out = '../wechat/wechat_temp_qr/' + message.FromUserName + message.CreateTime + '_out.png';

          var fileWriteStream = fs.createWriteStream(qr_path);
          console.log("qr_path:" + qr_path);
          request(qucodemedia).pipe(fileWriteStream);
          fileWriteStream.on('close', function () {
            console.log('copy over');

            // images(a_path)
            //   .size(400)
            //   .draw(images(qr_path), 40, 40)
            //   .save(qr_path_out, {
            //     quality: 50
            //   });

            api.uploadMedia(qr_path, "image", function (err, result) {

              // gm(a_path)
              //   .resize(480, 240)
              //   .noProfile()
              //   .write(qr_path_out, function (err) {
              //     console.log(err);
              //     if (!err) console.log('done');
              //   });

              gm(a_path)
                .composite(b_path)
                .geometry('+100+150')
                .write(qr_path_out, function (err) {
                  if (!err) console.log("Written composite image.");
                });

              console.log("result:" + result);
              console.log("err:" + err);
              res.reply({
                type: "image",
                content: {
                  mediaId: result.media_id
                }
              });
            })
          });
        });
      }
      else if (message.Content === 'hehe') {
        // 回复音乐
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
      }
      else {
        //图文回复
        res.reply([
          {
            title: 'meet_test_shell',
            description: 'meet_test_shell',
            picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
            url: 'http://www.yangtz.com'
          }
        ]);
      }
    }; break;
    case "event": {
      switch (message.Event) {
        case "subscribe": {
          res.reply('subscribe');
          api.getUser(message.FromUserName, function (err, data, res) {
            for (key in data) {
              console.log(key + ":" + data[key]); // { errcode: 0, errmsg: 'ok' }
            }
          });
        }; break;
        case "unsubscribe": {
          res.reply('unsubscribe');
        }; break;
      }
    }; break;

  }


}));



module.exports = router;
