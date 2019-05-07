const Tag = require('../models/tag');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');


exports.getTags = (req, res) => {
  Tag.find().exec(function (err, result) {
      if (err) return res.json({message: message.error + err});
      res.json({
          tag: result
      });
  })
};

exports.createTag = (req, res) => {
  Tag.create({ name: req.body.tag }, function (err, tag) {
    if (err) return handleError(err);
    res.send(tag)
  });
};

exports.getTag = (req, res) => {
  Tag.find({_id: req.params.id}).exec(function (err, result) {
      if (err) return res.json({message: message.error + err});
      res.json({
          tags: result
      });
  })
};

exports.updateTag = (req, res) => {
  Tag.updateOne({ _id: req.params.id }, req.body)
  .exec(function(err, result) {
    res.json({
      tag: result
    });
  })
};

exports.deleteTag = (req, res) => {
  Tag.deleteOne({_id: req.params.id})
  .exec(done);
};
