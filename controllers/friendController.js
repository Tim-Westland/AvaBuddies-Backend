const Friend = require('../models/friend');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');


exports.getRequests = async (req, res) => {
  Friend.find({$or: [{user: req.user._id}, {friend: req.user._id}]}).exec(function (err, connections) {
        if (err) return res.status(500).json({message: message.error + err});
        res.json({connections: connections});
    });
};

exports.getRequest = async (req, res) => {
  var error;
  if (req.user._id != req.params.id) return res.status(422).json({error: "You don't have permission to view these friend requests"});

  var own_requests = await Friend.find({ user: req.params.id, confirmed: false })
  .populate('user friend', '-image -password')
  .exec().then(function (result) {
    return result;
  }).catch(function (err) {
    var error = err.message;
  });

  var requests = await Friend.find({ friend: req.params.id, confirmed: false })
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
  if (req.params.id === req.user._id) return res.status(422).json({message: "You can't add yourself as a friend."});

  Friend.create({user: req.user._id, friend: req.params.id}, function (err, tag) {
    if (err) return res.status(500).json({message: message.error + err});
    res.json({message: message.success});
  });
};

exports.updateRequest = async (req, res) => {
  if (req.body.type == 'accept'){
    Friend.findOne({friend: req.params.id, user: req.user._id, confirmed: false, validated: true}).exec(function (err, result) {
        if (!result) return res.status(500).json({error: "Could not find request."});
        result.confirmed = true;
        result.save(function (err) {
            if (err) return res.status(500).json({message: message.error + err});
        });
        res.json({message: message.success});
    });
  } else if (req.body.type == 'validate') {
    Friend.findOne({user: req.user._id, friend: req.params.id, validated: false}).exec(function (err, result) {
        if (!result) return res.status(500).json({error: "Could not find request."});
        if (result != null) {
            result.validated = true;
            result.save(function (err) {
                if (err) return res.status(500).json({message: message.error + err});
            });
            res.json({message: message.success});
        } else {
            res.status(500).json({message: "Could not modify request."});
        }
    });
  }
};


exports.deleteRequest = async (req, res) => {
  if (req.body.type == 'deny'){
    Friend.deleteOne({friend: req.user._id, user: req.params.id, confirmed: false}).exec(function (err) {
        if (err) return res.status(500).json({message: "could not find request " + err});
        res.json({message: message.success});
    });
  } else if (req.body.type == 'cancel') {
    Friend.deleteOne({friend: req.params.id, user: req.user._id, confirmed: false}).exec(function (err) {
        if (err) return res.status(500).json({message: "could not find request " + err});
        res.json({message: message.success});
    });
  }
};
