import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/shared/Navbar.jsx';
import CreateAssignmentModal from '../components/shared/CreateAssignmentModal.jsx';
import StudentAnalysisModal from '../components/shared/StudentAnalysisModal.jsx'; 
import Chatbot from '../components/shared/Chatbot.jsx';
import { motion } from 'framer-motion';

// Helper component for displaying a single assignment to a student
const AssignmentItem = ({ assignment, studentSubmissions, onSubmissionSuccess }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submission = studentSubmissions.find(s => s.assignment === assignment._id);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to submit.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    const formData = new FormData();
    formData.append('submissionFile', file);
    formData.append('assignmentId', assignment._id);

    try {
      await api.post('/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSubmissionSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800/60 p-4 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-white">{assignment.title}</h3>
          <p className="text-slate-400 mt-1 max-w-prose">{assignment.description}</p>
          <p className="text-sm text-indigo-400 mt-2">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
        </div>
        {submission?.status === 'Graded' && (
          <div className="text-right flex-shrink-0 ml-4">
            <p className="text-slate-400 text-sm">GRADE</p>
            <p className="text-3xl font-bold text-green-400">{submission.grade}/100</p>
          </div>
        )}
      </div>

      {submission ? (
        <div className={`mt-4 p-3 rounded-md ${submission.status === 'Graded' ? 'bg-green-900/50' : 'bg-blue-900/50'}`}>
          <p className={`font-semibold ${submission.status === 'Graded' ? 'text-green-400' : 'text-blue-400'}`}>
            {submission.status === 'Graded' ? `Graded on ${new Date(submission.submittedAt).toLocaleDateString()}` : `Submitted on ${new Date(submission.submittedAt).toLocaleDateString()}`}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <input type="file" onChange={handleFileChange} required className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer"/>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
            {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
};

// Main page component
const CourseDetailsPage = () => {
  const { id: courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [materialFile, setMaterialFile] = useState(null);
  const [materialTitle, setMaterialTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ## AI FEATURE STATE ##
  const [recommendations, setRecommendations] = useState('');
  const [isFetchingRecs, setIsFetchingRecs] = useState(false);
  const [lessonPlan, setLessonPlan] = useState('');
  const [isFetchingLesson, setIsFetchingLesson] = useState(false);
  const [lessonTopic, setLessonTopic] = useState('');

  const [selectedStudentForAnalysis, setSelectedStudentForAnalysis] = useState(null);
  const [analysisReport, setAnalysisReport] = useState('');
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);


  const isTeacherOfCourse = user?.role === 'Teacher' && user?._id === course?.teacher._id;

  const fetchAllDetails = useCallback(async () => {
    try {
      const [courseRes, assignmentsRes, materialsRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/assignments/course/${courseId}`),
        api.get(`/materials/course/${courseId}`)
      ]);
      
      setCourse(courseRes.data);
      setAssignments(assignmentsRes.data);
      setMaterials(materialsRes.data);

      if (isTeacherOfCourse) {
        const studentsRes = await api.get(`/courses/${courseId}/students`);
        setEnrolledStudents(studentsRes.data);
      }
      
      if (user?.role === 'Student') {
        const submissionsRes = await api.get(`/submissions/course/${courseId}/my-submissions`);
        setStudentSubmissions(submissionsRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch course details", error);
    } finally {
      setLoading(false);
    }
  }, [courseId, user, isTeacherOfCourse]);

  useEffect(() => {
    setLoading(true);
    fetchAllDetails();
  }, [fetchAllDetails]);
  
  const handleMaterialUpload = async (e) => {
    e.preventDefault();
    if (!materialFile || !materialTitle) {
      return alert('Please provide a title and a file.');
    }
    const formData = new FormData();
    formData.append('materialFile', materialFile);
    formData.append('title', materialTitle);
    formData.append('courseId', courseId);

    try {
      const { data } = await api.post('/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMaterials(prev => [...prev, data]);
      setMaterialTitle('');
      setMaterialFile(null);
      e.target.reset();
    } catch (error) {
      console.error('Failed to upload material', error);
      alert('Upload failed.');
    }
  };
  
  const handleAssignmentCreated = (newAssignment) => {
    setAssignments(prev => [...prev, newAssignment]);
    setIsModalOpen(false);
  };

  const calculateOverallGrade = () => {
    const gradedSubs = studentSubmissions.filter(s => s.status === 'Graded' && s.grade != null);
    if (gradedSubs.length === 0) return 'N/A';
    const total = gradedSubs.reduce((acc, sub) => acc + sub.grade, 0);
    return (total / gradedSubs.length).toFixed(2);
  };
  
  // ## AI HANDLERS ##
  const handleGetRecommendations = async () => {
    setIsFetchingRecs(true);
    setRecommendations('');
    try {
      const { data } = await api.post('/ai/recommendations', { courseId });
      setRecommendations(data.recommendations);
    } catch (error) {
      setRecommendations('Sorry, could not fetch recommendations at this time.');
    } finally {
      setIsFetchingRecs(false);
    }
  };

  const handleGenerateLesson = async (e) => {
    e.preventDefault();
    if (!lessonTopic) return;
    setIsFetchingLesson(true);
    setLessonPlan('');
    try {
      const { data } = await api.post('/ai/generate-lesson', { topic: lessonTopic, courseTitle: course.title });
      setLessonPlan(data.lessonPlan);
    } catch (error) {
      setLessonPlan('Sorry, could not generate a lesson plan at this time.');
    } finally {
      setIsFetchingLesson(false);
    }
  };

  // handler for teacher analysis
  const handleGetStudentAnalysis = async (student) => {
    setSelectedStudentForAnalysis(student);
    setIsAnalysisLoading(true);
    setAnalysisReport('');
    try {
      const { data } = await api.post('/ai/student-analysis', { 
        courseId: courseId, 
        studentId: student._id 
      });
      setAnalysisReport(data.analysis);
    } catch (error) {
      setAnalysisReport('Sorry, could not generate an analysis at this time.');
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="text-center text-white mt-8">Loading...</div>
    </>
  );
  if (!course) return (
    <>
      <Navbar />
      <div className="text-center text-red-500 mt-8">Course not found.</div>
    </>
  );

  return (
    <>
      <Navbar />
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white">{course.title}</h1>
          <p className="text-slate-300 mt-4 text-lg">{course.description}</p>
          <div className="mt-6">
            <Link 
              to={`/course/${courseId}/forum`}
              className="inline-block px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Go to Discussion Forum
            </Link>
          </div>
        </div>
        
        {user?.role === 'Student' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white">My Performance</h2>
            <p className="text-slate-300 mt-2">Overall Grade for this course:</p>
            <p className="text-5xl font-bold text-green-400 mt-2">{calculateOverallGrade()}%</p>
            
            {/* ## ADDED: AI Recommendations Section ## */}
            <div className="mt-6 border-t border-white/20 pt-6">
              <button onClick={handleGetRecommendations} disabled={isFetchingRecs} className="px-4 py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-500">
                {isFetchingRecs ? 'Analyzing...' : 'Get AI Recommendations'}
              </button>
              {recommendations && (
                <div className="mt-4 p-4 bg-slate-800/60 rounded-lg">
                  <h4 className="font-bold text-white mb-2">Personalized Feedback:</h4>
                  <p className="text-slate-300 whitespace-pre-wrap">{recommendations}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* AI Teacher Tools Panel */}
        {isTeacherOfCourse && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6">AI Teacher Tools</h2>
            <form onSubmit={handleGenerateLesson} className="space-y-4">
              <h3 className="text-xl font-semibold text-white">AI Lesson Planner</h3>
              <div>
                <label htmlFor="lessonTopic" className="block text-sm font-medium text-slate-300">Lesson Topic</label>
                <input id="lessonTopic" type="text" value={lessonTopic} onChange={(e) => setLessonTopic(e.target.value)} required placeholder="e.g., Introduction to React Hooks" className="w-full mt-1 bg-slate-700 p-2 rounded-md"/>
              </div>
              <button type="submit" disabled={isFetchingLesson} className="px-4 py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-500">
                {isFetchingLesson ? 'Generating Plan...' : 'Generate Lesson Plan'}
              </button>
            </form>
            {lessonPlan && (
              <div className="mt-6 p-4 bg-slate-800/60 rounded-lg border border-white/20">
                <h4 className="font-bold text-white mb-2">Generated Lesson Plan:</h4>
                <p className="text-slate-300 whitespace-pre-wrap">{lessonPlan}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Course Materials</h2>
          {isTeacherOfCourse && (
            <form onSubmit={handleMaterialUpload} className="mb-6 bg-slate-800/60 p-4 rounded-lg space-y-4">
              <h3 className="text-xl font-semibold text-white">Upload New Material</h3>
              <div>
                <label htmlFor="materialTitle" className="block text-sm font-medium text-slate-300">Material Title</label>
                <input id="materialTitle" type="text" value={materialTitle} onChange={(e) => setMaterialTitle(e.target.value)} required className="w-full mt-1 bg-slate-700 p-2 rounded-md"/>
              </div>
              <div>
                <label htmlFor="materialFile" className="block text-sm font-medium text-slate-300">File</label>
                <input id="materialFile" type="file" onChange={(e) => setMaterialFile(e.target.files[0])} required className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer"/>
              </div>
              <button type="submit" className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Upload</button>
            </form>
          )}
          <div className="space-y-4">
            {materials.length > 0 ? materials.map(material => (
             <a key={material._id} href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-800/60 p-4 rounded-lg flex justify-between items-center hover:bg-slate-700/80 transition-colors">
                <span className="text-sm text-indigo-400">Download</span>
              </a>
            )) : <p className="text-slate-400">No materials have been uploaded for this course yet.</p>}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Assignments</h2>
            {isTeacherOfCourse && (
              <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Create Assignment
              </button>
            )}
          </div>
          <div className="space-y-6">
            {assignments.length > 0 ? assignments.map(assignment => (
                isTeacherOfCourse ? (
                  <div key={assignment._id} className="bg-slate-800/60 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{assignment.title}</h3>
                      <p className="text-sm text-indigo-400 mt-1">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    </div>
                    <Link to={`/assignment/${assignment._id}/submissions`} className="px-4 py-2 text-sm font-semibold bg-slate-700 rounded-md hover:bg-slate-600">View Submissions</Link>
                  </div>
                ) : (
                  <AssignmentItem key={assignment._id} assignment={assignment} studentSubmissions={studentSubmissions} onSubmissionSuccess={fetchAllDetails} />
                )
            )) : <p className="text-slate-400">No assignments for this course yet.</p>}
          </div>
        </div>

        {isTeacherOfCourse && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Enrolled Students</h2>
            {enrolledStudents && enrolledStudents.length > 0 ? (
              <ul className="space-y-4">
                {enrolledStudents.map(student => (
                  <li key={student._id} className="bg-slate-800/60 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="text-white font-medium">{student.name}</span>
                      <p className="text-slate-400 text-sm">{student.email}</p>
                    </div>
                    {/* ## ADDED: AI Analysis Button ## */}
                    <button
                      onClick={() => handleGetStudentAnalysis(student)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700"
                    >
                      AI Analysis
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400">No students have enrolled in this course yet.</p>
            )}
          </div>
        )}
      </motion.div>
      {isModalOpen && <CreateAssignmentModal courseId={courseId} onClose={() => setIsModalOpen(false)} onAssignmentCreated={handleAssignmentCreated} />}
      
      {/* ## ADDED: AI Analysis Modal ## */}
      {selectedStudentForAnalysis && (
        <StudentAnalysisModal 
          student={selectedStudentForAnalysis}
          report={analysisReport}
          isLoading={isAnalysisLoading}
          onClose={() => setSelectedStudentForAnalysis(null)}
        />
      )}
      {user?.role === 'Student' && <Chatbot courseId={courseId} />}
    </>
  );
};

export default CourseDetailsPage;
