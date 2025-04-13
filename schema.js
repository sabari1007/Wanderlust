const joi = require('joi');

module.exports.listingSchema = joi.object({
	listing: joi
		.object({
			title: joi.string().required(),
			description: joi.string().required(),
			image: joi.alternatives().try(
				joi.string().uri(), // Accepts a direct URL as a string
				joi.object({
					url: joi.string().uri().required(),
				}) // Accepts an object with a URL field
			),
			price: joi.number().required().min(0),
			country: joi.string().required(),
			location: joi.string().required(),
		})
		.required(),
});

module.exports.reviewSchema = joi.object({
	review: joi
		.object({
			rating: joi.number().required().min(1).max(5),
			comment: joi.string().required(),
		})
		.required(),
});
