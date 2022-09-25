const express = require("express");

const router = express.Router();
const fileUploader = require("../config/cloudinary.config");
const Feed = require("../models/Feed.model");

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
    const username = req.session.user.username;
    try {
      const imageCreated = await Feed.create({
        image: req.file.path,
        username: username,
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
