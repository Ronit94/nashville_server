const nodemailer = require('nodemailer');
const config = require('../config/constants');

module.exports = (from,to,subject,text)=>{
  return new Promise((resolve,reject)=>{
    const transporter = nodemailer.createTransport({
        service: 'smtp',
        auth: {
          user: config.mailConfig.username,
          pass: config.mailConfig.password // naturally, replace both with your real credentials or an application-specific password
        }
      });

      const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          reject(error)
        } else {
          resolve(`Email sent: ${info.response}`);
        }
      });
    })

}