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
|```current_time```|Number|Number of milliseconds since 1970/01/01 (equivalent of ```new Date().getTime()```)|
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
|```current_time```|Number|Number of milliseconds since 1970/01/01 (equivalent of ```new Date().getTime()```)|
#### Response Codes:
|*Code*|*Description*|
|:----:|:------------|
|200|All OK. Posts returned|
|400|Bad request. Check headers|
|500|Database error. See server logs|
