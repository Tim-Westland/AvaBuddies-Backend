const Friend = require('../models/friend');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');



exports.getRequests = async (req, res) => {
  var error;
  var own_requests = await Friend.find({ user: req.user._id, confirmed: false })
  .populate('user friend', '-image -password')
  .exec().then(function (result) {
    return result;
  }).catch(function (err) {
    var error = err.message;
  });

  var requests = await Friend.find({ friend: req.user._id, confirmed: false })
  .populate('user friend', '-image -password')
  .exec().then(function (result) {
    return result;
  }).catch(function (err) {
    var error = err.message;
  });

  if (error) {
    res.status(500).json({
      message: message.error + error
    });
  } else {
    res.json({
      own_requests: own_requests,
      requests: requests
    });
  }
};

exports.createRequest = async (req, res) => {
  if (!req.body.friend) return res.status(422).json({message: "Missing friend id in body"});
  if (req.body.friend === req.user._id) return res.status(422).json({message: "You can't add yourself as a friend."});
  var friends = new Friend({user: req.user._id, friend: req.body.friend, confirmed: false});
  friends.save(function (err) {
      if (err) return res.status(500).json({message: message.error + err});
  });
  res.json({message: message.success});
};

exports.createUpdate = async (req, res) => {
  if (params.body.type == 'accept'){
    if (!req.body.friend) return res.status(422).json({message: "missing friend id in body"});
    Friend.findOne({friend1: req.body.friend, friend2: req.user._id, confirmed: false}).exec(function (err, result) {
        if (err) return res.status(500).json({message: "could not find request " + err});
        result.confirmed = true;
        result.save(function (err) {
            if (err) return res.status(500).json({message: message.error + err});
        });
        res.json({message: message.success});
    });
  } else if (params.body.type == 'validate') {
    if (!req.body.friend) return res.status(422).json({message: "missing friend id in body"});
    Friend.findOne({friend1: req.user._id, friend2: req.body.friend, validated: false}).exec(function (err, result) {
        if (err) return res.status(500).json({message: "could not find request " + err});
        if (result != null) {
            result.validated = true;
            result.save(function (err) {
                if (err) return res.status(500).json({message: message.error + err});
            });
            res.json({message: message.success});
        } else {
            res.status(500).json({message: "could not modify request " + err});
        }
    });
  }
};


exports.deleteRequest = async (req, res) => {
  if (params.body.type == 'deny'){
    if (!req.body.friend) return res.status(422).json({message: "missing friend id in body"});
    Friend.deleteOne({friend1: req.body.friend, friend2: req.user._id, confirmed: false}).exec(function (err) {
        if (err) return res.status(500).json({message: "could not find request " + err});
        res.json({message: message.success});
    });
  } else if (params.body.type == 'cancel') {
    if (!req.body.friend) return res.status(422).json({message: "missing friend id in body"});
    Friend.deleteOne({friend2: req.body.friend, friend1: req.user._id, confirmed: false}).exec(function (err) {
        if (err) return res.status(500).json({message: "could not find request " + err});
        res.json({message: message.success});
    });
  }
};
