const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses, getCourseById, getMyCourses, getEnrolledStudents } = require('../controllers/courseController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// ## THIS IS THE FIX: Added 'protect' middleware to the GET route ##
router.route('/')
  .get(protect, getAllCourses) 
  .post(protect, checkRole('Teacher'), upload.single('courseImage'), createCourse);
  
router.get('/mycourses', protect, checkRole('Teacher'), getMyCourses);

router.route('/:id')
  .get(protect, getCourseById); // Also protect this route
  
router.get('/:id/students', protect, checkRole('Teacher'), getEnrolledStudents);

module.exports = router;
