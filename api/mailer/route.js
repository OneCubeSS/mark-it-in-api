const router = require("express").Router();
const nodemailer = require("nodemailer");

router.post("/sendmail", (req, res) => {
  console.log("request came");
  let data = req.body;
  try {
    sendMail(data, (info) => {
      console.log(`The mail has beed sent 😃 and the id is ${info.messageId}`);
      return res.json({
        success: true,
        data: info,
      });
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err,
    });
  }
});

router.post("/sendcta", (req, res) => {
  console.log("request came");
  let data = req.body;
  try {
    sendCta(data, (infocta) => {
      console.log(`The mail has beed sent 😃 and the id is ${infocta.messageId}`);
      return res.json({
        success: true,
        data: infocta,
      });
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err,
    });
  }
});

async function sendMail(data, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "onecubesolutions00@gmail.com",//details.email, //add your email address
      pass: "OneCubess07", //add your password
    },
  });

  let mailOptions = {
    from: "onecubesolutions00@gmail.com", // sender address
    to: data.email, // list of receivers
    subject: "Mark-It In (Contact Us): " + data.name, // Subject line
    html: //mail body
    "<p> Name : " +data.name+ "</p> <br>" +
    "<p> Email : " +data.email+ "</p> <br>" +
    "<p> Phone Number : " +data.number+ "</p> <br>" +
    "<p> Website Url : " +data.website+ "</p> <br>" +
    "<p> Goal : " +data.goal+ "</p> <br>" +
    "<p> Additional Details : " +data.more+ "</p> <br>",
  };

  // send mail with defined transport object
  console.log("mail : ", mailOptions);
  
  let info = await transporter.sendMail(mailOptions);
  callback(info);
}

async function sendCta(data, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "onecubesolutions00@gmail.com",//details.email, //add your email address
      pass: "OneCubess07", //add your password
    },
  });

  let ctaOptions = {
    from: "onecubesolutions00@gmail.com", // sender address
    to: data.email, // list of receivers
    subject: "Mark-It In (CTA): " + data.name, // Subject line
    html: //mail body
    "<p> Name : " +data.name+ "</p> <br>" +
    "<p> Email : " +data.email+ "</p> <br>" +
    "<p> Phone Number : " +data.number+ "</p> <br>" +
    "<p> Website Url : " +data.website+ "</p> <br>" +
    "<p> Goal : " +data.goal+ "</p> <br>" +
    "<p> Additional Details : " +data.more+ "</p> <br>",
  };

  // send mail with defined transport object
  console.log("mail : ", ctaOptions);

  let infocta = await transporter.sendMail(ctaOptions);
  callback(infocta);
}

module.exports = router;
