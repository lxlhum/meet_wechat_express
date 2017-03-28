var gm = require('gm');

var a_path = '../wechat/wechat_temp_qr/a.jpg';
var qr_path_out = '../wechat/wechat_temp_qr/_out.png';
gm(a_path)
    .resize(240, 240)
    .noProfile()
    .write(qr_path_out, function (err) {
        console.log(err);
        if (!err) console.log('done');
    });