const express = require('express');
const router = express.Router();
const Tag = require('../models/tag');
const mongoose = require('mongoose');
const auth = require('../modules/authentication');



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
router.post('/create', auth.isAdmin, function (req, res, next) {
  Tag.create({ name: req.body.tag }, function (err, tag) {
    if (err) return handleError(err);
    res.send(tag)
  });
});

router.delete('/destroy', auth.isAdmin, function (req, res, next) {
  Tag.deleteOne({
      _id: req.body.tag
  }).exec(done);
});


module.exports = router;
