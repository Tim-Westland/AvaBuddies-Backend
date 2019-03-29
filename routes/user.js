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

router.post('/updateprofile', (req,res)=>{
  User.findOne({
    _id: req.user._id
  }).exec(function (err,user) {
    user.aboutme = req.body.aboutme;
    user.sharelocation = req.body.sharelocation;



    user.save();
    res.json({status: 'success'})
  })
});

router.post('/changeimage', (req,res)=>{
  User.findOne({
    _id: req.user._id
  }).exec(function (err,user) {
    user.image = req.body.image;
    user.save();
    res.json({status: 'success'})
  })
});

router.get('/list', (req,res) => {
  User.find().exec(function (err, result) {
    res.json(result);
  })
});

router.delete('/destroy/:id', (req, res) => {
  var id = req.params.id;
  User.findOne({
    _id: id
  }).remove().exec();
  res.json({status: 'success'})
});

router.get('/find/:keyword', (req, res) => {
  var id = req.params.id;
  User.find({
    _id: id
  }).remove().exec();
  res.json({status: 'success'})
});

router.get('/switchrole', (req, res, next) => {
  User.
  findOne({
    _id: req.user._id
  }).
  // select('_id title').
  exec(function(err, user) {
    if(user.isAdmin == false){
      user.isAdmin = true
    }
    else{
      user.isAdmin = false
    }
    user.save();
    res.json({status: 'success'})
  })
});

module.exports = router;
