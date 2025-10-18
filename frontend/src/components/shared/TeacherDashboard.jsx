import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const TeacherDashboard = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const { data } = await api.get('/courses/mycourses');
        setMyCourses(data);
      } catch (error) {
        console.error("Failed to fetch teacher's courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">My Courses</h2>
        {loading ? (
          <p>Loading your courses...</p>
        ) : myCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myCourses.map(course => {
              const imageUrl = course.imageUrl 
                ? course.imageUrl
                : '/images/default-course-image.jpg';

              return (
                <Link to={`/course/${course._id}`} key={course._id} className="block bg-slate-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform">
                  {/* ## ADDED: Image tag ## */}
                  <img src={imageUrl} alt={course.title} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                    <p className="text-slate-400 mt-2">{course.duration}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-slate-400">You haven't created any courses yet.</p>
        )}
      </div>
      <div className="mt-6">
         <Link to="/create-course" className="inline-block px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Create a New Course
          </Link>
      </div>
    </div>
  );
};

export default TeacherDashboard;
