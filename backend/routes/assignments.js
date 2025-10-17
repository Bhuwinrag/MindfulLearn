const express = require('express');
const router = express.Router();
const { createAssignment, getAssignmentsByCourse } = require('../controllers/assignmentController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

router.post('/', protect, checkRole('Teacher'), createAssignment);
router.get('/course/:courseId', protect, getAssignmentsByCourse);

module.exports = router;