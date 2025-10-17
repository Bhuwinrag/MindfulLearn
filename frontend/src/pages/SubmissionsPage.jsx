import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/shared/Navbar.jsx';

const SubmissionsPage = () => {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data } = await api.get(`/submissions/assignment/${assignmentId}`);
        setSubmissions(data);
        const initialGrades = data.reduce((acc, sub) => {
          acc[sub._id] = sub.grade || '';
          return acc;
        }, {});
        setGrades(initialGrades);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [assignmentId]);

  const handleGradeChange = (submissionId, value) => {
    setGrades(prev => ({ ...prev, [submissionId]: value }));
  };

  // ## THIS FUNCTION IS NOW FIXED ##
  const handleGradeSubmit = async (submissionId) => {
    const grade = grades[submissionId];
    if (grade === '' || grade < 0 || grade > 100) {
      alert('Please enter a valid grade between 0 and 100.');
      return;
    }

    try {
      // 1. Send the grade to the backend and get the updated submission back
      const { data: updatedSubmission } = await api.put(`/submissions/${submissionId}/grade`, { grade });
      
      // 2. Instantly update the page's state with the new data
      // This provides a seamless UI update without a full page refresh.
      setSubmissions(currentSubmissions => 
        currentSubmissions.map(sub => 
          sub._id === submissionId ? updatedSubmission : sub
        )
      );
      
      // We no longer need an alert, as the UI update is the confirmation.

    } catch (error) {
      // This will now only be called if the save operation truly fails
      alert('Failed to save grade. Please try again.');
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Assignment Submissions</h1>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          {loading ? (
            <p className="text-white">Loading submissions...</p>
          ) : submissions.length > 0 ? (
            <ul className="space-y-4">
              {submissions.map(sub => (
                <li key={sub._id} className="bg-slate-800/60 p-4 rounded-lg md:flex justify-between items-center space-y-4 md:space-y-0">
                  <div className="flex-1">
                    <p className="text-white font-semibold">{sub.student.name}</p>
                    <p className="text-slate-400 text-sm">Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
                    <a href={`http://localhost:5000${sub.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline text-sm">
                      View Submitted File
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grades[sub._id] || ''}
                      onChange={(e) => handleGradeChange(sub._id, e.target.value)}
                      placeholder="0-100"
                      // The button and input are now disabled based on the submission's status
                      disabled={sub.status === 'Graded'}
                      className="w-24 bg-slate-700 p-2 rounded-md text-white disabled:bg-slate-800 disabled:text-slate-400"
                    />
                    <button
                      onClick={() => handleGradeSubmit(sub._id)}
                      disabled={sub.status === 'Graded'}
                      className="px-4 py-2 text-sm font-semibold bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-green-700 disabled:cursor-not-allowed"
                    >
                      {sub.status === 'Graded' ? `Graded: ${sub.grade}` : 'Save Grade'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400">No submissions for this assignment yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SubmissionsPage;