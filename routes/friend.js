var express = require('express');
var router = express.Router();
const Controller = require('../controllers/friendController');

router.route('/')
	.get(Controller.getRequests);

router.route('/:id')
	.get(Controller.getRequest)
	.put(Controller.updateRequest)
	.post(Controller.createRequest)
	.delete(Controller.deleteRequest);


module.exports = router;
