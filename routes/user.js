const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Tag = require('../models/tag');
const message = require('../config/errorMessages');
const mongoose = require('mongoose');


router.get('/profile', (req, res, next) => {
    User.findOne({
        _id: req.user._id
    })
    .populate('tags')
    .select('-password')
    .exec(function (err, result) {
        res.json({
            user: result,
        })
    })
});

router.post('updateuser', (req, res) => {
    var fields = {}
    if (req.body.name) {
      fields.name = req.body.name
    }
    if (req.body.aboutme) {
      fields.aboutme = req.body.aboutme
    }
    if (req.body.sharelocation) {
      fields.sharelocation = req.body.sharelocation
    }
    if (req.body.isAdmin) {
      fields.isAdmin = req.body.isAdmin
    }
    if (req.body.isPrivate) {
      fields.isPrivate = req.body.isPrivate
    }
    if (req.body.sharelocation) {
      fields.sharelocation = req.body.sharelocation
    }
    if (req.body.image) {
      fields.image = req.body.image
    }


    if (req.user.isAdmin) {
        User.updateOne({_id: req.body.id},
            fields).exec(function (err, result) {
            res.json({message: message.success});
        })
    } else {
        res.json({message: message.noAdmin});
    }
});

router.post('/updateprofile', (req, res) => {

    tags = [];
    for (const [key, value] of Object.entries(req.body.tags)) {
      tags.push({_id: mongoose.Types.ObjectId(value)});
    }


    User.updateOne({_id: req.user._id},
        {
            aboutme: req.body.aboutme,
            sharelocation: req.body.sharelocation,
            tags: tags
        }).exec(function (err, result) {
        res.json({message: message.success});
    })


});

router.post('/updateprofilepicture', (req, res) => {
    User.updateOne({_id: req.user._id}, {image: req.body.image})
        .exec(function (err, result) {
            if (err) return res.json({message: message.error + err});
            res.json({message: message.success});
        })
});

router.get('/list', (req, res) => {
    User.find()
    .populate('tags')
    .select('-password')
    .exec(function (err, result) {
        if (err) return res.json({message: message.error + err});
        console.log(err);
        res.json({
            users: result
        });
    })
});

router.delete('/destroy/:id', (req, res) => {
    var id = req.params.id;
    if (id === req.user._id) {
        User.deleteOne({
            _id: req.user._id
        }).exec(function (err) {
            if (err) return res.json({message: message.error + err});
            res.json({message: message.success});
        });

    } else if (req.user.isAdmin) {
        User.deleteOne({
            _id: req.params.id
        }).exec(function (err) {
            if (err) return res.json({message: message.error + err});
            res.json({message: message.success});
        });
    } else {
        res.json({message: message.unauthorized});
    }
});

router.get('/find/:keyword', (req, res) => {
    var keyword = req.params.keyword;
    User.find({'name': {'$regex': keyword, '$options': 'i'}}).exec(function (err, result) {
        res.json(result);
    })
});

router.post('/switchrole', (req, res, next) => {
    if (req.user.isAdmin) {
        User.findOne({
            _id: req.body.id
        }).// select('_id title').
        exec(function (err, user) {
            user.isAdmin = !user.isAdmin;
            user.save();
            res.json({message: message.success});
        })
    } else {
        res.status(401).json({message: message.noAdmin});
    }

});


router.get("/:id", (req, res, next) => {
    User.findOne({_id: req.params.id})
    .populate('tags')
    .select('-password')
    .exec(function (err, result) {
        if (err) return res.status(500).json({message: "could not find user."});

        var info = result;
        delete info.password;
        delete info.isAdmin;
        res.json({user: info});
    })
});

module.exports = router;
