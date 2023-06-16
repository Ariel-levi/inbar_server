const nodemailer = require("nodemailer");
const { ResetPassEmailCentent } = require("./emails/resetPassEmail");
const { NewStoreEmailActive, NewStoreEmailPending } = require("./emails/newStoreEmail");

// need to open in outlook new accout
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: { ciphers: "SSLv3" },
  auth: {
    user: process.env.SENDER_EMAIL_ADDRESS,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

const sendOutlookMail = (_mailOptions) => {
  transporter.sendMail(_mailOptions, function (error, info) {
    if (error) {
      console.log("err", error);
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};

exports.sendNewStoreEmail = async (_bodyData = {}) => {
  let mailOptions = {
    from: process.env.SENDER_EMAIL_ADDRESS,
    replyTo: _bodyData.email,
    to: _bodyData.email,
    subject: "Your Store Is " + _bodyData.status,
    html:
      _bodyData.status === "active"
        ? NewStoreEmailActive(_bodyData)
        : NewStoreEmailPending(_bodyData),
  };
  await sendOutlookMail(mailOptions);
};

exports.resetPassEmail = async (_email, _code) => {
  let mailOptions = {
    from: process.env.SENDER_EMAIL_ADDRESS,
    replyTo: process.env.SENDER_EMAIL_ADDRESS,
    to: _email,
    subject: "Reset password - ShipMarket",
    html: ResetPassEmailCentent(_code),
  };
  await sendOutlookMail(mailOptions);
};
