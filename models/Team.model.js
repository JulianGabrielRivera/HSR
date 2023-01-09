const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamSchema = new Schema({
  teamName: {
    type: String,
    required: true,
  },
  teamLogo: {
    type: String,
  },
  tag: String,
  joinPassword: String,
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  location: String,
  division: String,
  players: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
