const mongoose = require('mongoose');
const Schema = mongoose.Schema; // ✅ Define Schema before using it

const Review = require('./review.js');

const listingSchema = new Schema({
	title: { type: String, required: true },
	description: String,
	image: {
		filename: String,
		url: {
			type: String,
			default:
				'https://www.google.com/imgres?q=big%20house%20image&imgurl=https%3A%2F%2Fwww.thehousedesigners.com%2Fimages%2Fplans%2F01%2FURD%2Fbulk%2F6583%2Fthe-destination-front-rendering_m.webp&imgrefurl=https%3A%2F%2Fwww.thehousedesigners.com%2Flarge-house-plans%2F&docid=fcvf1lLdSKi5aM&tbnid=s1V0xQUfZSGmrM&vet=12ahUKEwiLuvTM_L6MAxXIrlYBHZyhNBIQM3oECHAQAA..i&w=750&h=427&hcb=2&ved=2ahUKEwiLuvTM_L6MAxXIrlYBHZyhNBIQM3oECHAQAA	',
		},
	},

	price: Number,
	location: String,
	country: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	category: {
		type: String,
		enum: [
			'mountains',
			'arctic',
			'farms',
			'beach',
			'camping',
			'city',
			'lakefront',
			'rooms',
			'surfing',
			'pools',
			'trending',
		],
		default: 'trending',
	},
});

// Middleware to delete reviews when a listing is deleted
listingSchema.post('findOneAndDelete', async (listing) => {
	if (listing) {
		await Review.deleteMany({ _id: { $in: listing.reviews } });
	}
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
