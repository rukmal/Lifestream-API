var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
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
	}
});

module.exports = mongoose.model('Comment', commentSchema);