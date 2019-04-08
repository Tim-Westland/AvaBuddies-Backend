var express = require('express');
var router = express.Router();
const friend = require('../models/friends');

/* GET home page. */
router.get("/requests", function(req, res, next) {
    friend.find({friend1:req.user._id, confirmed: false}).exec(function (err, own_requests) {
        if(err) return res.status(500).json({message:"an error occured "+err});
       friend.find({friend2:req.user._id, confirmed: false}).exec(function (err, requests) {
           if(err) return res.status(500).json({message:"an error occured "+err});
           res.json({own_requests: own_requests, requests: requests});
       })
    });
});

router.get("/allconnections", function(req, res, next) {
    friend.find({$or:[{friend1: req.user._id},{friend2:req.user._id}]}).exec(function (err, connections) {
        if(err) return res.status(500).json({message:"an error occured "+err});
        res.json({connections:connections});
    });
});

router.post("/dorequest", function(req,res,next){
    if(!req.body.friend) return res.status(422).json({message:"missing friend id in body"});
    var friends = new friend({friend1:req.user._id, friend2: req.body.friend, confirmed: false});
    friends.save(function (err) {
       if (err) return res.status(500).json({message:"error while saving "+err});
    });
    res.json({message: "success"});
});

router.get("/friends", function(req,res,next){
    friend.find({$or:[{friend1: req.user._id},{friend2:req.user._id}],confirmed: true}).exec( function (err, result) {
        if(err) return res.status(500).json({message:err});
        res.json({friends: result});
    });

});

router.post("/acceptrequest/:id", function(req,res,next){
    friend.findOne({friend1: req.params.id, confirmed: false}).exec(function (err, result) {
        if(err) return res.status(500).json({message: "could not find request "+err});
        result.confirmed = true;
        result.save(function (err) {
           if(err)  return res.status(500).json({message:"error while saving "+err});
       });
        res.json({message:"success"});
    });
});


router.post("/denyrequest/:id", function(req,res,next){
    friend.deleteOne({friend1: req.params.id, confirmed: false}).exec(function (err) {
        if(err) return res.status(500).json({message: "could not find request "+err});
        res.json({message:"success"});
    });
});



module.exports = router;
