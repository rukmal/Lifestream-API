function Api (Posts, router, picture_db, uuid) {
	var uuid = require('node-uuid');

	// Add new post
	router.route('/post/new')
		.post(function (req, res) {
			checkHeaders(res, req.body, ['user_id', 'caption', 'photo', 'latitude', 'longitude']);
			var newPost = {};
			newPost['location_bucket'] = getLocation(req.body.latitude, req.body.longitude);
			if (req.body.alias) {
				newPost['alias'] = req.body.alias;
			}
			newPost['user_id'] = req.body.user_id;
			newPost['upvotes'] = 0;
			newPost['downvotes'] = 0;
			newPost['photo'] = processPhoto(req.body.photo);
			newPost['caption'] = req.body.caption;
			newPost['posted_at'] = new Date().getTime();
			var newMongoosePost = new Posts(newPost);
			newMongoosePost.save(function (err) {
				if (err) {
					console.log(err);
					res.status(500).end();
				} else {
					res.status(200).end();
				}
			});
		});

	// View all posts
	router.route('/post/view')
		.post(function (req, res) {
			checkHeaders(res, req.body, ['latitude', 'longitude', 'current_time']);
			var requestLocationBucket = getLocation(req.body.latitude, req.body.longitude);
			Posts.find({ location_bucket: requestLocationBucket, posted_at: -1 }, function (err, matchPosts) {
				if (err) {
					console.log(err);
					res.status(500).end();
				}
				var postCursor = Posts.find();
				postCursor.sort({ posted_at: -1 });
				var response = [];
				if (sortedPosts.size === 0) {
					res.send([]).end();
				}
				var counter = 0;
				for (var postNo in sortedPosts) {
					var post = sortedPosts[postNo];
					if (post.posted_at < req.body.current_time) {
						delete post.user_id;
						response.push(post);
					}
					if (counter >= 20) {
						break;
					}
				}
				res.send(response).end();
			});
		});

	/**
	 * Function to get the corresponding location
	 * 'bucket', when given latitude and longitude
	 * @param  {String} latitude  Current latitude
	 * @param  {String} longitude Current longitude
	 * @return {String}           Location bucket
	 */
	function getLocation (latitude, longitude) {
		return 'University of Washington';
	}

	/**
	 * Function to check the headers of the requests
	 * This function sends a 400 (bad request) error
	 * code if all of the required headers are not present
	 * @param  {Object} res        Response object
	 * @param  {Object} reqBody    Request body
	 * @param  {Array} parameters Array of required parameters
	 */
	function checkHeaders (res, reqBody, parameters) {
		for (var parameterNo in parameters) {
			var parameter = parameters[parameterNo];
			if (!reqBody.hasOwnProperty(parameter)) {
				res.status(400).end();
			}
		}
	}

	/**
	 * Function to process a photo by generating a unique
	 * ID and saving it to the picture database
	 * @param  {String} base64Image Base64 encoded JPEG image
	 * @return {String}             Unique image ID
	 */
	function processPhoto (base64Image) {
		var imageID = uuid.v4();
		picture_db.saveImage(imageID, base64Image);
		return imageID + '.jpg';
	}
}

module.exports = Api;