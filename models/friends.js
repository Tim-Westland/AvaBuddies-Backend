const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

const FriendSchema = new Schema({
    friend1: {
        type: ObjectId,
        required: true
    },
    friend2: {
        type: ObjectId,
        required: true
    },
    confirmed: {
        type:Boolean,
        required: true,
        default: false
    }

});


const FriendModel = mongoose.model('Friend', FriendSchema);

module.exports = FriendModel;
