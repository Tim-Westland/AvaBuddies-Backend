const Chat = require('../models/chat');


exports.getRequests = async (req, res) => {
    Chat.find({$or: [{user1: req.user._id}, {user2: req.user._id}]}).populate('user1 user2', '-isAdmin -tags -aboutme -isPrivate -password').exec(function (err, chats) {
        if (err) return res.status(500).json({message: message.error + err});
        res.json({chats: chats});
    });
};

exports.createRequest = async (req, res) => {
    if (req.params.id === req.user._id) return res.status(422).json({message: "You can't add yourself as a chat."});
    Chat.create({user1: req.user._id, user2: req.params.id}, function (err, tag) {
        if (err) return res.status(500).json({message: message.error + err});
        res.json({message: message.success});
    });
};

exports.deleteRequest = async (req, res) => {
    Chat.deleteOne({_id: req.params.id}).exec(function (err) {
        if (err) return res.status(500).json({message: "could not find chat " + err});
        res.json({message: message.success});
    });
};
