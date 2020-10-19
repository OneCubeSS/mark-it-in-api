const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Post = require("./post");

router.get("/getPosts", async function (req, res) {
  var token = getToken(req.headers);
  console.log("In get");
  if (token) {
    try {
      const result = await Post.find();
      console.log(result.length);
      if (result.length > 0) {
        return res.json({
          success: true,
          data: result,
        });
      } else {
        return res.json({
          success: false,
          data: "No Data Found",
        });
      }
    } catch (err) {
      return res.json({
        success: false,
        message: "Error",
      });
    }
  } else {
    return res.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

router.post("/post", async function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    try {
      const savePost = await Post.create(req.body);
      return res.json({
        success: true,
        data: savePost,
      });
    } catch (err) {
      return res.json({
        success: false,
        message: "Error",
      });
    }
  } else {
    return res.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return jwt.verify(parted[1], process.env.TOKEN_SEC);
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
