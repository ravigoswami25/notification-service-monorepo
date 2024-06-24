const AWS = require('aws-sdk');
const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const NotificationService = require('./services/NotificationService');

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const processMessage = async (message) => {
  const { userId, postId, type } = JSON.parse(message.Body);
  const notification = new Notification({ userId, postId, type });
  await notification.save();

  const title = type === 'like' ? 'New Like' : 'New Save';
  const body = `Your post has a new ${type}.`;
  await NotificationService.sendFCMNotification(userId, title, body);
};

const params = {
  QueueUrl: process.env.SQS_QUEUE_URL,
  MaxNumberOfMessages: 10,
  WaitTimeSeconds: 20
};

const receiveMessages = async () => {
  const data = await sqs.receiveMessage(params).promise();
  if (data.Messages) {
    await Promise.all(data.Messages.map(async (message) => {
      await processMessage(message);
      await sqs.deleteMessage({
        QueueUrl: process.env.SQS_QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle
      }).promise();
    }));
  }
};

setInterval(receiveMessages, 1000);
