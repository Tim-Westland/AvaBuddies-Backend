const ChatMessage = require('../models/chatMessage');
const Chat = require('../models/chat');

var listeningChats = [];
var sockIo; //avoid using if possible, todo: delete if possible...

exports.initialize = function (io) {
    sockIo = io;
};

exports.listen = function (socket) {
    socket.on('user online', userOnline);
};

function userOnline(userId) {
    let socket = this;
    console.log('user online with userId: ' + userId + ' with socket ' + socket.id  );

    Chat.find({$or: [{user1: userId}, {user2: userId}]}).exec(function (err, chats) {
        chats.forEach(function (item) {

            socket.join(item._id.toString());

            if (listeningChats.some(e => e.chat._id.toString() === item._id.toString() &&e.userId === userId)) {
                console.log("Already listening. removing old");
                socket.removeListener(item._id, messageReceived);
            }

            socket.on(item._id, messageReceived);
            console.log(item._id.toString());
            listeningChats.push({
                userId: userId,
                chat: item
            });

        });
    });
}

//todo ack, retry delivery
function messageReceived(messageJSON) {
    let socket = this;
    let message = JSON.parse(messageJSON);
    socket.in(message.chatId.toString()).emit(message.chatId.toString(), messageJSON)
}