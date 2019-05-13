const chatMessageController = require('./chatMessageController');

exports.connect = function (socket) {
    console.log('Socket connected to socketController '+socket.id);
    socket.on('disconnect', disconnect);

    chatMessageController.listen(socket);

};

function disconnect() {
    console.log('Socket disconnected from socketController');
}