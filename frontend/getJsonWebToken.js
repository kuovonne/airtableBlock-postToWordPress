function getJsonWebToken(wordPressDomain, wordPressUsername, wordPressPassword, callback) {
  let url = wordPressDomain + "/wp-json/jwt-auth/v1/token";
  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
        username: wordPressUsername,
        password: wordPressPassword,
    }),
    headers: {
        'Content-Type': 'application/json'
    }
  })
  .then(response => {
    return response.json()
  })
  .then(tokenObj => {
    if (tokenObj.token) {
      callback({success: true, token: tokenObj.token});
    } else {
      callback({success: false, message: tokenObj});
    }
  })
  .catch((error) => {
    callback({success: false, message: error});
  })
}


export default getJsonWebToken;
