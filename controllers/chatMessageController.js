const ChatMessage = require('../models/chatMessage');
const Chat = require('../models/chat');

exports.listen = function (socket) {
    socket.on('user online', userOnline);
    Chat.find({}).exec(function (err, chats) {
        chats.forEach(function (item) {
            socket.on(item._id, messageReceved);
        });
    });
};

function userOnline(userId) {
 console.log('user online with userId: ' + userId);
}

function messageReceved(message) {
    console.log('Message receved: ' + message);

}