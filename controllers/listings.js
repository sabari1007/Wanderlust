const Listing = require('../models/listing');

//index route
module.exports.index = async (req, res) => {
	const { q, sort, category } = req.query;

	let query = {};

	if (q) {
		query.$or = [
			{ location: { $regex: q, $options: 'i' } },
			{ country: { $regex: q, $options: 'i' } },
			{ title: { $regex: q, $options: 'i' } },
		];
	}

	if (category) {
		query.category = category;
	}

	let listings = Listing.find(query);

	if (sort === 'price_asc') listings = listings.sort({ price: 1 });
	if (sort === 'price_desc') listings = listings.sort({ price: -1 });
	if (sort === 'rating') listings = listings.sort({ rating: -1 });

	const allListings = await listings;

	res.render('listings/index', {
		allListings,
		q,
		sort,
		category,
	});
};

//MAPS
const axios = require('axios');

module.exports.createListing = async (req, res) => {
	const { location, country } = req.body.listing;

	const geoRes = await axios.get(
		'https://geocoding-api.open-meteo.com/v1/search',
		{
			params: {
				name: location,
				count: 1,
				language: 'en',
				format: 'json',
			},
		}
	);

	const listing = new Listing(req.body.listing);

	if (geoRes.data && geoRes.data.results && geoRes.data.results.length > 0) {
		const lat = geoRes.data.results[0].latitude;
		const lng = geoRes.data.results[0].longitude;

		listing.geometry = {
			type: 'Point',
			coordinates: [lat, lng],
		};
	} else {
		listing.geometry = {
			type: 'Point',
			coordinates: [20.5937, 78.9629], // India center fallback
		};
	}

	await listing.save();
	res.redirect(`/listings/${listing._id}`);
};

//new route
module.exports.renderNewForm = (req, res) => {
	res.render('listings/new.ejs');
};

//show route
module.exports.ShowListing = async (req, res, next) => {
	const listing = await Listing.findById(req.params.id)
		.populate('owner')
		.populate({ path: 'reviews', populate: { path: 'author' } });
	if (!listing) {
		req.flash('error', 'Listing not found');
		return res.redirect('/listings');
	}
	console.log(listing);
	res.render('listings/show', { listing });
};

module.exports.createListing = async (req, res, next) => {
	let url = req.file.path;
	let filename = req.file.filename;
	const newListing = new Listing(req.body.listing);
	newListing.owner = req.user._id;
	newListing.image = { filename, url };
	await newListing.save();
	req.flash('success', 'New Listing Created');
	res.redirect('/listings');
};

module.exports.editListing = async (req, res, next) => {
	let { id } = req.params;
	const listing = await Listing.findById(id);
	if (!listing) {
		req.flash('error', 'Listing not found');
		return res.redirect('/listings');
	}

	let originalImageURL = listing.image.url;
	originalImageURL = originalImageURL.replace('/upload', '/upload/w_250');
	res.render('listings/edit.ejs', { listing, originalImageURL });
};

module.exports.updateListing = async (req, res, next) => {
	let { id } = req.params;
	let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
	if (typeof req.file !== 'undefined') {
		let url = req.file.path;
		let filename = req.file.filename;
		listing.image = { filename, url };
		await listing.save();
	}

	req.flash('success', 'Listing Updated');
	res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
	let { id } = req.params;
	let deletedListing = await Listing.findByIdAndDelete(id);

	req.flash('success', ' Listing Deleted');
	res.redirect('/listings');
};

module.exports.searchListings = async (req, res) => {
	const { q } = req.query;

	const listings = await Listing.find({
		$or: [
			{ title: { $regex: q, $options: 'i' } },
			{ location: { $regex: q, $options: 'i' } },
			{ country: { $regex: q, $options: 'i' } },
		],
	});

	res.render('listings/index', {
		allListings: listings,
		searchQuery: null,
		sort,
	});
};
