const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();

router.post('/update-token', UserController.updateFcmToken);

module.exports = router;
