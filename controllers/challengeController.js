const Challenge = require('../models/challenge');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');

exports.getChallenge = async(req, res) => {
  var challenge = await Challenge.getModel(req.params.id)
  return returnData(req.test, challenge, res);
};

exports.createChallenge = async(req, res) => {
  if (!req.body.title || !req.body.description || !req.body.task || !req.body.amount) {
    return returnData(req.test, {error: "Could not handle request"}, res);
  } else {
    var savedTag = await Challenge.saveModel(new Challenge(req.body))

    return returnData(req.test, savedTag, res);
  }
};

exports.updateChallenge = async(req, res) => {
  if (!req.body.title, !req.body.description, !req.body.task, !req.body.amount) {
    return returnData(req.test, {error: "Could not handle request"}, res);
  } else {
    var tag = await Challenge.updateModel(req.params.id, req.body)

    return returnData(req.test, tag, res);
  }
};

exports.deleteChallenge = async(req, res) => {
  var tag = await Challenge.deleteModel(req.params.id)
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
