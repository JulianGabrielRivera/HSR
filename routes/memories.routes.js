const express = require("express");

const router = express.Router();

const {
  isAuthenticated,
  isNotAuthenticated,
} = require("../middlewares/auth.middleware");

router.get("/feed", async (req, res) => {
  res.render("memories.hbs");
});

router.post("/feed", async (req, res) => {
  const { memoryImage } = req.body;
});
