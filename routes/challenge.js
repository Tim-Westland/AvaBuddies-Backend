const express = require('express');
const router = express.Router();
const Controller = require('../controllers/challengeController');
const auth = require('../modules/authentication');

router.route('/')
	.get(Controller.getChallenge)
	.post(auth.isAdmin, Controller.createChallenge);

router.route('/:id')
	.get(Controller.getChallenge)
	.put(auth.isAdmin, Controller.updateChallenge)
  .delete(auth.isAdmin, Controller.deleteChallenge);

module.exports = router;
