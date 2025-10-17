// src/pages/Dashboard.jsx (Final version with animation)

import React from 'react';
import { motion } from 'framer-motion'; // Import motion
import { useAuth } from '../hooks/useAuth';
import TeacherDashboard from '../components/shared/TeacherDashboard.jsx';
import StudentDashboard from '../components/shared/StudentDashboard.jsx';
import Navbar from '../components/shared/Navbar.jsx';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <motion.div 
        className="p-8"
        initial={{ opacity: 0, y: 20 }} // Start invisible and slightly down
        animate={{ opacity: 1, y: 0 }}   // Animate to visible and original position
        transition={{ duration: 0.5 }}  // Animation takes 0.5 seconds
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          </div>

          <div className="p-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-xl mb-8">
            <h2 className="text-2xl text-white">Welcome back, {user?.name}!</h2>
            <p className="text-slate-300 mt-2">Your role is: {user?.role}</p>
          </div>
          
           {user?.role === 'Teacher' && <TeacherDashboard />}
           {user?.role === 'Student' && <StudentDashboard />}
        </div>
      </motion.div>
    </>
  );
};

export default Dashboard;