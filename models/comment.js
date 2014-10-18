var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
	user_id: {
		type: String,
		required: true
	},

	alias: {
		type: String,
		required: false
	},

	content: {
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

	posted_at: {
		type: Number,
		required: true
	},

	photo: {
		type: String,
		required: true
	},

	voteDelta: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model('Comment', commentSchema);