const Tag = require('../models/tag');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');
const response = require('../modules/response');

exports.getTag = async(req, res) => {
  var tag = await Tag.getModel(req.params.id)
  return response.data(req.test, tag, res);
};

exports.createTag = async(req, res) => {
  if (!req.body.name) {
    return response.data(req.test, {error: "Could not handle request"}, res);
  } else {
    var savedTag = await Tag.saveModel(new Tag({name: req.body.name}))

    return response.data(req.test, savedTag, res);
  }
};

exports.updateTag = async(req, res) => {
  if (!req.body.name || !req.body.isPrivate) {
    return response.data(req.test, {error: "Could not handle request"}, res);
  } else {
    var tag = await Tag.updateModel(req.params.id, req.body)

    return response.data(req.test, tag, res);
  }
};

exports.deleteTag = async(req, res) => {
  var tag = await Tag.deleteModel(req.params.id)
  return response.data(req.test, tag, res);
};
