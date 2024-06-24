const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const router = express.Router();

router.get('/unread-count', NotificationController.getUnreadCount);

module.exports = router;
