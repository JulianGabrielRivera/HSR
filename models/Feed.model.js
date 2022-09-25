const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const feedSchema = new Schema({
  image: String,
  username: String,
});

const Feed = mongoose.model("Feed", feedSchema);

module.exports = Feed;
