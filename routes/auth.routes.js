const express = require("express");

const router = express.Router();
const User = require("../models/User.model");
const Team = require("../models/Team.model");
const Feed = require("../models/Feed.model");

require("dotenv/config");
const formatMessage = require("../utils/messages");

const bcryptjs = require("bcryptjs");

const {
  isAuthenticated,
  isNotAuthenticated,
} = require("../middlewares/auth.middleware");

router.get("/", async (req, res) => {
  try {
    const teamList = await Team.find();
    const feedList = await Feed.find();

    res.render("index.hbs", { teamList: teamList, feedList: feedList });
  } catch (err) {
    console.log(err);
  }
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", async (req, res, next) => {
  const { username, password, name, teamRole, teamName, alias } = req.body;

  // use bcrypt here

  const hashedPassword = bcryptjs.hashSync(password);

  try {
    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      teamRole,
      teamName,
      alias,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      res.send("user not found");
    }

    const isValidPassword = bcryptjs.compareSync(password, foundUser.password);
    if (!isValidPassword) {
      res.send("incorrect password");
    }
    req.session.user = foundUser;
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
  }
});

const user = {};

router.get("/chat", (req, res) => {
  const io = req.app.get("socketio");

  // Run when client connects
  io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("joinRoom", (room) => {
      user.room = room;
      console.log(user);
      console.log("hey");
      console.log(room);
      socket.join(room);
    });

    // socket.emit("message", "hey");
    // listen for chatMessage
    socket.on("chatMessage", (msg) => {
      socket.to(user.room).emit(formatMessage(req.session.user.username, msg));
      console.log(msg);
    });
  });

  res.render("chat.hbs");
});

router.get("/profile", (req, res, next) => {
  if (req.session.user) {
    res.render("profile.hbs", { username: req.session.user.username });
  } else {
    res.render("profile.hbs", { username: "Anonymous" });
  }
});

router.get("/protected", isAuthenticated, (req, res, next) => {
  res.send("this route is protected");
});
module.exports = router;
