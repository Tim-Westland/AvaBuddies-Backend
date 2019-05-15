const Tag = require('../models/tag');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');


exports.getTags = async(req, res) => {
  const tags = await Tag.find().exec()
  .then(function (result) {
    return result;
  }).catch(function (err) {
      return err.message;
  });

  return returnData(req.test, tag = {tags}, res);
};

exports.getTag = async(req, res) => {
  var tag = await Tag.findOne({_id: req.params.id})
  .exec()
  .then(function (result) {
    return result;
  }).catch(function (err) {
      return err.message;
  });
  return returnData(req.test, tag, res);
};

exports.createTag = async(req, res) => {
  var tag = new Tag({name: req.body.name})
  var savedTag = await tag.save()
  .then((result) => {
    return result;
  }).catch((err) => {
      return err.message;;
  });
  return returnData(req.test, tag, res);
};

exports.updateTag = async(req, res) => {
  var tag = await Tag.updateOne({ _id: req.params.id }, {name: req.body.name, isPrivate: req.body.isPrivate})
  .exec()
  .then(function (result) {
    return result;
  }).catch(function (err) {
      return err.message;
  });
  return returnData(req.test, tag, res);
};

exports.deleteTag = async(req, res) => {
  var tag = await Tag.deleteOne({_id: req.params.id})
  .exec()
  .then(function (result) {
    return result;
  }).catch(function (err) {
      return err.message;
  });
  return returnData(req.test, tag, res);
};

function returnData (test, data, res) {
  if (test) {
    return data
  } else {
    return res.json(data)
  }
}
