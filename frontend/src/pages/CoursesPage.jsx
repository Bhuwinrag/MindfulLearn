import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/shared/Navbar.jsx';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchCoursesAndEnrollments = async () => {
      try {
        const coursesRes = await api.get('/courses');
        setCourses(coursesRes.data);

        if (user && user.role === 'Student') {
          const enrollmentsRes = await api.get('/enrollments/my-enrollments');
          const ids = new Set(enrollmentsRes.data.map(e => e.course._id));
          setEnrolledCourseIds(ids);
        }
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchCoursesAndEnrollments();
  }, [user]);

  const handleEnroll = async (courseId) => {
    try {
      await api.post('/enrollments/enroll', { courseId });
      setEnrolledCourseIds(prevIds => new Set(prevIds).add(courseId));
      alert('Enrollment successful!');
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed.');
    }
  };

  if (loading) return <div className="text-center mt-8 text-white">Loading courses...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <>
      <Navbar />
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-white mb-8">Available Courses</h1>
        
        {/* ## THIS IS THE UPDATED SECTION ## */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseIds.has(course._id);
            // Define the image source, with a fallback to a default image
            const imageUrl = course.imageUrl 
              ? `http://localhost:5000${course.imageUrl}` 
              : '/images/default-course-image.jpg';

            return (
              <motion.div
                key={course._id}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Display the course image */}
                  <img src={imageUrl} alt={course.title} className="w-full h-40 object-cover" />
                  
                  <Link to={`/course/${course._id}`} className="p-6 block">
                    <h2 className="text-2xl font-bold text-white mb-2">{course.title}</h2>
                    <p className="text-slate-300 mb-4 h-24 overflow-hidden">{course.description}</p>
                    <div className="flex justify-between items-center text-slate-400 text-sm mt-4 pt-4 border-t border-white/20">
                      <span>Instructor: {course.teacher.name}</span>
                      <span className="font-semibold">{course.duration}</span>
                    </div>
                  </Link>
                </div>
                
                {user?.role === 'Student' && (
                  <div className="px-6 pb-4">
                    <button
                      onClick={() => handleEnroll(course._id)}
                      disabled={isEnrolled}
                      className={`w-full py-2 font-semibold text-white rounded-md transition-colors ${
                        isEnrolled
                          ? 'bg-green-600 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                    </button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </>
  );
};

export default CoursesPage;