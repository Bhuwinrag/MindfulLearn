const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses, getCourseById, getMyCourses, getEnrolledStudents } = require('../controllers/courseController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/')
  .get(getAllCourses)
  .post(protect, checkRole('Teacher'), upload.single('courseImage'), createCourse);
  
router.get('/mycourses', protect, checkRole('Teacher'), getMyCourses);

router.route('/:id')
  .get(getCourseById);
  
router.get('/:id/students', protect, checkRole('Teacher'), getEnrolledStudents);

module.exports = router;