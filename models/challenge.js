const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

const ChallengeSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    task: {
      type: String,
      required: false
    },
    amount: {
      type: Number,
      required: false
    },
    image: {
      type: String,
      required: false
    }

});

ChallengeSchema.statics.saveModel = async (model) => {
  var data = await model.save()
  .then((result) => {
    return result;
  }).catch((err) => {
    return {error: err.message};
  });
  return data;
}

ChallengeSchema.statics.getModel = async (id) => {
  if (id)
    id = {_id: id};
  else
    id = {};

  let data = await ChallengeModel.find(id)
    .exec().then((result) => {
      return result
    }).catch((err) => {
      return {error: err.message};
    });
    if (data.length <= 1) {
      data = data[0]
    } else {
      data = {challenges: data}
    }
  return data;
}

ChallengeSchema.statics.updateModel = async (id, model) => {
  let data = await ChallengeModel.findOneAndUpdate({ _id: id }, model, {new: true})
    .exec().then(function (result) {
      return result;
    }).catch(function (err) {
      return {error: err.message};
    });
  return data;
}

ChallengeSchema.statics.deleteModel = async (id) => {
  var data = await ChallengeModel.findOneAndDelete({_id: id})
  .exec()
  .then(function (result) {
    return result;
  }).catch(function (err) {
    return {error: err.message};
  });
  return data;
}

var ChallengeModel = module.exports = mongoose.model('Challenge', ChallengeSchema);
