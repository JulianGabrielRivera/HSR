const express = require("express");

const router = express.Router();
const User = require("../models/User.model");
const Team = require("../models/Team.model");

const stripe = require("stripe")(`sk_test_${process.env.STRIPE_SECRET_KEY}`);

const YOUR_DOMAIN = "http://localhost:3000";

const {
  isAuthenticated,
  isNotAuthenticated,
} = require("../middlewares/auth.middleware");
const session = require("express-session");
const { response } = require("express");

router.get("/createteam", async (req, res) => {
  res.render("create-team.hbs");
});

router.post("/createteam", async (req, res) => {
  const { teamName, tag, joinPassword, location, division } = req.body;
  console.log(division);
  try {
    const newTeam = await Team.create({
      teamName,
      tag,
      joinPassword,
      location,
      division,
    });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
// router.get("/teamplayers", async (req, res) => {
//   try {
//     const allVikings = await User.find();
//     console.log(allVikings);
//     res.render("team-players.hbs", { allVikings });
//   } catch (err) {
//     console.log(err);
//   }
// });
router.get("/teamplayers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const team = await Team.findById(id).populate("players");

    console.log(team);

    res.render("team.hbs", { team: team.players });
  } catch (err) {
    console.log(err);
  }
});

router.get("/create-checkout-session", async (req, res) => {
  try {
    const prices = await stripe.prices.list({});

    const newPrices = prices.data.map((item) => {
      item.unit_amount_decimal = item.unit_amount_decimal / 100;
      return item;
    });
    console.log(newPrices);

    res.render("checkout.hbs", { prices: newPrices });
  } catch (error) {
    console.log(error);
  }
});

router.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: `${req.body.option}`,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });
    console.log(session);
    res.redirect(303, session.url);
  } catch (err) {
    console.log(err);
  }
});

router.post("/teamplayers/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  console.log(req.session.user, "hi");
  try {
    const playerJoin = await Team.findByIdAndUpdate(
      id,
      { $addToSet: { players: req.session.user._id } },
      { new: true }
    );
    if (req.session.user.teams.length > 2) {
      res.render("index.hbs", { error: "cannot join more than 2 teams" });
    }
    const addTeam = await User.findByIdAndUpdate(
      req.session.user._id,
      { $addToSet: { teams: id } },
      { new: true }
    );

    req.session.user = addTeam;

    console.log(req.session.user, "sesh");
    console.log(addTeam, "yo");
    console.log(playerJoin);
    const team = await Team.findById(id).populate("players");

    console.log(team);

    res.render("team.hbs", { team: team.players });
  } catch (err) {
    console.log(err);
  }
});

router.get("/memories", (req, res) => {
  res.render("memories.hbs");
});

module.exports = router;
