import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/shared/LoadingSpinner'; // Import the spinner

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import CreateCoursePage from './pages/CreateCoursePage.jsx';
import MyCoursesPage from './pages/MyCoursesPage.jsx';
import CourseDetailsPage from './pages/CourseDetailsPage.jsx';
import SubmissionsPage from './pages/SubmissionsPage.jsx';
import ForumPage from './pages/ForumPage.jsx';
import ThreadPage from './pages/ThreadPage.jsx';

// Updated GuestRoute to handle loading state
const GuestRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

// Updated ProtectedRoute to handle loading state
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Teacher routes (can also be updated for loading, but ProtectedRoute already covers it)
const TeacherRoute = () => {
  const { user } = useAuth(); // No need for loading check if it's nested under ProtectedRoute
  return user && user.role === 'Teacher' ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

// Student routes
const StudentRoute = () => {
  const { user } = useAuth();
  return user && user.role === 'Student' ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <div className="min-h-screen aurora-background">
      <div className="main-content">
        <Routes>
          
            <Route path="/" element={<LandingPage />} />
          
          {/* Guest Routes */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Routes (for all logged-in users) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/course/:id" element={<CourseDetailsPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            
            {/* Nested Teacher Routes */}
            <Route element={<TeacherRoute />}>
              <Route path="/create-course" element={<CreateCoursePage />} />
            </Route>

            {/* Nested Student Routes */}
            <Route element={<StudentRoute />}>
              <Route path="/my-courses" element={<MyCoursesPage />} />
            </Route>
          </Route>
          
          {/* Catch-all route to handle unknown URLs */}
          <Route path="*" element={<Navigate to="/login" />} />



         <Route element={<TeacherRoute />}>
              <Route path="/create-course" element={<CreateCoursePage />} />
              {/* ADD THIS NEW ROUTE */}
              <Route path="/assignment/:assignmentId/submissions" element={<SubmissionsPage />} />
         </Route>

        <Route path="/course/:courseId/forum" element={<ForumPage />} />
        <Route path="/thread/:threadId" element={<ThreadPage />} />

        </Routes>
      </div>
    </div>
  );
}