const Tag = require('../models/tag');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');


exports.getTags = async(req, res) => {
  const tags = await Tag.getTags()

  return returnData(req.test, tag = {tags}, res);
};

exports.getTag = async(req, res) => {
  if (!req.params.id) {
    return returnData(req.test, false, res);
  } else {
    var tag = await Tag.getTag(req.params.id)

    return returnData(req.test, tag, res);
  }
};

exports.createTag = async(req, res) => {
  if (!req.body.name) {
    return returnData(req.test, false, res);
  } else {
    var tag = new Tag({name: req.body.name})
    var savedTag = await Tag.saveTag(tag)

    return returnData(req.test, savedTag, res);
  }

  return returnData(req.test, tag, res);
};

exports.updateTag = async(req, res) => {
  if (!req.params.id || !req.body.name || !req.body.isPrivate) {
    return returnData(req.test, false, res);
  } else {
    var tag = await Tag.updateTag(req.params.id, req.body.name, req.body.isPrivate)

    return returnData(req.test, tag, res);
  }
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
    return data;
  } else if (!data) {
    return res.status(400).send("Could not handle request.");
  } else {
    return res.json(data);
  }
}
