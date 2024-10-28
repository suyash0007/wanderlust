const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { newRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");
const router = express.Router();

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(newRedirectUrl, wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(newRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true, failureMessage: true}), wrapAsync(userController.login));

router.get("/logout", userController.logout)

module.exports = router;