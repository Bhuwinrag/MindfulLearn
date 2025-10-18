import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/shared/Navbar.jsx';
import { motion } from 'framer-motion';

const MyCoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const { data } = await api.get('/enrollments/my-enrollments');
        setEnrolledCourses(data.map(enrollment => enrollment.course));
      } catch (error) {
        console.error("Failed to fetch enrolled courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  return (
    <>
      <Navbar />
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-4xl font-bold text-white mb-8">My Enrolled Courses</h1>
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map(course => {
              // ## ADDED: Logic to determine image source ##
              const imageUrl = course.imageUrl 
                ? course.imageUrl 
                : '/images/default-course-image.jpg';

              return (
                <Link to={`/course/${course._id}`} key={course._id} className="block bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                  {/* ## ADDED: Image tag ## */}
                  <img src={imageUrl} alt={course.title} className="w-full h-40 object-cover" />
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-white">{course.title}</h2>
                    <p className="text-slate-300 mt-2">Instructor: {course.teacher.name}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-slate-400">You haven't enrolled in any courses yet.</p>
        )}
      </motion.div>
    </>
  );
};

export default MyCoursesPage;
