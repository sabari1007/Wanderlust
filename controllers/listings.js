const Listing = require('../models/listing');

//index route
module.exports.index = async (req, res) => {
	const allListings = await Listing.find({});
	res.render('listings/index.ejs', { allListings });
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
