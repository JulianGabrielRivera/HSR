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
    try {
      const messageCreated = await Messages.create({
        msg: msg,
        name: sesh,
        time: moment().format("h:mm a"),
      });
      io.emit("chatMessage", messageCreated);

      console.log(messageCreated, "hey");
      const updatedRoom = await Room.findOneAndUpdate(
        { name: roomie },
        { $push: { messages: messageCreated }, $addToSet: { users: sesh } },
        { new: true }
      );
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
  socket.on("disconnect", () => {
    console.log(socket.id, "disconnected"); // undefined
  });

  socket.on("joinRoom", async (roomie) => {
    console.log("joined room", roomie);

    try {
      const foundRoom = await Room.findOne({ name: roomie });
      console.log(foundRoom, "roomaso1");
      if (!foundRoom) {
        const createdRoom = await Room.create({ name: roomie });
        console.log(room, "roomaso");
        socket.join(createdRoom);
      } else {
        console.log("you FAIL!");
      }
    } catch (err) {
      console.log(err);
    }
  });
});

// parsing data from form
app.use(bodyParser.urlencoded({ extended: false }));

//  setting up my auth

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);
const teamRoutes = require("./routes/team.routes");
app.use("/", teamRoutes);

const memoriesRoutes = require("./routes/memories.routes");
app.use("/", memoriesRoutes);
server.listen(3000, () => {
  console.log("server running");
});
