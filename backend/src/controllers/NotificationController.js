// backend/src/controllers/NotificationController.js
const Notification = require('../models/Notification');

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ userId: req.query.userId, read: false });
    res.send({ unreadCount: count });
  } catch (error) {
    res.status(500).send(error);
  }
};
