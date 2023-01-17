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
    const roomList = await Room.find().populate("name");

    console.log(roomList, "hey");
    res.render("index.hbs", {
      teamList: teamList,
      feedList: feedList,
      userList: userList,
      roomList: roomList,
      totalUsers: userList.length,
      totalTeams: teamList.length,
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
    res.redirect("/login");
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

router.get("/chat", isAuthenticated, async (req, res) => {
  try {
    // const allRooms = await Room.find();
    // console.log(allRooms);
    const user = await User.findById(req.session.user._id).populate("rooms");
    console.log(user, "hey");
    // console.log(user.rooms, "noooooo");
    // const room = await Room.find().populate("name");
    // console.log(room, "yass");

    res.render("chat.hbs", { user: user });
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
router.get("/chat/:id", isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  try {
    const usersInRoom = await Room.findOne({ name: id });
    // console.log(usersInRoom, "ppopopo");

    const user = await User.findById(req.session.user._id).populate(
      "rooms messages"
    );
    // console.log(user, "ayyyyy");
    const findARoom = await Room.findOne({ name: id }).populate("messages");
    // console.log(findARoom, "yasssfadf");
    if (usersInRoom === null) {
      res.render("chat-details.hbs", { error: "error" });
      return;
    }
    res.render("chat-details.hbs", {
      user: user,
      findARoom: findARoom,
      // mess with .users to get a new chatroom to work
      usersInRoom: usersInRoom.users,
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/chat/:delete", isAuthenticated, async (req, res, next) => {
  console.log("hi");
  console.log(req.session.user);
  console.log(req.params, "yoyoyo");
  console.log(req.params.delete, "yessss");
  Room.findOne({ name: req.session.user._id })
    .populate("name")

    .then((foundRoom) => {
      console.log(foundRoom, "yoo");
      let newArr = [];
      foundRoom.users.forEach((user) => {
        if (user.id !== req.params.delete) {
          newArr.push(user);
        }
        // console.log(newArr, "hey");
        // console.log(user);
        // console.log(req.params.delete, "second");
      });
      Room.findOneAndUpdate(
        { name: req.session.user._id },
        { users: newArr },
        { new: true }
      )
        .then((updatedUsers) => {
          console.log(updatedUsers, "ayyyy");
          res.render("chat-details.hbs");
          // res.render("chat-details.hbs", { name: foundRoom.name.name });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  // Room.findOne(req.params.delete)
  //   .then((foundRoom) => {
  //     // foundRoom.users
  //     console.log(foundRoom.users);
  //   })
  //   .catch((err) => console.log(err));
  // if(req.session.user){
  // Room.findOneAndDelete(req.params.delete)
  //   .then((res) => {
  //     console.log(res, "nice!");
  //   })
  //   .catch((err) => console.log(err));
  // }
});

router.get("/profile", isAuthenticated, (req, res, next) => {
  console.log(req.session.user);
  User.findById(req.session.user)
    .populate("teams rooms")
    .then((foundUser) => {
      console.log(foundUser);
      console.log(foundUser.teams[0].players);
      console.log(foundUser.teams[0]._id);
      Team.findById(foundUser.teams[0]._id)
        .populate("players")
        .then((foundTeam) => {
          console.log(foundTeam);
          res.render("profile.hbs", {
            foundUser: foundUser,
            teammates: foundTeam.players,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});
router.get("/profile/:name", async (req, res, next) => {
  const { name } = req.params;
  console.log(name);
  const foundUser = await User.findOne({ name: name });
  // console.log(foundUser);
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
