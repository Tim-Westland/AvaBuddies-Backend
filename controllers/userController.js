const User = require('../models/user');
const Tag = require('../models/tag');
const message = require('../config/errorMessages');
const mongoose = require('mongoose');
const handleError = require('../modules/handleError');
const express = require('express');



var UserController = {
  getUser(req, res) {
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
  },

  getUsers(req, res) {
    User.find()
      .populate('tags')
      .select('-password')
      .exec(function(err, result) {
        if (err) return res.json({
          message: message.error + err
        });
        console.log(err);
        res.json({
          users: result
        });
      })
  },

  updateUser(req, res) {
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
      req.body.tags = tags
    }

    User.updateOne({ _id: req.user._id }, req.body)
    .exec(function(err, result) {
      res.json({
        message: message.success
      });
    })
  },

  deleteUser(req, res) {
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

    console.log(userId);

      User.deleteOne({
          _id: userId
      }).exec(function (err) {
          if (err) return res.json({message: message.error + err});
          res.json({message: message.success});
      });
    }
  }
};


module.exports = UserController;
