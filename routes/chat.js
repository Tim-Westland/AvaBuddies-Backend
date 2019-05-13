var express = require('express');
var router = express.Router();
const Controller = require('../controllers/chatController');

router.route('/')
    .get(Controller.getRequests);

router.route('/:id')
    .post(Controller.createRequest)
    .delete(Controller.deleteRequest);

module.exports = router;
