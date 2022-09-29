const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: { type: Schema.Types.ObjectId, ref: "User", unique: true },
  users: { type: Array },
  messages: [{ type: Schema.Types.ObjectId, ref: "Messages" }],
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
