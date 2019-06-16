const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TagSchema = new Schema({
    name: {
        type: String,
        required: true
      },
    isPrivate: {
      type: Boolean,
      required: true,
      default: true
    }

});


TagSchema.statics.getTags = async () => {
  let tag = await TagModel.find({})
    .exec().then((result) => {
      return result
    }).catch((err) => {
      console.log(err.message);
      return;
    });
  return tag;
}

TagSchema.statics.getTag = async (id) => {
  let tag = await TagModel.findOne({_id: id})
    .exec().then((result) => {
      return result
    }).catch((err) => {
      console.log(err.message);
      return;
    });
  return tag;
}

TagSchema.statics.updateTag = async (id, name, isPrivate) => {
  let tag = await TagModel.updateOne({ _id: id }, {name: name, isPrivate: isPrivate})
    .exec().then(function (result) {
      return result;
    }).catch(function (err) {
      console.log(err.message);
      return;
    });
  return tag;
}

TagSchema.statics.saveTag = async (tag) => {
  var newTag = await tag.save()
  .then((result) => {
    return result;
  }).catch((err) => {
    console.log(err.message);
    return;
  });
  return newTag;
}
var TagModel = module.exports = mongoose.model('Tag', TagSchema);
