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


const FriendModel = mongoose.model('Friend', FriendSchema);

module.exports = FriendModel;
