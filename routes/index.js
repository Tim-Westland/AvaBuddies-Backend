var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Friend = require('../models/friends');

/* GET home page. */
router.get('/', function(req, res, next) {
  // Friend.findOne({
  //   friend1: '5caf0ea553e5f08a5c630453',
  //   friend2: '5caf0ea553e5f08a5c630454',
  //   confirmed: false
  // }).exec(function(err, result) {
  //   res.send(result)
  // });
  User.find().exec(function(err, users) {
    Friend.find().exec(function(err, requests) {

      res.send({
        user: req.user,
        users: users,
        requests: requests
      });

    })
  })

});




module.exports = router;
