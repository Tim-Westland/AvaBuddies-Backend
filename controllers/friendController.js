const Friend = require('../models/friend');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');


exports.getRequests = async (req, res) => {
  Friend.find({
    $or: [{
      user: req.user._id
    }, {
      friend: req.user._id
    }]
  }).exec(function(err, friends) {
    if (err) return res.status(500).json({
      message: message.error + err
    });
    res.json({
      friends: friends
    });
  });
};

exports.getRequest = async (req, res) => {
  var error;
  if (req.user._id != req.params.id) {
    return returnData(req.test, {error: "You don't have permission to view these friend requests"}, res, 422);
  }

  var own_requests = await Friend.find({
      user: req.user._id,
      confirmed: false
    })
    .exec().then(function(result) {
      return result;
    }).catch(function(err) {
      var error = err.message;
    });

  var requests = await Friend.find({
      friend: req.params.id,
      confirmed: false
    })
    .exec().then(function(result) {
      return result;
    }).catch(function(err) {
      var error = err.message;
    });
  if (error) {
    return returnData(req.test, message.error + error, res, 500);
  } else {
    return returnData(req.test, {own_requests: own_requests, requests: requests}, res);
  }
};

exports.createRequest = async (req, res) => {
  if (req.body.id === req.user._id) {
    return returnData(req.test, {error: 'Can not add youself as friend'}, res, 422);
  }

  var friend = new Friend({ user: req.user._id, friend: req.body.id })
  var savedFriend = await friend.save()
  .then((result) => {
    return result;
  }).catch((err) => {
      return err.message;;
  });
  return returnData(req.test, friend, res);
};

exports.updateRequest = async(req, res) => {
  if (req.body.type == 'accept') {
    var friend = await Friend.findOneAndUpdate({ friend: req.user._id, user: req.params.id, confirmed: false, validated: true},
      {confirmed: true}, {new: true})
    .exec().then(function(result) {
      return result;
    }).catch(function(err) {
      var error = err.message;
    });

    if (!friend) {
      return returnData(req.test, {error: 'Could not find request'}, res, 500);
    } else {
      return returnData(req.test, friend, res);
    }

  } else if (req.body.type == 'validate') {
    var friend = await Friend.findOneAndUpdate({ user: req.user._id, friend: req.params.id, validated: false},
      {validated: true}, {new: true})
    .exec().then(function(result) {
      return result;
    }).catch(function(err) {
      var error = err.message;
    });

    if (!friend) {
      return returnData(req.test, {error: 'Could not find request'}, res, 500);
    } else {
      return returnData(req.test, friend, res);
    }
  }
};


exports.deleteRequest = async(req, res) => {
  var error = null;
    var friend = await Friend.findOneAndDelete({
      $or: [{
        user: req.user._id,
        friend:req.params.id
      }, {
        user: req.params.id,
        friend: req.user._id
      }]
    }).exec().then(function(result) {
      return result;
    }).catch(function(err) {
      var error = err.message;
    });

    if (!friend || error) {
      return returnData(req.test, {error: 'Could not delete request'}, res, 500);
    } else {
      return returnData(req.test, friend, res);
    }
};

function returnData (test, data, res, error) {
  error = error || false;
  if (test) {
    return data;
  } else if (error) {
    switch(error) {
      case 422:
        return res.status(422).send(data);
        break;
      case 500:
        return res.status(500).send(data);
        break;
      default:
        return res.status(494).send(data);
    }
  } else {
    return res.json(data);
  }
}
