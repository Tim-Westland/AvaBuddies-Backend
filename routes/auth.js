const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const authHelper = require("../helpers/authHelper");
const request = require("request");

const router = express.Router();

//When the user sends a post request to this route, passport authenticates the user based on the
//middleware created previously
router.post(
  "/signup",
  passport.authenticate("signup", {
    session: false
  }),
  async (req, res, next) => {
    console.log("here");
    res.json({
      message: "Signup successful",
      user: req.user
    });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      console.log(user);
      if (err || !user) {
        const error = new Error("An Error occured");
        return next(error);
      }
      req.login(user, { session: false }, async error => {
        if (error) return next(error);
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { _id: user._id, email: user.email };
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign(
          { user: body, expiresIn: "5" },
          keys.jwt.secret_key,
          { expiresIn: "24h" }
        );
        var array = [];
        array.push(token);
        var nameArray = [];
        nameArray.push("application_access_token");
        authHelper.setMultipleCookies(req, res, array, nameArray);
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get("/", function(req, res, next) {
  res.redirect(authHelper.getAuthUrl());
});

router.get("/authorize", async function(req, res) {
  var authCode = req.query.code;
  if (authCode) {
    authHelper.getTokenFromCode(authCode, req, res);
    cookiesList = authHelper.getCookies(req.headers.cookie, res);
    console.log(cookiesList.graph_access_token);
    var options = {
      method: "POST",
      url: "http://localhost:3000/auth/login",
      headers: {
        "Postman-Token": "8905252b-bd96-4411-beca-c9c58526f142",
        "cache-control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      form: {
        email: authHelper.getEmail(req, res, cookiesList.graph_access_token),
        password: keys.password,
        undefined: undefined
      }
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });
    cookiesList = authHelper.getCookies(req.headers.cookie, res);
    var options = {
      method: "GET",
      url: "http://localhost:3000/index",
      headers: {
        "Postman-Token": "d8f9d70e-853c-475d-8860-215a9339add5",
        "cache-control": "no-cache",
        Authorization: "Bearer " + cookiesList.application_access_token
      }
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });
  } else {
    // redirect to home
    console.log(
      "/authorize called without a code parameter, redirecting to login"
    );
    res.redirect("/");
  }
});

module.exports = router;
