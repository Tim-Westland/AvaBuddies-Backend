const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Tag = require('../models/tag');
const message = require('../config/errorMessages');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');
const UserCTR = require('../controllers/userController');

router.route('/')
	.get(UserCTR.getUsers);

router.route('/:id')
	.get(UserCTR.getUser)
  .put(UserCTR.updateUser)
  .delete(UserCTR.deleteUser);

router.get('/find/:keyword', (req, res) => {
    var keyword = req.params.keyword;
    User.find({'name': {'$regex': keyword, '$options': 'i'}}).exec(function (err, result) {
        res.json(result);
    })
});

module.exports = router;
