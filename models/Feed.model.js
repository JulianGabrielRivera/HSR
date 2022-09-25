const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const feedSchema = new Schema({
  image: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Feed = mongoose.model("Feed", feedSchema);

module.exports = Feed;
