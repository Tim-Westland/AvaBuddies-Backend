const express = require('express');
const router = express.Router();
const User = require('../models/user');
//Lets say the route below is very sensitive and we want only authorized users to have access

//Displays information tailored according to the logged in user
router.get('/profile', (req, res, next) => {
  //We'll just send back the user details
  User.findOne({
    _id: req.user._id
  }).exec(function(err, result) {
    res.json({
      user : result,
    })
  })
});

router.get("/user/:id", (req,res,next)=>{
  User.findOne({_id:req.params.id}).exec(function (err, result) {
    if(err) return res.status(500).json({message:"could not find user."});

    var info = user;
    delete info.
  })
});

router.post('/updateprofile', (req,res)=>{
  User.updateOne({ _id: req.user._id },
    { aboutme: req.body.aboutme,
      sharelocation: req.body.sharelocation}).exec(function (err, result) {
        res.json('success');
      })

});

router.post('/updateprofilepicture', (req,res)=>{
  User.updateOne({ _id: req.user._id }, { image: req.body.image})
  .exec(function (err, result) {
      res.json('success');
    })
});

router.get('/list', (req,res) => {
  User.find().exec(function (err, result) {
    res.json({
        users : result
    });
  })
});

router.delete('/destroy/:id', (req, res) => {
  var id = req.params.id;
  User.deleteOne({
    _id: id
  }).exec();
  res.json({status: 'success'})
});

router.get('/find/:keyword', (req, res) => {
  var keyword = req.params.keyword;
  User.find( { 'name' : { '$regex' : keyword, '$options' : 'i' } } ).exec(function (err, result) {
    res.json(result);
  })
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
