const express = require('express');
const router = express.Router();
const Controller = require('../controllers/tagController');
const auth = require('../modules/authentication');

router.route('/')
	.get(Controller.getTags);

router.route('/:id')
	.get(Controller.getTag)
	.put(Controller.updateTag)
  .delete(Controller.deleteTag);

module.exports = router;
