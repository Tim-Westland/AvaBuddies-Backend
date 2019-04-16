const express = require('express');
const router = express.Router();
const Tag = require('../models/tag');
const UserTag = require('../models/usertag')
const mongoose = require('mongoose');


isAdmin = function(req, res, next) {
  if (req.user.isAdmin){
    return next();
  } else {
    res.redirect('/');
  }
}
router.get('/list', function (req, res, next) {

  Tag.find().exec(function (err, result) {
      if (err) return res.json({message: message.error + err});
      console.log(err);
      res.json({
          tags: result
      });
  })
});

/* GET home page. */
router.post('/create', isAdmin, function (req, res, next) {
  Tag.create({ name: req.body.tag }, function (err, tag) {
    if (err) return handleError(err);
    res.send(tag)
  });
});

router.delete('/destroy', isAdmin, function (req, res, next) {
  UserModel.deleteOne({
      _id: req.body.tag
  }).exec(done);
});


module.exports = router;
