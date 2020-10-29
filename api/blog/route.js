const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Post = require("./post");

router.get("/getPosts", async function (req, res) {
  try {
    const result = await Post.find();
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
      message: err,
    });
  }
});

router.get("/getPost/:id", async function (req, res) {
  try {
    const result = await Post.find({ _id: req.params.id });
    if (result.length > 0) {
      return res.json({
        success: true,
        data: result[0],
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
      message: err,
    });
  }
});

// Pull Recent Posts by date for home page
router.get("/getRecentPost/:page", async function (req, res) {
  try {
    let skip = (req.params.page - 1) * 2;
    const result = await Post.find().skip(skip).limit(2).sort({updated:-1});
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
      message: err,
    });
  }
});

router.post("/addPost", async function (req, res) {
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

router.put("/updatePost/:id", async function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    try {
      const savePost = await Post.findByIdAndUpdate(req.params.id, req.body);
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

router.post("/deletePost/:id", async function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    try {
      const savePost = await Post.findByIdAndRemove(req.params.id, req.body);
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
