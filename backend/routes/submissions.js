const express = require('express');
const router = express.Router();
const { 
  submitAssignment, 
  getSubmissionsForAssignment, 
  gradeSubmission, 
  getMySubmissionForAssignment,
  getMySubmissionsForCourse
} = require('../controllers/submissionController');

const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/assignment/:assignmentId', protect, checkRole('Teacher'), getSubmissionsForAssignment);
router.put('/:submissionId/grade', protect, checkRole('Teacher'), gradeSubmission);
router.get('/assignment/:assignmentId/me', protect, checkRole('Student'), getMySubmissionForAssignment);
router.get('/course/:courseId/my-submissions', protect, checkRole('Student'), getMySubmissionsForCourse);
router.post('/', protect, checkRole('Student'), upload.single('submissionFile'), submitAssignment);

module.exports = router;