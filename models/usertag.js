const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserTagSchema = new Schema({
    tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }

});


const UserTagModel = mongoose.model('UserTag', UserTagSchema);

module.exports = UserTagModel;
