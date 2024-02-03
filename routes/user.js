const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/users.js');


router.route("/signup")
    /***********SignUp starts********** */
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp));
    /***********SignUp ends********** */


router.route("/login")
    /***********Log In starts********** */
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate('local', {failureRedirect : "/login", failureFlash : true}) , userController.login)
    /*********** Log In ends********** */


/***********Log out starts********** */
router.get("/logout", userController.logout)

/*********** Log out ends********** */

module.exports = router;