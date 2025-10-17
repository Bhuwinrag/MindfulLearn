const express = require('express');
const router = express.Router();
const { getLearningRecommendations } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');
const { analyzeStudentPerformance } = require('../controllers/aiController');
const { checkRole } = require('../middlewares/roleMiddleware');
const { generateLessonPlan } = require('../controllers/aiController');
const { chatWithAI } = require('../controllers/aiController');



router.post('/recommendations', protect, getLearningRecommendations);
router.post('/student-analysis', protect, checkRole('Teacher'), analyzeStudentPerformance);
router.post('/generate-lesson', protect, checkRole('Teacher'), generateLessonPlan);
router.post('/chat', protect, checkRole('Student'), chatWithAI);

module.exports = router;