const { Router } = require("express");
const User = require('../models/user')
const router = Router();

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Авторизация",
    isLogin: true,
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", async (req, res) => {
  const user = await User.findById("5e9596e1c25d3911722983ac");
  req.session.user = user;
  req.session.isAuthenticated = true;
  await res.redirect("/");
});

module.exports = router;
