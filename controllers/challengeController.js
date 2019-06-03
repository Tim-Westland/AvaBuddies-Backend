const Challange = require('../models/challenge');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');


exports.getChallenges = async(req, res) => {
  var error;
  const challenges = await Challange.find().exec()
  .then(function (result) {
    return result;
  }).catch(function (err) {
      var error = err.message;
      return err;
  });

  if (!challenges || error) {
    return returnData(req.test, {error: 'Something went wrong'}, res, 400);
  } else {
    return returnData(req.test, {challenges: challenges}, res);
  }
};

exports.getChallenge = async(req, res) => {
  var error;
  var challenge = await Challange.findOne({_id: req.params.id})
  .exec()
  .then(function (result) {
    return result;
  }).catch(function (err) {
      var error = err.message;
      return err;
  });

  if (!challenge || error) {
    return returnData(req.test, {error: 'Something went wrong'}, res, 400);
  } else {
    return returnData(req.test, challenge, res);
  }
};

exports.createChallenge = async(req, res) => {
  var error;
  var challenge = new Challange( req.body )
  var savedChallenge = await challenge.save()
  .then((result) => {
    return result;
  }).catch((err) => {
      var error = err.message;
      return err;
  });

  if (!challenge || error) {
    return returnData(req.test, {error: 'Something went wrong'}, res, 400);
  } else {
    return returnData(req.test, challenge, res);
  }
};

exports.updateChallenge = async(req, res) => {
  var error;
  var challenge = await Challange.findOneAndUpdate({ _id: req.params.id }, req.body, {new: true})
  .exec().then(function(result) {
    return result;
  }).catch(function(err) {
    var error = err.message;
    return err;
  });

  if (!challenge || error) {
    return returnData(req.test, {error: 'Something went wrong'}, res, 400);
  } else {
    return returnData(req.test, challenge, res);
  }
};

exports.deleteChallenge = async(req, res) => {
  var error;
  var challenge = await Challange.findOneAndDelete({ _id: req.params.id })
  .exec().then(function(result) {
    return result;
  }).catch(function(err) {
    var error = err.message;
    return err;
  });

  if (!challenge || error) {
    return returnData(req.test, {error: 'Something went wrong'}, res, 400);
  } else {
    return returnData(req.test, challenge, res);
  }
};

function returnData (test, data, res, error) {
  error = error || 0;
  if (test) {
    return data;
  } else {
    switch(error) {
      case 400:
        return res.status(400).send(data);
        break;
      default:
        return res.json(data);
    }
  }
}
