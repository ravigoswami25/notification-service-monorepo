const Post = require('../models/Post');
const NotificationService = require('../services/NotificationService');

exports.createPost = async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    post.likes.push(req.body.userId);
    await post.save();
    await NotificationService.queueNotification(post.userId, post._id, 'like');
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.savePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    post.saves.push(req.body.userId);
    await post.save();
    await NotificationService.queueNotification(post.userId, post._id, 'save');
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
};
