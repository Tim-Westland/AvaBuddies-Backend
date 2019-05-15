const ChatMessage = require('../models/chatMessage');
const Chat = require('../models/chat');

var listeningChats = [];
var sockIo; //avoid using if possible, todo: delete if possible...

exports.listen = function (socket, io) {
    sockIo = io;

    socket.on('user online', (userId) => {userOnline(userId, socket)});
};

function userOnline(userId, socket) {
 console.log('user online with userId: ' + userId + ' with socket ' + socket.id  );

    Chat.find({$or: [{user1: userId}, {user2: userId}]}).exec(function (err, chats) {
        chats.forEach(function (item) {
            //if (!listenteningChats.some(e => e.chat._id.toString() === item._id.toString())) {
            socket.join(item._id.toString());
            socket.on(item._id, (message) => {messageReceived(message, socket)});
            console.log(item._id.toString());
            listeningChats.push({
                socket: socket,
                chat: item
            });
           // }
        });
    });
}

function messageReceived(messageJSON, socket) {
    let message = JSON.parse(messageJSON);
    socket.in(message.chatId.toString()).emit(message.chatId.toString(), messageJSON)
}