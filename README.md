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