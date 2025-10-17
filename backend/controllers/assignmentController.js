const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment'); 
const Notification = require('../models/Notification'); 


// @desc    Create a new assignment for a course
// @route   POST /api/assignments
// @access  Private/Teacher
const createAssignment = async (req, res) => {
  const { courseId, title, description, dueDate } = req.body;

  try {
    // Check if the user is the teacher of the course
    const course = await Course.findById(courseId);
    if (!course || course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add assignments to this course' });
    }

    const assignment = new Assignment({
      course: courseId,
      title,
      description,
      dueDate,
    });

    const createdAssignment = await assignment.save();
    res.status(201).json(createdAssignment);


    const enrollments = await Enrollment.find({ course: courseId });
    const notifications = enrollments.map(enrollment => ({
      recipient: enrollment.student,
      message: `New assignment "${title}" posted in "${course.title}".`,
      link: `/course/${courseId}`,
    }));
    await Notification.insertMany(notifications);


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private

const getAssignmentsByCourse = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAssignment, getAssignmentsByCourse };