const User = require('../models/user');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');

exports.signupUser = async(req, res) => {
  var shareLocation = false;
  if (req.body.sharelocation) {
      shareLocation = req.body.sharelocation;
  }

  var user = new User({
      email: req.body.email,
      name: req.body.name,
      password: process.env.BACKEND_PASSWORD,
      sharelocation: shareLocation
  });

  var savedUser = await user.save()
  .then((result) => {
    return result;
  }).catch((err) => {
      return err.message;
  });
  return returnData(req.test, savedUser, res);
};

function returnData (test, data, res) {
  if (test) {
    return data
  } else {
    return res.json(data)
  }
}
