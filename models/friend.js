const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

const FriendSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    friend: { type: Schema.Types.ObjectId, ref: 'User' },
    confirmed: {
        type: Boolean,
        required: true,
        default: false
    },
    validated: {
        type: Boolean,
        required: true,
        default: false
    }

});


FriendSchema.statics.saveModel = async (model) => {
  var data = await model.save()
  .then((result) => {
    return result;
  }).catch((err) => {
    return {error: err.message};
  });
  return data;
}

FriendSchema.statics.getModel = async (query) => {
  let data = await FriendModel.find(query)
  .exec().then(function(result) {
    return result;
  }).catch(function(err) {
    return {error: err.message};
  });
  return data;
}


FriendSchema.statics.updateModel = async (query, model) => {
  let data = await FriendModel.findOneAndUpdate(query, model, {new: true})
    .exec().then(function (result) {
      return result;
    }).catch(function (err) {
      return {error: err.message};
    });
  return data;
}

FriendSchema.statics.deleteModel = async (query) => {
  var data = await FriendModel.deleteOne(query)
  .exec()
  .then(function (result) {
    return result;
  }).catch(function (err) {
    return {error: err.message};
  });
  return data;
}

var FriendModel = module.exports = mongoose.model('Friend', FriendSchema);
