const User = require('../models/user');
const Tag = require('../models/tag');
const message = require('../config/errorMessages');
const mongoose = require('mongoose');
const handleError = require('../modules/handleError');
const express = require('express');



exports.getUser = (req, res) => {
  if (req.params.id = "profile") {
    userId = req.user._id
  } else {
    userId = req.params.id
  }

  User.findOne({ _id: userId })
    .populate('tags')
    .select('-password')
    .exec().then(function(result) {
      res.json({
        user: result,
      })
    }).catch(function(err) {
      if (err) {
        res.status(500).send({ error: "could not find user." });
      }
    });
};

exports.getUsers = async(req, res) => {
  query = {};
  if (req.query.name) {
    query = {'name': {'$regex': req.query.name, '$options': 'i'}}
  }
  else if (req.query.tags) {
    var tagIds = await findTags(req.query.tags);
    query = {'tags': {$in: tagIds}}
  }
  User.find(query)
  .populate('tags')
  .select('-password')
  .exec().then(function (result) {
    res.json({
      users: result
    })
  }).catch(function (err) {
      return err.message;
  });
};

exports.updateUser = (req, res) => {
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

  User.updateOne({ _id: req.user._id }, req.body)
  .exec(function(err, result) {
    res.json({
      message: message.success
    });
  })
};

exports.deleteUser = (req, res) => {
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
    User.deleteOne({
        _id: userId
    }).exec(function (err) {
        if (err) return res.json({message: message.error + err});
        res.json({message: message.success});
    });
  }
};

async function findTags (query, cb) {
  var query = query.split(",");
  var tagIds = [];
  var tags = [];

  query.forEach(function(item){
    tags.push(  new RegExp(item, "i") );
  });

  return await Tag.find({name: {$in: tags }})
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
