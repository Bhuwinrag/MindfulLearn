const { generateContent } = require('../utils/geminiService');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const Course = require('../models/Course');
const { createEmbedding } = require('../utils/geminiService');
const pineconeIndex = require('../utils/pineconeService');

// @desc    Generate learning recommendations for a student
const getLearningRecommendations = async (req, res) => {
  const { courseId } = req.body;
  const studentId = req.user._id;

  try {
    // 1. Gather Data: Find all graded submissions for the student in this course
    const assignments = await Assignment.find({ course: courseId });
    const assignmentIds = assignments.map(a => a._id);
    const submissions = await Submission.find({ 
      student: studentId, 
      assignment: { $in: assignmentIds },
      status: 'Graded'
    }).populate('assignment', 'title');

    if (submissions.length === 0) {
      return res.json({ recommendations: "Not enough data yet. Complete some assignments to get personalized feedback!" });
    }

    // 2. Prompt Gemini: Create a detailed prompt
    const performanceData = submissions.map(s => 
      `- Assignment: "${s.assignment.title}", Grade: ${s.grade}/100`
    ).join('\n');

    const prompt = `
      You are an expert academic advisor for our platform, MindfuLearn.
      A student has requested personalized learning recommendations for a course.
      
      Here is their recent performance data:
      ${performanceData}

      Based on these grades, provide 3 actionable, encouraging, and personalized recommendations for improvement.
      Format the response as a simple list.
    `;

    // 3. Get AI Response
    const recommendations = await generateContent(prompt);
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate recommendations.' });
  }
};


const analyzeStudentPerformance = async (req, res) => {
  const { courseId, studentId } = req.body;
  const teacherId = req.user._id;

  try {
    // 1. Authorization: Ensure the requester is the teacher of the course
    const course = await Course.findById(courseId);
    if (!course || course.teacher.toString() !== teacherId.toString()) {
      return res.status(403).json({ message: 'Not authorized for this course' });
    }
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // 2. Gather Data: Find all graded submissions for the student in this course
    const assignments = await Assignment.find({ course: courseId });
    const assignmentIds = assignments.map(a => a._id);
    const submissions = await Submission.find({ 
      student: studentId, 
      assignment: { $in: assignmentIds },
      status: 'Graded'
    }).populate('assignment', 'title');

    if (submissions.length === 0) {
      return res.json({ analysis: "This student has no graded assignments in this course yet." });
    }

    // 3. Prompt Gemini: Craft a detailed prompt for the teacher
    const performanceData = submissions.map(s => 
      `- Assignment: "${s.assignment.title}", Grade: ${s.grade}/100`
    ).join('\n');

    const prompt = `
      You are an AI teaching assistant for MindfuLearn. A teacher needs a performance analysis for their student, ${student.name}, in the course "${course.title}".

      Analyze the following performance data:
      ${performanceData}

      Based on this data, provide a concise report for the TEACHER with these sections:
      1.  **Strengths:** One or two sentences on what the student is doing well.
      2.  **Areas for Improvement:** One or two sentences on where the student is struggling.
      3.  **Actionable Recommendations:** A bulleted list of 3 specific, encouraging recommendations the teacher can give to the student.
    `;

    // 4. Get AI Response
    const analysis = await generateContent(prompt);
    res.json({ analysis });

  } catch (error) {
    res.status(500).json({ message: 'Failed to generate analysis.' });
  }
};



const generateLessonPlan = async (req, res) => {
  const { topic, courseTitle } = req.body;

  if (!topic) {
    return res.status(400).json({ message: 'Lesson topic is required.' });
  }

  try {
    const prompt = `
      You are an expert curriculum designer for our platform, MindfuLearn.
      A teacher needs a lesson plan for the course "${courseTitle}".

      The topic for the lesson is: "${topic}".

      Please generate a structured 60-minute lesson plan with the following sections:
      1.  **Learning Objectives:** 3 clear goals for what students should be able to do after the lesson.
      2.  **Key Concepts:** A brief list of the most important terms and ideas.
      3.  **Lesson Activities:** A step-by-step breakdown of activities (e.g., Introduction, Direct Instruction, Activity, Wrap-up).
      4.  **Assessment:** A simple idea for how to check for understanding at the end of the lesson.

      Format the entire response in clean markdown.
    `;

    const lessonPlan = await generateContent(prompt);
    res.json({ lessonPlan });
  } catch (error) {
    console.error('Error in generateLessonPlan:', error); // Better logging
    res.status(500).json({ message: 'Failed to generate lesson plan.' });
  }
};

const chatWithAI = async (req, res) => {
  const { message, courseId } = req.body;
  try {
    const queryEmbedding = await createEmbedding(message);
    const queryResponse = await pineconeIndex.query({
      vector: queryEmbedding,
      topK: 3,
      filter: { courseId: { '$eq': courseId } },
      includeMetadata: true,
    });
    const context = queryResponse.matches.map(match => match.metadata.text).join('\n---\n');
    if (context.trim() === '') {
        return res.json({ reply: "I'm sorry, I couldn't find any information on that topic in the uploaded course materials." });
    }
    const prompt = `You are an AI Course Tutor for MindfuLearn. Answer the student's question based ONLY on the provided course context. If the answer is not in the context, say "I'm sorry, that information is not available in the course materials." CONTEXT: ${context} STUDENT'S QUESTION: ${message} ANSWER:`;
    const reply = await generateContent(prompt);
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ reply: 'Sorry, I am unable to process your request right now.' });
  }
};

module.exports = { getLearningRecommendations, analyzeStudentPerformance, generateLessonPlan , chatWithAI};