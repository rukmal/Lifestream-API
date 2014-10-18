var mongoose = require('mongoose');

var locationBucketSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},

	pretty_name: {
		type: String,
		required: true
	},

	latitude: {
		type: String,
		required: true
	},

	longitude: {
		type: String,
		required: true
	},

	viewCount: {
		type: Number,
		required: true
	},

	postCount: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model('Location Bucket', locationBucketSchema);