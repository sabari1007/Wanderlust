const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
const User = require('../models/users.js'); // ✅ ADD THIS LINE

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
	.then(() => {
		console.log('connected to DB');
	})
	.catch((err) => {
		console.log(err);
	});

async function main() {
	await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
	await Listing.deleteMany({});

	const user = await User.findById('67f2c7627f4174869d644abb');
	if (!user) {
		console.log('User not found');
		return;
	}

	initData.data = initData.data.map((obj) => ({
		...obj,
		owner: user._id, // ✅ Correctly linked to existing user
	}));

	await Listing.insertMany(initData.data);
	console.log('Data initialized with proper owner references');
};

initDB();
