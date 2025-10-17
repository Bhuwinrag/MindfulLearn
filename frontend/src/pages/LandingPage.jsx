import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // For smooth animations
import { FaGraduationCap, FaChalkboardTeacher, FaRobot, FaComments } from 'react-icons/fa'; // Icons for features

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between children animations
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const gradientBackground = {
    background: 'linear-gradient(to right bottom, #4f46e5, #8b5cf6, #d946ef)', // Purple-blue gradient
  };

  return (
    <motion.div
      className="min-h-screen text-white relative overflow-hidden"
      style={gradientBackground}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Abstract Shapes for BG */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center"
        variants={itemVariants}
      >
        <div className="text-3xl font-extrabold tracking-tight">MindfulLearn</div>
        <div>
          <Link to="/login" className="px-6 py-2 text-lg font-semibold bg-white text-indigo-700 rounded-full hover:bg-gray-100 transition-colors shadow-lg mr-4">
            Login
          </Link>
          <Link to="/register" className="px-6 py-2 text-lg font-semibold bg-indigo-700 hover:bg-indigo-800 rounded-full transition-colors shadow-lg">
            Register
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.header 
        className="relative z-10 flex flex-col items-center justify-center text-center py-20 px-4 max-w-4xl mx-auto"
        variants={itemVariants}
      >
        <motion.h1 
          className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          variants={itemVariants}
        >
          Elevate Your Learning Journey
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl"
          variants={itemVariants}
        >
          MindfulLearn is your all-in-one platform for courses, assignments, AI-powered insights, and community engagement.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link to="/courses" className="px-10 py-4 text-xl font-bold bg-white text-purple-700 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:scale-105">
            Explore Courses
          </Link>
        </motion.div>
      </motion.header>

      {/* Features Section */}
      <section className="relative z-10 bg-white/5 backdrop-blur-lg rounded-t-3xl shadow-2xl py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-5xl font-extrabold text-center mb-16 leading-tight"
            variants={itemVariants}
          >
            Why Choose MindfulLearn?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <motion.div variants={itemVariants} className="text-center p-8 bg-white/10 rounded-2xl shadow-xl border border-white/20">
              <FaGraduationCap className="text-6xl text-indigo-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Rich Courses</h3>
              <p className="text-lg text-white/80">Access a diverse library of courses taught by expert instructors.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center p-8 bg-white/10 rounded-2xl shadow-xl border border-white/20">
              <FaChalkboardTeacher className="text-6xl text-purple-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Teacher Tools</h3>
              <p className="text-lg text-white/80">Powerful tools for teachers to create, manage, and engage with students.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center p-8 bg-white/10 rounded-2xl shadow-xl border border-white/20">
              <FaRobot className="text-6xl text-pink-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">AI-Powered Insights</h3>
              <p className="text-lg text-white/80">Get personalized recommendations and generate lesson plans with AI.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center p-8 bg-white/10 rounded-2xl shadow-xl border border-white/20">
              <FaComments className="text-6xl text-blue-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Engaging Community</h3>
              <p className="text-lg text-white/80">Connect with peers and instructors in vibrant discussion forums.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-20 px-4 max-w-4xl mx-auto text-center">
        <motion.h2 
          className="text-5xl font-extrabold mb-8 leading-tight"
          variants={itemVariants}
        >
          Ready to Start Your Learning Journey?
        </motion.h2>
        <motion.p 
          className="text-xl text-white/90 mb-10"
          variants={itemVariants}
        >
          Join MindfulLearn today and unlock a world of knowledge and collaboration.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link to="/register" className="px-10 py-4 text-xl font-bold bg-white text-indigo-700 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:scale-105">
            Get Started Free
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/5 py-10 text-center text-white/70">
        <p>&copy; {new Date().getFullYear()} MindfulLearn. All rights reserved.</p>
      </footer>

      {/* Add some basic CSS for the blob animation if not already present */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </motion.div>
  );
};

export default LandingPage;