const express = require('express');
const router = express.Router();
const { enrollInCourse, getMyEnrollments } = require('../controllers/enrollmentController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

router.post('/enroll', protect, checkRole('Student'), enrollInCourse);
router.get('/my-enrollments', protect, checkRole('Student'), getMyEnrollments);

module.exports = router;