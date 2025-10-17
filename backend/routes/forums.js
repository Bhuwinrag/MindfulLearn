const express = require('express');
const router = express.Router();
const {
  getThreadsByCourse,
  getThreadById,
  createThread,
  createPost,
} = require('../controllers/forumController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/threads/course/:courseId', protect, getThreadsByCourse);
router.get('/threads/:threadId', protect, getThreadById);
router.post('/threads', protect, createThread);
router.post('/posts', protect, createPost);

module.exports = router;