const User = require('../models/user');
const Tag = require('../models/tag');
const message = require('../config/errorMessages');
const mongoose = require('mongoose');
const handleError = require('../modules/handleError');
const express = require('express');



exports.getUser = async(req, res) => {
  if (req.params.id == "profile") {
    userId = req.user._id
  } else {
    userId = req.params.id
  }

  const user = await User.findOne({ _id: userId })
    .populate('tags')
    .select('-password')
    .exec()
    .then(function (result) {
      return result;
    }).catch(function (err) {
        return err.message;
    });
    return returnData(req.test, user, res);
};

exports.getUsers = async(req, res) => {
  query = {};
  if (req.query.name) {
    query = {'name': {'$regex': req.query.name, '$options': 'i'}}
  }
  else if (req.query.tags) {
    var tagIds = await findTags(req.query.tags);
    query = {tags: {$in: tagIds}}
  }
  const user = await User.find(query)
  .populate('tags')
  .select('-password')
  .exec().then(function (result) {
    return result
  }).catch(function (err) {
      return err.message;
  });
  return returnData(req.test, user, res);

};

exports.updateUser = async(req, res) => {
  if (req.params.id == 'profile') {
    userId = req.user._id
  } else {
    userId = req.params.id
  }
  if (req.body.email) { delete req.body.email }
  if (req.body.isAdmin && (userId == req.user._id || !req.user.isAdmin)) { delete req.body.isAdmin }
  if (req.body.sharelocation && req.user.isAdmin) { delete req.body.sharelocation }
  if (req.body.password) { delete req.body.password }

  if (req.body.tags) {
    tags = [];
    for (const [key, value] of Object.entries(req.body.tags)) {
      tags.push({ _id: mongoose.Types.ObjectId(value) });
    }
    req.body.tags = tags;
  }

  const user = await User.updateOne({ _id: userId }, req.body)
  .exec()
  .then(function (result) {
    return result;
  }).catch(function (err) {
      return err.message;
  });
  return returnData(req.test, user, res);
};

exports.deleteUser = async(req, res) => {
  if (req.params.id == 'profile') {
    userId = req.user._id
  } else {
    userId = req.params.id
  }

  if (req.user.isAdmin && userId == req.user._id) {
    console.log('cannot delete yourself as an admin');
  } else if (!req.user.isAdmin && userId != req.user._id) {
    console.log('cannot delete others');
  } else {
    var user = await User.deleteOne({ _id: userId })
    .exec()
    .then(function (result) {
      return result;
    }).catch(function (err) {
        return err.message;
    });
    return returnData(req.test, user, res);
  }
};

async function findTags (query, cb) {
  var query = query.split(",");
  var tagIds = [];
  var tags = [];

  query.forEach(function(item){
    tags.push(  new RegExp(item, "i") );
  });

  return await Tag.find({name: {$in: tags }, isPrivate: false})
  .select('_id')
  .exec().then(function (result) {
    result.forEach(function(item) {
      tagIds.push(item._id)
    })
    return tagIds;
  }).catch(function (err) {
      return err.message;
  });
}

function returnData (test, data, res) {
  if (test) {
    return data
  } else {
    return res.json(data)
  }
}
