const router = require("express").Router();
const User = require("./user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");
const { json } = require("body-parser");

router.get("/getAdmin", async (req, res) => {
  let user;
  if (req.body["name"]) {
    user = await User.find({ name: req.body.name });
  } else if (req.body["email"]) {
    user = await User.find({ email: req.body.email });
  }
  console.log("user", user);
  if (user) {
    return res.send(user);
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
      res.send(updatepwd);
    }
  } catch (err) {
    res.status(400).send(err);
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
    res.send(saveUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  //Check email exists
  let user;
  try {
    if (req.body["email"]) {
        user = await User.find({ email: req.body.email });
      }

    if (!user.length > 0) {
      return res.status(400).send("Email or Password is invalid");
    }

    //check pwd is correct
    const validPwd = await bcrypt.compare(req.body.password, user[0].password);
    if (!validPwd) {
      return JSON.parse(res);
    }

    //Create and assign Login Token
    const token = jwt.sign({ _id: user[0]._id }, process.env.TOKEN_SEC);
    res.header("auth-token", token).send(token);
    
  } catch (err) {
    return res.status(400).send("Error");
  }
});

const verify = auth;

router.get('/', verify, (req, res) => {
    res.send(req.user);
    User.findOne({_id: req.user});
});

function auth(req, res, next) {
    const token = req.header('auth-token');
    if(!token) {
    return res.status(401).send('Access Denied');
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SEC);
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).send('Invalid Token');
    }
}

module.exports = router;
