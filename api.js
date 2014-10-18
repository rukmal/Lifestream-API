function Api (Posts, Comments, router, picture_db, uuid) {

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
			newPost['comments'] = [];
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
			checkHeaders(res, req.body, ['latitude', 'longitude', 'last_post_time']);
			var requestLocationBucket = getLocation(req.body.latitude, req.body.longitude);
			Posts.find({
				location_bucket: requestLocationBucket
			}).sort({
				posted_at: -1
			}).exec(function (err, matchedPosts) {
				if (err) {
					console.log(err);
					res.status(500).end();
				}
				var response = {};
				response['posts'] = [];
				var count = 0;
				for (var postNo in matchedPosts) {
					var currentPost = matchedPosts[postNo];
					if (currentPost.posted_at < Number(req.body.last_post_time)) {
						count++;
						delete currentPost.user_id;
						// checking if the current post has a public image url
						// checks if it is expired, if it is create a new one.
						// if not, return the current url
						if (!currentPost.photo_share_url) {
							picture_db.getImageUrl(currentPost.photo, currentPost, response);
						} else {
							if (currentPost.photo_share_url_expiration < new Date().getTime()) {
								picture_db.getImageUrl(currentPost.photo, currentPost, response);
							} else {
								response.posts.push(currentPost);
							}
						}
					}
					if (count >= 19) {
						break;
					}
				}
				res.send(response);
			});
		});

	// Append upvotes
	router.route('/post/upvote')
		.post(function (req, res) {
			checkHeaders(res, req.body, ['photo', 'latitude', 'longitude']);
			var candidateLocation = getLocation(req.body.latitude, req.body.longitude);
			Posts.findOne({ photo: req.body.photo }, function (err, post) {
				if (err || post.location_bucket != candidateLocation) {
					console.log(err);
					res.status(500).end();
				}
				post.upvotes += 1;
				post.save(function (err) {
					if (err) {
						console.log(err);
						res.status(500).end();
					}
					res.send(post);
				});
			});
		});

	// Append downvotes
	router.route('/post/downvote')
		.post(function (req, res) {
			checkHeaders(res, req.body, ['photo', 'latitude', 'longitude']);
			var candidateLocation = getLocation(req.body.latitude, req.body.longitude);
			Posts.findOne({ photo: req.body.photo }, function (err, post) {
				if (err || post.location_bucket != candidateLocation) {
					console.log(err);
					res.status(500).end();
				}
				post.downvotes += 1;
				post.save(function (err) {
					if (err) {
						console.log(err);
						res.status(500).end();
					}
					res.send(post);
				});
			});
		});

	// Add a comment
	router.route('/post/comment')
		.post(function (req, res) {
			checkHeaders(res, req.body, ['user_id', 'photo', 'content', 'latitude', 'longitude']);
			var candidateLocation = getLocation(req.body.latitude, req.body.longitude);
			Posts.findOne({ photo: req.body.photo }, function (err, post) {
				if (err || post.location_bucket != candidateLocation) {
					console.log(err);
					res.status(500).end();
				}
				var newComment = {};
				newComment['content'] = req.body.content;
				newComment['user_id'] = req.body.user_id;
				newComment['alias'] = req.body.alias;
				newComment['upvotes'] = 0;
				newComment['downvote'] = 0;
				newComment['posted_at'] = new Date().getTime();
				var newMongooseComment = new Comments(newComment);
				newMongooseComment.save(function (err, comment) {
					if (err) {
						console.log(err);
					}
					post.comments.push(newMongooseComment._id);
					post.save(function (err) {
						if (err) {
							console.log(err);
							res.status(500).end();
						}
						res.status(200).send();
					});
				});
			});
		});

	// View detailed post
	router.route('/post/detailed')
		.post(function (req, res) {
			checkHeaders(res, req.body, ['photo']);
			Posts.findOne({ photo: req.body.photo }, function (err, post) {
				if (err) {
					console.log(err);
					res.status(500).end();
				}
				if (post.comments) {
					post.comment_content = [];
					for (var commentNo in post.comments) {
						var currentComment = post.comments[commentNo];
						Comments.findOne({ _id: currentComment }, function (err, comment) {
							if (err) {
								console.log(err);
								res.status(500).end();
							}
							post.comment_content.push(comment);
						});
					}
				}
				res.send(post);
			});
		});

	// View hot posts
	router.route('/post/hot')
		.post(function (req, res) {
			checkHeaders(res, req.body, ['latitude', 'longitude']);
			var candidateLocation = getLocation(req.body.latitude, req.body.longitude);
			Posts.find({
				location_bucket: candidateLocation
			}).sort({
				upvotes: -1,
				downvotes: 1
			}).exec(function (err, matchedPosts) {
				if (err) {
					console.log(err);
					res.status(500).end();
				}
				var response = {};
				response.posts = [];
				var count = 0;
				for (var postNo in matchedPosts) {
					count++;
					var currentPost = matchedPosts[postNo];
					// checking if the current post has a public image url
					// checks if it is expired, if it is create a new one.
					// if not, return the current url
					if (!currentPost.photo_share_url) {
						picture_db.getImageUrl(currentPost.photo, currentPost, response);
					} else {
						if (currentPost.photo_share_url_expiration < new Date().getTime()) {
							picture_db.getImageUrl(currentPost.photo, currentPost, response);
						} else {
							response.posts.push(currentPost);
						}
					}
					if (count >= 19) {
						break;
					}
				}
				res.send(response);
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
		var imageID = uuid.v4() + '.jpg';
		picture_db.saveImage(imageID, base64Image);
		return imageID;
	}
}

module.exports = Api;