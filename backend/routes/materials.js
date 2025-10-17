const express = require('express');
const router = express.Router();
const { uploadMaterial, getMaterialsForCourse } = require('../controllers/materialController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // We reuse the assignment upload middleware

router.post('/', protect, checkRole('Teacher'), upload.single('materialFile'), uploadMaterial);
router.get('/course/:courseId', protect, getMaterialsForCourse);
router.post('/', protect, checkRole('Teacher'), upload.single('materialFile'), uploadMaterial);
router.get('/course/:courseId', protect, getMaterialsForCourse);

module.exports = router;