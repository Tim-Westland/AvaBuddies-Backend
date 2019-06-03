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


const ChallengeModel = mongoose.model('Challange', ChallengeSchema);

module.exports = ChallengeModel;
