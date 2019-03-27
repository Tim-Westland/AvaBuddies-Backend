const simpleOauthModule = require("simple-oauth2");
const jwt = require('jsonwebtoken');

var clientId = "3ad76aa6-6405-4d8b-bfc6-b5050fa71aaa";
var clientSecret = ":-*6]?X*.{-/={*?]+^?_?I]?4d$+L;|*)=%*=()&";
var redirectUri = "http://localhost:3000/auth/authorize";

var scopes = ["User.ReadBasic.All", "User.Read", "openid", "offline_access"];

const oauth2 = simpleOauthModule.create({
  client: {
    id: clientId,
    secret: clientSecret
  },
  auth: {
    tokenHost: "https://login.microsoftonline.com",
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
      redirect_uri: redirectUri
    };

    try {
      const result = await oauth2.authorizationCode.getToken(options);

      console.log("The resulting token: ", result);

      const token = oauth2.accessToken.create(result);

      const user = jwt.decode(token.token.id_token);

      // Save the access token in a cookie
      res.cookie("graph_access_token", token.token.access_token, {
        maxAge: 3600000,
        httpOnly: true
      });

    } catch (error) {
      console.error("Access Token Error", error.message);
      return res.status(500).json("Authentication failed");
    }
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
  },

  async getAccessToken(cookies, res) {
    var cookiesList = this.parseCookies(cookies);

    // Do we have an access token cached?
    console.log(cookiesList.graph_access_token);
    let token = cookiesList.graph_access_token;
  
    return token;
  },

  parseCookies (request) {
    var list = {},
        rc = request;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}
};


