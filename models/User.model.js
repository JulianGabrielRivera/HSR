const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  alias: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  teamRole: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
