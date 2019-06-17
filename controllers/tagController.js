const Tag = require('../models/tag');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');

exports.getTag = async(req, res) => {
  var tag = await Tag.getModel(req.params.id)
  return returnData(req.test, tag, res);
};

exports.createTag = async(req, res) => {
  if (!req.body.name) {
    return returnData(req.test, {error: "Could not handle request"}, res);
  } else {
    var savedTag = await Tag.saveModel(new Tag({name: req.body.name}))

    return returnData(req.test, savedTag, res);
  }
};

exports.updateTag = async(req, res) => {
  if (!req.body.name || !req.body.isPrivate) {
    return returnData(req.test, {error: "Could not handle request"}, res);
  } else {
    var tag = await Tag.updateModel(req.params.id, req.body)

    return returnData(req.test, tag, res);
  }
};

exports.deleteTag = async(req, res) => {
  var tag = await Tag.deleteModel(req.params.id)
  return returnData(req.test, tag, res);
};

function returnData (test, data, res) {
  if (test) {
    return data;
  } else if (data.error) {
    return res.status(400).send(data.error);
  } else {
    return res.json(data);
  }
}
