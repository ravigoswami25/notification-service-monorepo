const express = require('express');
const PostController = require('../controllers/PostController');
const router = express.Router();

router.post('/create', PostController.createPost);
router.patch('/update/:id', PostController.updatePost);
router.delete('/delete/:id', PostController.deletePost);
router.post('/like/:id', PostController.likePost);
router.post('/save/:id', PostController.savePost);

module.exports = router;
