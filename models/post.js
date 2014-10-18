var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	location_bucket: {
		type: String,
		required: true
	},

	alias: {
		type: String,
		required: false
	},

	user_id: {
		type: String,
		required: true
	},

	upvotes: {
		type: Number,
		required: true
	},

	downvotes: {
		type: Number,
		required: true
	},

	photo: {
		type: String,
		required: true
	},

	posted_at: {
		type: Number,
		required: true
	},

	caption: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Post', postSchema);