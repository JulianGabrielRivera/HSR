const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: { type: String, unique: true },
  users: { type: Array, unique: true },
  messages: [{ type: Schema.Types.ObjectId, ref: "Messages" }],
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
