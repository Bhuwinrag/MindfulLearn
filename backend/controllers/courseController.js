const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Create a new course
const createCourse = async (req, res) => {
  const { title, description, duration } = req.body;
  
  try {
    const course = new Course({
      title,
      description,
      duration,
      teacher: req.user._id,
    });
    
    if (req.file) {
      course.imageUrl = `/uploads/${req.file.filename}`;
    }

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('teacher', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name email');
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get courses created by a teacher
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get enrolled students for a course
const getEnrolledStudents = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course || course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view students for this course' });
    }

    const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'name email');
    const students = enrollments.map(e => e.student).filter(Boolean); // Filters out any null/undefined students

    res.json(students);
  } catch (error) {
    console.error('Error fetching enrolled students:', error);
    res.status(500).json({ message: 'Server error while fetching students.' });
  }
};

module.exports = { 
  createCourse, 
  getAllCourses, 
  getCourseById, 
  getMyCourses, 
  getEnrolledStudents 
};