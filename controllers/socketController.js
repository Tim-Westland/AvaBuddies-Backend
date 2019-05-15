const chatMessageController = require('./chatMessageController');

exports.initialize = function () {

}

exports.connect = function (socket, io) {
    console.log('Socket connected to socketController '+socket.id);
    socket.on('disconnect', disconnect);
    chatMessageController.listen(socket, io);

};

function disconnect() {
    console.log('Socket disconnected from socketController');
}