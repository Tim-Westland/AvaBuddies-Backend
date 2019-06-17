const Chat = require('../models/chat');


exports.getRequests = async (req, res) => {
    var chats = await Chat.find({$or: [{user1: req.user._id}, {user2: req.user._id}]}).populate('user1 user2', '-isAdmin -tags -aboutme -isPrivate -password')
        .exec().then( (result) => {
        return result;
    });
    return returnData(req.test, {chats: chats}, res);
};

exports.createRequest = async (req, res) => {
    if (req.params.id === req.user._id) return returnData(req.test, {error: 'You can\'t add yourself as a chat.'}, res, 422);

    var chat = new Chat({user1: req.user._id, user2: req.params.id});
    await chat.save();
    return returnData(req.test, chat, res);
};

exports.deleteRequest = async (req, res) => {
    var chat = await Chat.findOneAndDelete({_id: req.params.id})
        .exec().then(function(result) {
        return result;
    });
    return returnData(req.test, chat, res);

};

function returnData (test, data, res, error) {
    error = error || false;
    if (test) {
        return data;
    } else if (error) {
        switch(error) {
            case 422:
                return res.status(422).send(data);
                break;
            case 500:
                return res.status(500).send(data);
                break;
            default:
                return res.status(494).send(data);
        }
    } else {
        return res.json(data);
    }
}
