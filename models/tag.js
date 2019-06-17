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


const TagModel = mongoose.model('Tag', TagSchema);

module.exports = TagModel;
