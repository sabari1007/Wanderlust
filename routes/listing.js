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

router.get('/search', async (req, res) => {
	const { q, sort } = req.query;

	if (!q) {
		req.flash('error', 'Please enter a search term');
		return res.redirect('/listings');
	}

	let listingsQuery = Listing.find({
		$or: [
			{ location: { $regex: q, $options: 'i' } },
			{ country: { $regex: q, $options: 'i' } },
			{ title: { $regex: q, $options: 'i' } },
		],
	});

	// ✅ sorting works with search
	if (sort === 'price_asc') {
		listingsQuery = listingsQuery.sort({ price: 1 });
	} else if (sort === 'price_desc') {
		listingsQuery = listingsQuery.sort({ price: -1 });
	} else if (sort === 'rating') {
		listingsQuery = listingsQuery.sort({ rating: -1 });
	}

	const listings = await listingsQuery;

	res.render('listings/index.ejs', {
		allListings: listings,
		searchQuery: q,
		sort, // ✅ now defined
	});
});

router.get(
	'/api/search',
	wrapAsync(async (req, res) => {
		const { q } = req.query;

		if (!q || q.trim() === '') {
			return res.json([]);
		}

		const listings = await Listing.find({
			$or: [
				{ title: { $regex: q, $options: 'i' } },
				{ location: { $regex: q, $options: 'i' } },
				{ country: { $regex: q, $options: 'i' } },
			],
		}).limit(6);

		res.json(listings);
	})
);

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
