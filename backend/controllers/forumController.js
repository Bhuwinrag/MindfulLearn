const Thread = require('../models/Thread');
const Post = require('../models/Post');

// @desc    Get all threads for a course
const getThreadsByCourse = async (req, res) => {
  try {
    const threads = await Thread.find({ course: req.params.courseId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single thread and all its posts
const getThreadById = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId).populate('author', 'name');
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    const posts = await Post.find({ thread: req.params.threadId })
      .populate('author', 'name')
      .sort({ createdAt: 1 });
    res.json({ thread, posts });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new thread
const createThread = async (req, res) => {
  const { title, content, courseId } = req.body;
  try {
    const newThread = new Thread({
      title,
      content,
      course: courseId,
      author: req.user._id,
    });
    const savedThread = await newThread.save();
    res.status(201).json(savedThread);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new post (reply) in a thread
const createPost = async (req, res) => {
  const { content, threadId } = req.body;
  try {
    const newPost = new Post({
      content,
      thread: threadId,
      author: req.user._id,
    });
    const savedPost = await newPost.save();
    const populatedPost = await Post.findById(savedPost._id).populate('author', 'name');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getThreadsByCourse,
  getThreadById,
  createThread,
  createPost,
};