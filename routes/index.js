var express = require('express');
var router = express.Router();

var wechat = require('wechat');
var API = require('wechat-api');
var config = require('../profile.json');
var fs = require('fs');

var request = require('request');

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

          console.log("qr_path:" + qr_path);
          // var request_qr = function* () {
          //     console.log("执行:yield request(qucodemedia)" );
          //     yield request(qucodemedia).pipe(fs.createWriteStream(qr_path));
          //     console.log("执行:yield ask_qr()");
          //     yield* ask_qr();
          // };

          // var ask_qr = function* () {
          //   console.log("进入:yield ask_qr()");
          //   api.uploadMedia(qr_path, "image", function (err, result) {

          //     console.log("result:" + result);
          //     console.log("err:" + err);
          //     res.reply({
          //       type: "image",
          //       content: {
          //         mediaId: result.media_id
          //       }
          //     });
          //   })
          // };

          // console.log("先执行执行:request_qr()");
          // for (let x of request_qr()) console.log(x);


          // request(qucodemedia, function (err, response, body) {
          //   console.log("showQRCodeURL:"+qucodemedia);
          //   fs.createWriteStream(qr_path, function (error, data) {
          //     api.uploadMedia(qr_path, "image", function (err, result) {
          //       console.log("result:" + result);
          //       console.log("err:" + err);
          //       res.reply({
          //         type: "image",
          //         content: {
          //           mediaId: result.media_id
          //         }
          //       });
          //     })
          //   });
          // });

          // request(qucodemedia).pipe(fs.createWriteStream(qr_path)).pipe(
          //     api.uploadMedia(qr_path, "image", function (err, result) {
          //       console.log("result:" + result);
          //       console.log("err:" + err);
          //       res.reply({
          //         type: "image",
          //         content: {
          //           mediaId: result.media_id
          //         }
          //       });
          //     })
          // );
          var rOption = {
            flags: "r",
            encoding: null,
            mode: 0666
          }

          var wOption = {
            flags: 'a',
            encoding: null,
            mode: 0666
          }

          // request(qucodemedia, function (err, response, body) {
            // console.log(err);
            // console.log(response);
            // console.log(body);
            var fileReadStream = fs.createReadStream(qucodemedia, rOption);
            var fileWriteStream = fs.createWriteStream(qr_path, wOption);

            fileReadStream.on('data', function (data) {
              fileWriteStream.write(data);
            });

            fileReadStream.on('end', function () {
              console.log("readStream end");
              fileWriteStream.end();
              api.uploadMedia(qr_path, "image", function (err, result) {
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

          // });


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
