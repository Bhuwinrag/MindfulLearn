const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Notification = require('../models/Notification');
const Course = require('../models/Course');

// @desc    Submit an assignment
// @route   POST /api/submissions
// @access  Private/Student
const submitAssignment = async (req, res) => {
  const { assignmentId } = req.body;
  const studentId = req.user._id;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // NOTE: In production, you'd upload to a cloud service and get a URL.
  // Here, we construct a URL based on our local setup.
  const fileUrl = `/uploads/${req.file.filename}`;

  try {
    // Check if submission already exists
    const existingSubmission = await Submission.findOne({ assignment: assignmentId, student: studentId });
    if (existingSubmission) {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }
    
    const submission = new Submission({
      assignment: assignmentId,
      student: studentId,
      fileUrl: fileUrl,
    });

    const createdSubmission = await submission.save();
    res.status(201).json(createdSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get submissions for a specific assignment (for teachers)
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Private/Teacher
const getSubmissionsForAssignment = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId })
                                        .populate('student', 'name email');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Grade a submission
// @route   PUT /api/submissions/:submissionId/grade
// @access  Private/Teacher
const gradeSubmission = async (req, res) => {
    const { grade } = req.body;
    const teacherId = req.user._id;

    try {
        // 1. Find the submission and populate related data
        const submission = await Submission.findById(req.params.submissionId)
            .populate('assignment', 'title course')
            .populate('student', 'name email');

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        if (!submission.assignment) {
            return res.status(404).json({ message: 'Associated assignment not found' });
        }

        // 2. Find the course to verify the teacher
        const course = await Course.findById(submission.assignment.course);
        if (!course) {
            return res.status(404).json({ message: 'Associated course not found' });
        }
        
        // 3. Authorization Check
        if (course.teacher.toString() !== teacherId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to grade this submission.' });
        }

        // 4. Update grade and status
        submission.grade = grade;
        submission.status = 'Graded';
        const updatedSubmission = await submission.save();

        // 5. Create in-app notification
        await new Notification({
          recipient: submission.student._id,
          message: `Your submission for "${submission.assignment.title}" has been graded. You received ${grade}/100.`,
          link: `/course/${course._id}`,
        }).save();

        res.json(updatedSubmission);
    } catch (error) {
        console.error("Error grading submission:", error);
        res.status(500).json({ message: 'Server error while grading.' });
    }
};
// @desc    Get a student's submission for a specific assignment
// @route   GET /api/submissions/assignment/:assignmentId/me
// @access  Private/Student
const getMySubmissionForAssignment = async (req, res) => {
  try {
    const submission = await Submission.findOne({ 
      assignment: req.params.assignmentId,
      student: req.user._id
    });
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMySubmissionsForCourse = async (req, res) => {
  try {
    // Find all assignments for the given course
    const assignments = await Assignment.find({ course: req.params.courseId });
    const assignmentIds = assignments.map(a => a._id);

    // Find all submissions by the student for those assignments
    const submissions = await Submission.find({
      student: req.user._id,
      assignment: { $in: assignmentIds }
    });
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitAssignment, getSubmissionsForAssignment, gradeSubmission, getMySubmissionForAssignment, getMySubmissionsForCourse };