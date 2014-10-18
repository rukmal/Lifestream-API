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
			newPost['voteDelta'] = 0;
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
						checkPhotoShareUrl(currentPost.photoId, currentPost, response);
					}
					if (count >= 19) {
						break;
					}
				}
				res.send(response);
			});
		});

	// Append post upvotes
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
				updateVoteDelta(res, post, post.upvotes, post.downvotes);
			});
		});

	// Append post downvotes
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
				updateVoteDelta(res, post, post.upvotes, post.downvotes);
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
				newComment['downvotes'] = 0;
				newComment['posted_at'] = new Date().getTime();
				newComment['photo'] = req.body.photo;
				newComment['voteDelta'] = 0;
				var newMongooseComment = new Comments(newComment);
				newMongooseComment.save(function (err, comment) {
					if (err) {
						console.log(err);
						res.status(500).end();
					}
					post.comments.push(newMongooseComment._id);
					post.save(function (err) {
						if (err) {
							console.log(err);
							res.status(500).end();
						}
						res.status(200).end();
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
				if (post.comments.length) {
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
				voteDelta: -1
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
					checkPhotoShareUrl(currentPost.photo, currentPost, response);
					if (count >= 19) {
						break;
					}
				}
				res.send(response);
			});
		});

	// Append comment downvote
	router.route('/post/comment/downvote')
		.post(function (req, res) {
			checkHeaders(res, req.body, ['latitude', 'longitude', 'comment_id', 'photo']);
			var candidateLocation = getLocation(req.body.latitude, req.body.longitude);
			Posts.findOne({ photo: req.body.photo }, function (err, post) {
				if (err) {
					console.log(err);
					res.status(500).end();
				}
				if (post.location_bucket != candidateLocation) {
					res.status(400).end();
				}
			});
			Comments.findOne({ _id: comment_id }, function (err, comment) {
				if (err) {
					console.log(err);
					res.status(500).end();
				}
				comment.downvotes++;
				updateVoteDelta(res, comment, comment.upvotes, comment.downvotes);
			});
		});

	// Append comment upvote
	router.route('/post/comment/upvote')
		.post(function (req, res) {
			checkHeaders(res, req.body, ['latitude', 'longitude', 'comment_id', 'photo']);
			var candidateLocation = getLocation(req.body.latitude, req.body.longitude);
			Posts.findOne({ photo: req.body.photo }, function (err, post) {
				if (err) {
					console.log(err);
					res.status(500).end();
				}
				if (post.location_bucket != candidateLocation) {
					res.status(400).end();
				}
			});
			Comments.findOne({ _id: comment_id }, function (err, comment) {
				if (err) {
					console.log(err);
					res.status(500).end();
				}
				comment.upvotes++;
				updateVoteDelta(res, comment, comment.upvotes, comment.downvotes);
			});
		});

	// Get all posts by a user
	router.route('/post/user')
		.post(function (req, res) {
			checkHeaders(res, req.body, ['user_id']);
			Posts.find({ user_id: req.body.user_id }, function (err, matchedPosts) {
				if (err) {
					console.log(err);
					res.status(500).end();
				}
				var response = {};
				response.posts = [];
				for (var postNumber in matchedPosts) {
					var currentPost = matchedPosts[postNumber];
					checkPhotoShareUrl(currentPost.photo, currentPost, response);
				}
				res.send(response);
			});
		});

	// Get all comments by a user
	router.route('/post/comment/user')
		.post(function (req, res) {
			checkHeaders(res, req.body, ['user_id']);
			Comments.find({ user_id: req.body.user_id }, function (err, matchedComments) {
				if (err) {
					console.log(err);
					res.status(500).end();
				}
				var response = {};
				response.posts = [];
				for (var commentNo in matchedComments) {
					var currentComment = matchedComments[commentNo];
					var parentPhoto = currentComment.photo;
					Posts.findOne({ photo: parentPhoto }, function (err, post) {
						if (err) {
							console.log(err);
							res.status(500).end()
						}
						checkPhotoShareUrl(post.photo, post, response);
					});
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

	/**
	 * Function to check if a photo has a public share url, if
	 * it does, check if it's valid. Serve as is if it is, or renew
	 * it if it has expired
	 * @param {String} photoId  	Unique ID of the photo
	 * @param {Object} currentPost  Current post object
	 * @param {Object} response     Response object
	 */
	function checkPhotoShareUrl (photoId, currentPost, response) {
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

	/**
	 * Function to update the vote delta of the post/comment
	 * @param  {Object} res                Node.js response object
	 * @param  {Object} currentMongoObject MongoDB object
	 * @param  {Number} upvotes            Number of upvotes
	 * @param  {Number} downvotes          Number of downvotes
	 */
	function updateVoteDelta (res, currentMongoObject, upvotes, downvotes) {
		currentMongoObject.voteDelta = upvotes - downvotes;
		currentMongoObject.save(function (err) {
			if (err) {
				console.log(err);
				res.status(500).end();
			}
			res.status(200).end();
		});
	}
}

module.exports = Api;