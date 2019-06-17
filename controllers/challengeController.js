const Challenge = require('../models/challenge');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');
const response = require('../modules/response');

exports.getChallenge = async(req, res) => {
  var challenge = await Challenge.getModel(req.params.id)
  return response.data(req.test, challenge, res);
};

exports.createChallenge = async(req, res) => {
  if (!req.body.title || !req.body.description || !req.body.task || !req.body.amount) {
    return response.data(req.test, {error: "Could not handle request"}, res);
  } else {
    var savedTag = await Challenge.saveModel(new Challenge(req.body))

    return response.data(req.test, savedTag, res);
  }
};

exports.updateChallenge = async(req, res) => {
  if (!req.body.title, !req.body.description, !req.body.task, !req.body.amount) {
    return response.data(req.test, {error: "Could not handle request"}, res);
  } else {
    var tag = await Challenge.updateModel(req.params.id, req.body)

    return response.data(req.test, tag, res);
  }
};

exports.deleteChallenge = async(req, res) => {
  var tag = await Challenge.deleteModel(req.params.id)
  return response.data(req.test, tag, res);
};
