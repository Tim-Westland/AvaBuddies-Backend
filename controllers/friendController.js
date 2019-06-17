const Friend = require('../models/friend');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');
const response = require('../modules/response');


exports.getRequests = async (req, res) => {
  var own_requests = await Friend.getModel({$or: [{ user: req.user._id }, { friend: req.user._id }]})

  return response.data(req.test, own_requests, res);

};

exports.getRequest = async (req, res) => {
  var error;
  if (req.user._id != req.params.id) {
    return response.data(req.test, {error: "You don't have permission to view these friend requests."}, res);
  }

  var own_requests = await Friend.getModel({user: req.user._id, confirmed: false})
  var requests = await Friend.getModel({friend: req.params.id, confirmed: false })

  if (own_requests.error) {
    data = own_requests.error
  } else if(requests.error) {
    data = requests.error;
  } else {
    data = {own_requests: own_requests, requests: requests}
  }

  return response.data(req.test, data, res);
};

exports.createRequest = async (req, res) => {
  if (req.body.id === req.user._id) {
    return response.data(req.test, {error: 'Cannot add youself as a friend.'}, res);
  } else if (!req.body.id){
    return response.data(req.test, {error: 'Could not handle request.'}, res);
  }

  var friend = new Friend({ user: req.user._id, friend: req.body.id })
  var savedFriend = await Friend.saveModel(friend)

  return response.data(req.test, savedFriend, res);
};

exports.updateRequest = async(req, res) => {
  if (!req.body.type){
    return response.data(req.test, {error: 'Could not handle request.'}, res);
  } else if (req.body.type == 'accept') {
    var friend = await Friend.updateModel({ friend: req.user._id, user: req.params.id, confirmed: false, validated: true},
      {confirmed: true});

    if (!friend) {
      return response.data(req.test, {error: 'Could not find request'}, res);
    } else {
      return response.data(req.test, friend, res);
    }

    return response.data(req.test, friend, res);

  } else if (req.body.type == 'validate') {
    var friend = await Friend.updateModel({ user: req.user._id, friend: req.params.id, validated: false},
      {validated: true});

    if (!friend) {
      return response.data(req.test, {error: 'Could not find request'}, res);
    } else {
      return response.data(req.test, friend, res);
    }
  }
};


exports.deleteRequest = async(req, res) => {
  var friend = await Friend.deleteModel({
    $or: [
      { user: req.user._id, friend:req.params.id},
      { user: req.params.id, friend: req.user._id }
    ]
  })

  return response.data(req.test, friend, res);
};
