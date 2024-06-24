require('dotenv').config();
const AWS = require('aws-sdk');
const Notification = require('../models/Notification');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceaccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

exports.queueNotification = async (userId, postId, type) => {
  const params = {
    MessageBody: JSON.stringify({ userId, postId, type }),
    QueueUrl: process.env.SQS_QUEUE_URL
  };
  await sqs.sendMessage(params).promise();
};

exports.sendFCMNotification = async (userId, title, body) => {
  const payload = {
    notification: {
      title: title,
      body: body
    }
  };
  const userToken = await getUserFcmToken(userId);
  if (userToken) {
    await admin.messaging().sendToDevice(userToken, payload);
  }
};

const getUserFcmToken = async (userId) => {
  const user = await User.findById(userId);
  return user.fcmToken;
};


