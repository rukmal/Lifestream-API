# ghostfra.me API

## Important Information

- The base URL for the API is ```http://v1.api.ghostfra.me/```
- All API calls must have the API key passed through with a key called '```key```'.

## API Specification

### Endpoint: ```/post/new```
#### Description: Add a new post
#### Method: ```POST```
#### Parameters:
|*Name*|*Type*|*Description*|
|:----:|:----:|:------------|
|```user_id```|String|Unique ID of the user device|
|```caption```|String|Caption of the photo|
|```latitude```|String|Current latitude of the user|
|```longitude```|String|Current longitude of the user|
|```alias```|String|Alias of the user (this is optional)|
|```photo```|String|Base64 sequence of the encoded photo|
#### Response Codes:
|*Code*|*Description*|
|:----:|:------------|
|200|All OK. Post added|
|400|Bad request. Check headers|
|500|Database error. See server logs|

### Endpoint: ```/post/view```
#### Description: View posts (returns most recent 20 from the time requested)
#### Method: ```POST```
#### Parameters:
|*Name*|*Type*|*Description*|
|:----:|:----:|:------------|
|```latitude```|String|Current latitude of the user|
|```longitude```|String|Current longitude of the user|
|```last_post_time```|Number|Number of milliseconds since 1970/01/01 (equivalent of ```new Date().getTime()```) to the posted time of the last post in the feed|
#### Response Codes:
|*Code*|*Description*|
|:----:|:------------|
|200|All OK. Posts returned|
|400|Bad request. Check headers|
|500|Database error. See server logs|

### Endpoint: ```/post/upvote```
#### Description: Append the number of upvotes for a post by 1
#### Method: ```POST```
#### Parameters:
|*Name*|*Type*|*Description*|
|:----:|:----:|:------------|
|```photo```|String|ID of the photo for which the upvote should be appended|
|```latitude```|String|Current latitude of the user|
|```longitude```|String|Current longitude of the user|
#### Response Codes:
|*Code*|*Description*|
|:----:|:------------|
|200|All OK. Upvote appended|
|400|Bad request. Check headers|
|500|Databse error. See server logs|

### Endpoint: ```/post/downvote```
#### Description: Append the number of downvotes for a post by 1
#### Method: ```POST```
#### Parameters:
|*Name*|*Type*|*Description*|
|:----:|:----:|:------------|
|```photo```|String|ID of the photo for which the downvote should be appended|
|```latitude```|String|Current latitude of the user|
|```longitude```|String|Current longitude of the user|
#### Response Codes:
|*Code*|*Description*|
|:----:|:------------|
|200|All OK. Downvote appended|
|400|Bad request. Check headers|
|500|Databse error. See server logs|

### Endpoint: ```/post/comment```
#### Description: Add a new comment
#### Method: ```POST```
#### Parameters:
|*Name*|*Type*|*Description*|
|:----:|:----:|:------------|
|```user_id```|String|Unique ID of the user device|
|```photo```|String|ID of the photo to which the comment should be appended|
|```latitude```|String|Current latitude of the user|
|```longitude```|String|Current longitude of the user|
|```content```|String|Content of the comment|
|```alias```|String|Alias of the user (optional)|
#### Response Codes:
|*Code*|*Description*|
|:----:|:------------|
|200|All OK. Comment added|
|400|Bad request. Check headers|
|500|Database error. See server logs|

### Endpoint: ```/post/detailed```
#### Description: Get detailed view of a post
#### Method: ```POST```
#### Parameters:
|*Name*|*Type*|*Description*|
|:----:|:----:|:------------|
|```photo```|String|ID of the photo for which the detailed view is to be displayed|
#### Response Codes:
|*Code*|*Description*|
|:----:|:------------|
|200|All OK. Detailed view returned|
|400|Bad request. Check request headers|
|500|Database error. See server logs|

### Endpoint: ```/post/hot```
#### Description: Get list of 'hot' (i.e. most popular) posts
#### Method: ```POST```
#### Parameters:
|*Name*|*Type*|*Description*|
|:----:|:----:|:------------|
|```latitude```|String|Current latitude of the user|
|```longitude```|String|Current longitude of the user|
#### Response Codes:
|*Code*|*Description*|
|:----:|:------------|
|200|All OK. List of hot posts returned|
|400|Bad request. Check request headers|
|500|Databse error. See server logs|

### Endpoint: ```/post/comment/upvote```
#### Description: Append comment upvote by 1
#### Method: ```POST```
#### Parameters:
|*Name*|*Type*|*Description*|
|:----:|:----:|:------------|
|```photo```|String|Unique ID of the photo|
|```comment_id```|String|Unique ID of the comment|
|```latitude```|String|Current latitude of the user|
|```longitude```|String|Current longitude of the user|
#### Response Codes:
|*Code*|*Description*|
|:----:|:------------|
|200|All OK. Comment upvote appended|
|400|Bad request. Check request headers|
|500|Databse error. See server logs|

### Endpoint: ```/post/comment/downvote```
#### Description: Append comment downvote by 1
#### Method: ```POST```
#### Parameters:
|*Name*|*Type*|*Description*|
|:----:|:----:|:------------|
|```photo```|String|Unique ID of the photo|
|```comment_id```|String|Unique ID of the comment|
|```latitude```|String|Current latitude of the user|
|```longitude```|String|Current longitude of the user|
#### Response Codes:
|*Code*|*Description*|
|:----:|:------------|
|200|All OK. Comment downvote appended|
|400|Bad request. Check request headers|
|500|Databse error. See server logs|

### Endpoint: ```/post/user```
#### Description: Get all posts by a specific user ID
#### Method: ```POST```
#### Parameters:
|*Name*|*Type*|*Description*|
|:----:|:----:|:------------|
|```user_id```|String|Unique ID of the user device|
#### Response Codes:
|*Code*|*Description*|
|:----:|:------------|
|200|All OK. List of posts by user returned|
|400|Bad request. Check request headers|
|500|Database error. See server logs|

### Endpoint: ```/post/comment/user```
#### Description: Get all comments (and parent posts) by a specific user ID
#### Method: ```POST```
#### Parameters:
|*Name*|*Type*|*Description*|
|:----:|:----:|:------------|
|```user_id```|String|Unique ID of the user device|
#### Response Codes:
|*Code*|*Description*|
|:----:|:------------|
|200|All OK. List of posts containing specific user comments returned|
|400|Bad request. Check request headers|
|500|Database error. See server logs|