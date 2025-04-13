const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/users.js');

router
	.route('/signup')
	.get(userController.RenderSignupForm)
	.post(wrapAsync(userController.signupForm));

router
	.route('/login')
	.get(userController.renderLoginPage)
	.post(
		saveRedirectUrl,
		passport.authenticate('local', {
			failureRedirect: '/login',
			failureFlash: true,
		}),
		userController.LoginPage
	);

router.get('/logout', userController.logOutPage);

module.exports = router;
