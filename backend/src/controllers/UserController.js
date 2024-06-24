const User = require('../models/User');

exports.updateFcmToken = async (req, res) => {
  try {
    const { token } = req.body;
    await User.findByIdAndUpdate(req.body.userId, { fcmToken: token });
    res.send({ success: true });
  } catch (error) {
    res.status(500).send(error);
  }
};
