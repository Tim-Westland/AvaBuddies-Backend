var express = require('express');
var router = express.Router();
const Controller = require('../controllers/friendController');

router.route('/')
	.get(Controller.getRequests)
	.post(Controller.createRequest);

router.route('/:id')
	.get(Controller.getRequest)
	.put(Controller.updateRequest)
	.delete(Controller.deleteRequest);


module.exports = router;
