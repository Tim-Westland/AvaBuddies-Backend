var express = require("express");
var router = express.Router();
var authHelper = require("../helpers/authHelper");
var graph = require("@microsoft/microsoft-graph-client");

/* GET home page. */
router.get("/", async function(req, res, next) {
  let parms = { title: "Inbox", active: { inbox: true } };

  cookiesList = authHelper.getCookies(req.headers.cookie, res);
  parms.email = cookiesList.email;
  console.log(parms.email);
  res.render("dashboard", parms);
});

module.exports = router;
