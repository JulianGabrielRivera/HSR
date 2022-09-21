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
app.set("socketio", io);

app.set("view engine", hbs);
// dirname is whatever the file path app.js is then look in views folder.
app.set("views", path.join(__dirname, "", "/views"));
app.use(express.static(path.join(__dirname, ".", "public")));
app.use(morgan("dev"));

app.set("trust proxy", 1);

app.use(
  session({
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
  })
);

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
