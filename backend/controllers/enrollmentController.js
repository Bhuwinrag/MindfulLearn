const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll in a course
// @route   POST /api/enrollments/enroll
// @access  Private/Student
const enrollInCourse = async (req, res) => {
  const { courseId } = req.body;
  const studentId = req.user._id;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const alreadyEnrolled = await Enrollment.findOne({ course: courseId, student: studentId });
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      student: studentId,
      course: courseId,
    });

    const newEnrollment = await enrollment.save();
    res.status(201).json(newEnrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get courses a student is enrolled in
// @route   GET /api/enrollments/my-enrollments
// @access  Private/Student
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: {
          path: 'teacher',
          select: 'name'
        }
      });
      
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { enrollInCourse, getMyEnrollments };