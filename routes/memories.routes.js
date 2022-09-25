const express = require("express");

const router = express.Router();
const fileUploader = require("../config/cloudinary.config");
const Feed = require("../models/Feed.model");
const mongoose = require("mongoose");

const {
  isAuthenticated,
  isNotAuthenticated,
} = require("../middlewares/auth.middleware");

router.get("/memories", (req, res) => {
  res.render("memories.hbs");
});

router.post(
  "/memories",
  fileUploader.single("memoryImage"),
  async (req, res) => {
    console.log(req.session);
    const username = req.session.user._id;
    console.log(username);

    try {
      const imageCreated = await Feed.create({
        image: req.file.path,
        user: username,
      });
      console.log(imageCreated);
    } catch (err) {
      console.log(err);
    }
  }
);
router.get("/feed", async (req, res) => {
  try {
    const images = await Feed.find();
    res.render("feed.hbs", { images });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
