const simpleOauthModule = require("simple-oauth2");

var clientId = "3ad76aa6-6405-4d8b-bfc6-b5050fa71aaa";
var clientSecret = ":-*6]?X*.{-/={*?]+^?_?I]?4d$+L;|*)=%*=()&";
var redirectUri = "http://localhost:3000/auth/authorize";

var scopes = ["openid", "offline_access"];

const oauth2 = simpleOauthModule.create({
  client: {
    id: clientId,
    secret: clientSecret
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    tokenPath: "common/oauth2/v2.0/token",
    authorizePath: "common/oauth2/v2.0/authorize"
  },
  options: {
    authorizationMethod: "body"
  }
});

module.exports = {
  getAuthUrl: function() {
    var returnVal = oauth2.authorizationCode.authorizeURL({
      redirect_uri: redirectUri,
      scope: scopes.join(" ")
    });
    console.log("");
    console.log("Generated auth url: " + returnVal);
    return returnVal;
  },

    getTokenFromCode: async function(code, req, res) {
        const options = {
            code,
            redirect_uri: redirectUri,
          };

          try {
            const result = await oauth2.authorizationCode.getToken(options);
      
            console.log('The resulting token: ', result);
      
            const token = oauth2.accessToken.create(result);
      
            return res.status(200).json(token)
          } catch(error) {
            console.error('Access Token Error', error.message);
            return res.status(500).json('Authentication failed');
          }
      
    
        /*oauth2.authorizationCode.getToken(
      {
        code: auth_code,
        redirect_uri: redirectUri,
        scope: scopes.join(" ")
      },
      function(error, result) {
        if (error) {
          console.log("Access token error: ", error.message);
          callback(request, response, error, null);
        } else {
          var token = oauth2.accessToken.create(result);
          console.log("");
          console.log("Token created: ", token.token);
          callback(request, response, null, token);
        }
      }
    );*/
  },

  getEmailFromIdToken: function(id_token) {
    console.log('test')
    // JWT is in three parts, separated by a '.'
    var token_parts = id_token.split(".");

    // Token content is in the second part, in urlsafe base64
    var encoded_token = new Buffer(
      token_parts[1].replace("-", "+").replace("_", "/"),
      "base64"
    );

    var decoded_token = encoded_token.toString();

    var jwt = JSON.parse(decoded_token);

    console.log(jwt.preferred_username)
    // Email is in the preferred_username field
    return jwt.preferred_username;
  },

  getTokenFromRefreshToken: function(
    refresh_token,
    callback,
    request,
    response
  ) {
    var token = oauth2.accessToken.create({
      refresh_token: refresh_token,
      expires_in: 0
    });
    token.refresh(function(error, result) {
      if (error) {
        console.log("Refresh token error: ", error.message);
        callback(request, response, error, null);
      } else {
        console.log("New token: ", result.token);
        callback(request, response, null, result);
      }
    });
  }
};
