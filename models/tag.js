const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TagSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
      },
    isPrivate: {
      type: Boolean,
      required: true,
      default: true
    }

});

TagSchema.statics.saveModel = async (model) => {
  var data = await model.save()
  .then((result) => {
    return result;
  }).catch((err) => {
    return {error: err.message};
  });
  return data;
}

TagSchema.statics.getModel = async (id) => {
  if (id)
    id = {_id: id};
  else
    id = {};

  let data = await TagModel.find(id)
    .exec().then((result) => {
      return result
    }).catch((err) => {
      return {error: err.message};
    });
    if (data.length <= 1) {
      data = data[0]
    } else {
      data = {tags: data}
    }
  return data;
}


TagSchema.statics.updateModel = async (id, model) => {
  let data = await TagModel.updateOne({ _id: id }, model)
    .exec().then(function (result) {
      return result;
    }).catch(function (err) {
      return {error: err.message};
    });
  return data;
}

TagSchema.statics.deleteModel = async (id) => {
  var data = await TagModel.deleteOne({_id: id})
  .exec()
  .then(function (result) {
    return result;
  }).catch(function (err) {
    return {error: err.message};
  });
  return data;
}

var TagModel = module.exports = mongoose.model('Tag', TagSchema);
