var request = require('request');
var exports = module.exports;

var OAUTH_KEY = 'Z_9SOPvjfQ8AAAAAAAAACQtIc8SeGxSgFzp8ZP7LluxF4udstyJXa6vChN_YbriG';

/**
 * Function to save an image to Dropbox
 * @param  {String} imageId     ID of the image
 * @param  {String} imageBase64 Base64 encoded JPEG image
 */
exports.saveImage = function (imageId, imageBase64) {
	// Saving the image in a binary buffer
	var image = new Buffer(imageBase64, 'base64');
	// Sending the request to save the file
	request
		.put('https://api-content.dropbox.com/1/files_put/auto/' + imageId + '?access_token=' + OAUTH_KEY, {
			body: image
		} , function (error, response, body) {
			if (error) {
				console.log(error);
			}
		});
}

exports.getImageUrl = function (imageId, posts, currentPost, response) {
	request
		.post('https://api.dropbox.com/1/media/auto/' + imageId + '?access_token=' + OAUTH_KEY, function (error, response, body) {
			if (error) {
				console.log(error);
			}
			var body = JSON.parse(body);
			currentPost['photo_share_url'] = body.url;
			currentPost['photo_share_url_expiration'] = new Date(body.expires).getTime() + (3.5 * 60 * 60 * 1000); // 3.5 hours
			currentPost.save(function (err) {
				if (err) {
					console.log(err);
				}
				if (!response.posts) {
					response.posts = [];
				}
				response.posts.push(currentPost);
			});
		});
}