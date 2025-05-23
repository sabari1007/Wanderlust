const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');

const ExpressError = require('../utils/ExpressError.js');

const {
	validateReview,
	isLoggedIn,
	isReviewAuthor,
} = require('../middleware.js');

const reviewController = require('../controllers/reviews.js');

router.post(
	'/',
	isLoggedIn,
	validateReview,
	wrapAsync(reviewController.createReview)
);

//delete review route
router.delete(
	'/:reviewID',
	isLoggedIn,
	isReviewAuthor,
	wrapAsync(reviewController.destroyReview)
);

module.exports = router;
