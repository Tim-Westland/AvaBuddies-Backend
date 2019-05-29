const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatMessageSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    chatId: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    }
}, {collection: 'chatmessagequeue'});


const ChatMessageModel = mongoose.model('ChatMessageQueue', ChatMessageSchema);

module.exports = ChatMessageModel;