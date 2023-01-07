const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const hbs = require("hbs");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
require("dotenv/config");
const formatMessage = require("./utils/messages");
const moment = require("moment");
const Messages = require("./models/Messages.model");
const Room = require("./models/Room.model");
const User = require("./models/User.model");

mongoose
  .connect("mongodb://localhost/authExample")
  .then((x) => {
    console.log("successfully connected to database" + x.connections[0].name);
  })
  .catch((err) => console.log(err));
// this gives us our web server.
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", hbs);
// dirname is whatever the file path app.js is then look in views folder.
app.set("views", path.join(__dirname, "", "/views"));
app.use(express.static(path.join(__dirname, ".", "public")));
app.use(morgan("dev"));

app.set("trust proxy", 1);

const useSession = session({
  secret: "hey",
  resave: true,
  saveUninitialized: false,
  cookie: {
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60000000, // 60 * 1000 ms === 1 min
  },
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost/authExample",
  }),
});

app.use(useSession);
app.set("socketio", io);

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);
io.use(wrap(useSession));

io.on("connection", (socket) => {
  console.log(socket.id, "connected");

  // socket.on("joinRoom", (room) => {
  //   user.room = room;
  //   console.log("hey");
  //   console.log(room);
  //   socket.join(room);
  // });

  socket.on("message", async (msg, roomie) => {
    const sesh = socket.request.session.user.name;
    console.log(roomie, "maybe");
    console.log(sesh);
    try {
      const messageCreated = await Messages.create({
        msg: msg,
        name: sesh,
        time: moment().format("h:mm a"),
      });
      console.log(roomie);
      io.emit("chatMessage", messageCreated);
      console.log(roomie);
      console.log(messageCreated, "heyyyy");
      const updatedRoom = await Room.findOneAndUpdate(
        { name: roomie },
        { $push: { messages: messageCreated }, $addToSet: { users: sesh } },
        { new: true }
      );
      const updatedCurrentUser = await User.findOneAndUpdate(
        socket.request.session.user._id,
        { $push: { messages: messageCreated } },
        { new: true }
      );
      console.log(updatedCurrentUser, "yeasd");

      console.log(updatedRoom, "hey");
    } catch (err) {
      console.log(err);
    }
  });
  // listen for chatMessage
  // socket.on("chatMessage", (message) => {
  //   io.to(user.room).emit(message);
  //   console.log(message, "msg");
  // });

  socket.on("joinRoom", async (roomie, value) => {
    socket.on("disconnect", () => {
      console.log(socket.id, "disconnected"); // undefined
    });
    socket.on("connect", () => {
      console.log(socket.id, "connect"); // undefined
    });

    console.log("joined room", roomie, value, "heyyyy");
    console.log(socket.request.session.user.name, "l");
    let objectId = mongoose.Types.ObjectId(value);

    try {
      const foundRoom = await Room.findOne({ name: objectId });
      console.log(foundRoom);
      if (!foundRoom) {
        const createdRoom = await Room.create({
          name: value,
        });
        console.log(createdRoom, "forrrreal");
        console.log(roomie, "roomaso");
        const updateUser = await User.findOneAndUpdate(
          socket.request.session.user.name,
          { $addToSet: { rooms: createdRoom.name } },
          { new: true }
        );
        console.log(updateUser, "lllllll");
        socket.join(createdRoom);
      }

      const updateUser = await User.findByIdAndUpdate(
        socket.request.session.user._id,
        { $addToSet: { rooms: foundRoom.name } },
        { new: true }
      );
      console.log(updateUser, "lllllll");
      console.log(objectId);
      const pushUserToRoom = await Room.findOneAndUpdate(
        { name: objectId },
        { $addToSet: { users: socket.request.session.user.name } },
        { new: true }
      );
      console.log(pushUserToRoom, " jackkkk");
    } catch (err) {
      console.log(err, "yooy");
    }
  });
});

// parsing data from form
app.use(bodyParser.urlencoded({ extended: false }));

//  setting up my auth
app.use((req, res, next) => {
  if (req.session.user === undefined) {
    app.set("view options", { layout: "loggedout-layout" });
  } else {
    app.set("view options", { layout: "loggedin-layout" });
  }

  next();
});

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);
const teamRoutes = require("./routes/team.routes");
app.use("/", teamRoutes);

const memoriesRoutes = require("./routes/memories.routes");
app.use("/", memoriesRoutes);
server.listen(3000, () => {
  console.log("server running");
});
