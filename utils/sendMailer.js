const nodemailer = require('nodemailer');
require('dotenv').config();

function sendMail(user_email, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASSWORD
    }
  });

  const options = {
    from: process.env.EMAIL_SERVICE_USER,
    to: 'cdxvy30@gmail.com',  // 可替換成多個信箱, 例:'a@test.com, b@test.com'
    subject: '【邀請使用工安台大App】',
    text: `您已被邀請加入專案, 請註冊工安台大App以參與專案流程, 專案App下載連結: ${process.env.APP_URL}`
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  return true;
}

module.exports = sendMail;
