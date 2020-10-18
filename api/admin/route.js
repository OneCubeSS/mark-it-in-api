const router = require("express").Router();
const User = require("./user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");

router.get("/getAdmin", async (req, res) => {
  let user;
  if (req.body["name"]) {
    user = await User.find({ name: req.body.name });
  } else if (req.body["email"]) {
    user = await User.find({ email: req.body.email });
  }
  console.log("user", user);
  if (user) {
    return res.json({
      success: true,
      data: user,
    });
  }
});

router.post("/updatePassword", async (req, res) => {
  let user;
  try {
    if (req.body["name"]) {
      user = await User.find({ name: req.body.name });
    } else if (req.body["email"]) {
      user = await User.find({ email: req.body.email });
    }

    if (user.length > 0) {
      const password = generator.generate({
        length: 10,
        numbers: true,
      });

      console.log("new pwd", password);

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
      return res.json({
        success: true,
        data: updatepwd,
      });
    }
  } catch (err) {
    return res.json({
      success: false,
      message: "Error",
    });
  }
});

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

router.get("/", verify, (req, res) => {
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
