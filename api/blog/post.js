const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  category : String,
  postTitle: String,
  postAuthor: String,
  postDesc: String,
  postContent: String,
  postReference: String,
  postImgUrl: String,
  created: { type: Date },
  updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);