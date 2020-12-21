const router = require("express").Router();
const User = require("./user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");

router.get("/getAdmins", async (req, res) => {
  const user = await User.find();
  if (user.length > 0) {
    return res.json({
      success: true,
      data: user,
    });
  } else {
    return res.json({
      success: false,
      data: "No Data Found",
    });
  }
});

router.get("/checkEmail/:id", async (req, res) => {
  const user = await User.find({ email: req.params.id });
  if (user.length > 0) {
    return res.json({
      success: true,
      data: user.length,
    });
  } else {
    return res.json({
      success: false,
      data: "No Data Found",
    });
  }
});

router.get("/updatePassword/:id", async (req, res) => {
  try {
    let user = await User.find({ email: req.params.id });

    if (user.length > 0) {
      const password = generator.generate({
        length: 10,
        numbers: true,
      });

      console.log("new pwd: ", password);

      //Hash new Password
      const salt = await bcrypt.genSalt(10);
      let cryptPwd;
      if (req.body["password"]) {
        cryptPwd = await bcrypt.hash(req.body.password, salt);
      } else {
        cryptPwd = await bcrypt.hash(password, salt);
      }

      console.log("new user", user[0]);
      const updatepwd = await User.updateOne(
        { _id: user[0].id },
        { $set: { password: cryptPwd } }
      );

      let data = {};
      data['email'] = user[0].email;
      data['password'] = password;

      sendPwd(data, (info) => {
        console.log(`The mail has beed sent 😃 and the id is ${info.messageId}`);
      });

      return res.json({
        success: true,
        data: updatepwd,
      });
    } else {
      return res.json({
        success: false,
        data: "User Not Found",
      });
    }
  } catch (err) {
    return res.json({
      success: false,
      message: "Error",
    });
  }
});

async function sendPwd(data, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "dmarkitin@gmail.com",//details.email, //add your email address
      pass: "markitin@258", //add your password
    },
  });

  let mailOptions = {
    from: data.email, // sender address
    to: "contact@markitin", // list of receivers
    subject: "Mark-It In (Password Change)", // Subject line
    html: //mail body
    "<p>Please use the below password to login for Email Address: " +
    "<h5 style='color: blue;'>" +data.email+ "</h5><br>" +
    "Password: <h5 style='color: blue;'><b>" +data.password+ "</b></h5></p><br>",
  };

  // send mail with defined transport object
  console.log("mail : ", mailOptions);
  
  let info = await transporter.sendMail(mailOptions);
  callback(info);
}

router.post("/register", async (req, res) => {
  console.log("request register", req.body);
  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const cryptPwd = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: cryptPwd,
  });

  try {
    const saveUser = await newUser.save();
    return res.json({
      success: true,
      data: saveUser,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Error",
    });
  }
});

router.post("/login", async (req, res) => {
  //Check email exists
  let user;
  try {
    if (req.body["email"]) {
      user = await User.find({ email: req.body.email });
    }

    //check user
    if (!user.length > 0) {
      return res.json({
        success: false,
        message: "Email or Password is invalid",
      });
    }

    //check pwd is correct
    const validPwd = await bcrypt.compare(req.body.password, user[0].password);
    if (!validPwd) {
      return res.json({
        success: false,
        message: "Email or Password is invalid",
      });
    }

    //Create and assign Login Token
    const token = jwt.sign({ _id: user[0]._id }, process.env.TOKEN_SEC);
    res.header("auth-token", token).json({
      success: true,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

const verify = auth;

router.get("/auth", verify, (req, res) => {
  res.send(req.user);
  User.findOne({ _id: req.user });
});

function auth(req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res.json({
      success: false,
      message: "Access Denied"
    });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SEC);
    req.user = verified;
    next();
  } catch (err) {
    return res.json({
      success: false,
      message: "Invalid Token"
    });
  }
}

module.exports = router;
