'use strict';
const nodemailer = require('nodemailer');

export default function sendMail(options, callback) {
    let smtpConfig = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: 'adipster.script@gmail.com',
            pass: 'cC8YbyoT6bvjOC9'
        }
    };

    let mailOptions = {
        from: '"Adipster" <adipster.script@gmail.com>', // sender address
    };

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(smtpConfig, mailOptions);



    // send mail with defined transport object
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.log(error);
            callback(error, null);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        callback(error, info);
    });
}