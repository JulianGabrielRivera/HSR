const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  msg: String,
  name: String,
  time: String,
});

const Messages = mongoose.model("Messages", messageSchema);

module.exports = Messages;
