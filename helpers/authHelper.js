const simpleOauthModule = require("simple-oauth2");
const jwt = require("jsonwebtoken");
const graph = require("@microsoft/microsoft-graph-client");
const cookie = require('cookie');

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
      const token = oauth2.accessToken.create(result);

      var array = [];
      array.push(token.token.access_token);
      array.push(await this.setEmail(req, res, token.token.access_token));

      var nameArray = [];
      nameArray.push("graph_access_token");
      nameArray.push("user_email");

      this.setMultipleCookies(req, res, array, nameArray);
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

  setEmail: async function(req, res, graph_access_token) {
    if (graph_access_token) {
      // Initialize Graph client
      const client = graph.Client.init({
        authProvider: done => {
          done(null, graph_access_token);
        }
      });

      try {
        // Get the 10 newest messages from inbox
        const result = await client.api("/me/mail").get();

        return result.value;
      } catch (err) {
        res.render("error", err);
      }
    }
  },

  setMultipleCookies: function(req, res, array, nameArray) {
    var i = 0;
    var currentCookie = "";

    array.forEach(element => {
      currentCookie = cookie.serialize(nameArray[i], element.toString(), {
        httpOnly: true,
        path: "/",
        signed: true
      });

      if (i == 0) {
        res.setHeader("Set-Cookie", currentCookie);
      } else {
        res.append("Set-Cookie", currentCookie);
      }
      i++;
    });
  },

  getCookies: async function(cookies, res) {
    var cookiesList = this.parseCookies(cookies);
    return cookiesList;
  },

  parseCookies(request) {
    var list = {},
      rc = request;

    rc &&
      rc.split(";").forEach(function(cookie) {
        var parts = cookie.split("=");
        list[parts.shift().trim()] = decodeURI(parts.join("="));
      });

    return list;
  }
};
