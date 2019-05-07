const express = require('express');
const router = express.Router();
const Controller = require('../controllers/userController');
const auth = require('../modules/authentication');

router.route('/')
	.get(Controller.getUsers);

router.route('/:id')
	.get(Controller.getUser)
  .put(Controller.updateUser)
  .delete(Controller.deleteUser);

module.exports = router;
