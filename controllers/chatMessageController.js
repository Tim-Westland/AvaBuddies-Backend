const ChatMessage = require('../models/chatMessage');

exports.connect = function (socket) {
    console.log('a user connected new '+socket.id);


};
