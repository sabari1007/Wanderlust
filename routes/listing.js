const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const { authorize } = require('passport');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

router
	.route('/')
	.get(wrapAsync(listingController.index)) //Index Route
	.post(
		isLoggedIn,
		upload.single('listing[image]'),
		validateListing,
		wrapAsync(listingController.createListing)
	); //Create Route

//New Route
router.get('/new', isLoggedIn, listingController.renderNewForm);

router
	.route('/:id')
	.get(wrapAsync(listingController.ShowListing)) //show route
	.put(
		isLoggedIn,
		isOwner,
		upload.single('listing[image]'),
		validateListing,
		wrapAsync(listingController.updateListing) //update route
	)
	.delete(
		isLoggedIn,
		isOwner,
		wrapAsync(listingController.deleteListing) //delete route
	);

//Edit Route
router.get(
	'/:id/edit',
	isLoggedIn,
	isOwner,
	wrapAsync(listingController.editListing)
);

module.exports = router;
