const express = require('express');
const router = express.Router();
const Controller = require('../controllers/tagController');
const auth = require('../modules/authentication');

router.route('/')
	.get(Controller.getTag)
	.post(auth.isAdmin, Controller.createTag);

router.route('/:id')
	.get(Controller.getTag)
	.put(auth.isAdmin, Controller.updateTag)
  .delete(auth.isAdmin, Controller.deleteTag);

module.exports = router;
