var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/authHelper');
var graph = require('@microsoft/microsoft-graph-client');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let parms = { title: 'Inbox', active: { inbox: true } };

  const accessToken = await authHelper.getAccessToken(req.headers.cookie, res);

  if (accessToken) {

    // Initialize Graph client
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    try {
      // Get the 10 newest messages from inbox
      const result = await client
      .api('/me/mail').get();

      parms.mail = result.value;
      console.log(result);
    } catch (err) {
      parms.message = 'Error retrieving messages';
      parms.error = { status: `${err.code}: ${err.message}` };
      res.render('error', parms);
    }


  } else {
    // Redirect to home
    res.redirect('/');
  }

  res.render('dashboard', parms);
});




module.exports = router;
