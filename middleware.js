const Listing = require('./models/listing');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const Review = require('./models/review.js');

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.redirectUrl = req.originalUrl;
		req.flash('error', 'You must Log in to create new listing !');
		return res.redirect('/login');
	}
	next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
	if (req.session.redirectUrl) {
		res.locals.redirectUrl = req.session.redirectUrl;
	}
	next();
};

module.exports.isOwner = async (req, res, next) => {
	let { id } = req.params;
	const listing = await Listing.findById(id);

	if (!listing.owner.equals(res.locals.currUser._id)) {
		req.flash('error', 'You are not the owner of this listing');
		return res.redirect(`/listings/${id}`);
	}
	next();
};

module.exports.validateListing = (req, res, next) => {
	let { error } = listingSchema.validate(req.body, { abortEarly: false });

	if (error) {
		let errMsg = error.details
			? error.details.map((el) => el.message).join(', ')
			: 'Validation failed';
		throw new ExpressError(400, errMsg);
	}

	next();
};

module.exports.validateReview = (req, res, next) => {
	let { error } = reviewSchema.validate(req.body);
	if (error) {
		let errMsg = error.details
			? error.details.map((el) => el.message).join(',')
			: 'Invalid data';
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};

module.exports.isReviewAuthor = async (req, res, next) => {
	let { id, reviewID } = req.params;
	const review = await Review.findById(reviewID);

	if (!review.author.equals(res.locals.currUser._id)) {
		req.flash('error', 'You are not the author of this Review');
		return res.redirect(`/listings/${id}`);
	}
	next();
};
