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
|```latitude```|String|Current latitude of the user|
|```longitude```|String|Current longitude of the user|
|```alias```|String|Alias of the user (this is optional)|
|```photo```|String|Base64 sequence of the encoded photo|
|```current_time```|Number|Number of milliseconds since 1970/01/01 (equiv. of ```new Date().getTime()```)|