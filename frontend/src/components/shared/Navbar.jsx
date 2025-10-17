import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800/50 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* ## UPDATED: Added gradient and font styles to the brand name ## */}
            <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
              MindfuLearn
            </Link>
          </div>
          <div className="flex items-center">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/courses" className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Courses</Link>
              
              {user ? (
                <>
                  {user.role === 'Teacher' && (
                    <Link to="/create-course" className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Create Course</Link>
                  )}
                  {user.role === 'Student' && (
                    <Link to="/my-courses" className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">My Courses</Link>
                  )}
                  
                  <button onClick={handleLogout} className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Logout
                  </button>

                  {/* ## UPDATED: Moved NotificationBell to after the Logout button ## */}
                  <NotificationBell />
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                  <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;