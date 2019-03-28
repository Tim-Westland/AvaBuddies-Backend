const express = require('express');
const router = express.Router();
const User = require('../models/user');
//Lets say the route below is very sensitive and we want only authorized users to have access

//Displays information tailored according to the logged in user
router.get('/profile', (req, res, next) => {
  //We'll just send back the user details and the token
  console.log(req.user);
  User.
  findOne({
    _id: req.user._id
  }).
  // select('_id title').
  exec(function(err, user) {
    res.json({
      user : user,
    })
  })
});

router.get('/switchrole', (req, res, next) => {
  //We'll just send back the user details and the token
  User.
  findOne({
    _id: req.user._id
  }).
  // select('_id title').
  exec(function(err, user) {
    if(user.role == 'user'){
      user.role = 'admin'
    }
    else{
      user.role = 'user'
    }
    user.save();
    res.json({status: 'success'})
  })
});

module.exports = router;
