const express = require("express");

const router = express.Router();
const User = require("../models/User.model");
const Team = require("../models/Team.model");
const Feed = require("../models/Feed.model");
const Room = require("../models/Room.model");

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
    const feedList = await Feed.find().populate("user");
    const userList = await User.find();
    console.log(feedList, "hey");
    res.render("index.hbs", {
      teamList: teamList,
      feedList: feedList,
      userList: userList,
    });
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

router.get("/chat", async (req, res) => {
  try {
    const allRooms = await Room.find();
    console.log(allRooms);
    res.render("chat.hbs", { allRooms });
  } catch (err) {
    console.log(err);
  }
  // router.post("/chat", (req, res) => {
  //   console.log(response);
  // });

  // Run when client connects
  // const io = req.app.get("socketio");

  // io.on("connection", (socket) => {
  //   console.log(socket.id, "hey");

  //   // socket.on("joinRoom", (room) => {
  //   //   user.room = room;
  //   //   console.log("hey");
  //   //   console.log(room);
  //   //   socket.join(room);
  //   // });

  //   socket.on("message", (msg, room) => {
  //     console.log(msg, "hey");
  //     socket.broadcast.emit("chatMessage", msg);
  //   });
  //   // listen for chatMessage
  //   // socket.on("chatMessage", (message) => {
  //   //   io.to(user.room).emit(message);
  //   //   console.log(message, "msg");
  //   // });

  //   socket.on("joinRoom", (room) => {
  //     socket.join(room);
  //   });

  // });
});
router.get("/chat/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const allRooms = await Room.find();
    const findARoom = await Room.findById(id).populate("messages");
    console.log(findARoom);

    res.render("chat.hbs", { allRooms: allRooms, findARoom: findARoom });
  } catch (err) {
    console.log(err);
  }
});

router.get("/profile", (req, res, next) => {
  if (req.session.user) {
    res.render("profile.hbs", { username: req.session.user.username });
  } else {
    res.render("profile.hbs", { username: "Anonymous" });
  }
});
router.get("/profile/:name", async (req, res, next) => {
  const { name } = req.params;
  console.log(name);
  const foundUser = await User.findOne({ name: name });
  console.log(foundUser);
  res.render("profile-name.hbs");
});

router.get("/protected", isAuthenticated, (req, res, next) => {
  res.send("this route is protected");
});
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});
module.exports = router;
