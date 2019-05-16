const ChatMessage = require('../models/chatMessage');
const Chat = require('../models/chat');

var listeningChats = [];

exports.listen = function (socket) {
    socket.on('user online', userOnline);
};

function userOnline(userId) {
    let socket = this;
    console.log('user online with userId: ' + userId + ' with socket ' + socket.id  );
    socket.on('messageAcked', messageAcked);
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

            ChatMessage.find( { $and: [{chatId: item._id.toString()}, {senderId: { $ne: userId} }] } ).exec(function (err, messages) {
                console.log(messages.length + " messages waiting for " + userId);
                messages.forEach(function (message) {
                        console.log(message.chatId.toString());
                    socket.emit(message.chatId.toString(), JSON.stringify(message));
                });
            });

        });
    });
}

function messageReceived(messageJSON) {
    let socket = this;
    let message = JSON.parse(messageJSON);
    ChatMessage.create({
        id: message.id,
        chatId: message.chatId,
        senderId: message.senderId,
        message: message.message,
        dateTime: message.dateTime
    });

    socket.in(message.chatId.toString()).emit(message.chatId.toString(), messageJSON)
}

function messageAcked(messageId) {
    console.log('Acked ' + messageId);
    ChatMessage.deleteOne({id: messageId}).exec(function (err) {
        if (err) console.log("error deleting message " + err);
        else console.log("Message " + messageId + " deleted");
    });
}