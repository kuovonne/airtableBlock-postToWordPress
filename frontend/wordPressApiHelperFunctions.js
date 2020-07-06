/*******************************************************************************
****** Wordpress API Helper Functions ******
These functions create, update, and delete WordPress posts
These Functions handle authentication using the JWT Authentication for WP REST API plugin.
https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
*******************************************************************************
*/


/*******************************************************************************
This function creates a new WordPress post.
*******************************************************************************
*/
export function newWordPressPost(wordPressDomain, jwtoken, postBody, callback) {
  let url = wordPressDomain + "/wp-json/wp/v2/posts";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + jwtoken,
    },
    body: JSON.stringify(postBody),
  })
  .then(response => {
    return response.json()
  })
  .then(data => callback(data))
  .catch(error => callback(error))
}


/*******************************************************************************
This function updates an existing WordPress post
*******************************************************************************
*/
export function updateWordPressPost(wordPressDomain, jwtoken, postId, postBody, callback) {
  let url = wordPressDomain + "/wp-json/wp/v2/posts/" + postId + "/";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + jwtoken,
    },
    body: JSON.stringify(postBody),
  })
  .then(response => {
    return response.json()
  })
  .then(data => callback(data))
  .catch(error => callback(error))
}


/*******************************************************************************
This function deletes an existing WordPress post
*******************************************************************************
*/
export function deleteWordPressPost(wordPressDomain, jwtoken, postId, callback) {
  let url = wordPressDomain + "/wp-json/wp/v2/posts/" + postId;
  fetch(url, {
    method: "DELETE",
    headers: {
      "Authorization": 'Bearer ' + jwtoken,
    },
  })
  .then(response => {
    return response.json()
  })
  .then(data => callback(data))
  .catch(error => callback(error))
}
