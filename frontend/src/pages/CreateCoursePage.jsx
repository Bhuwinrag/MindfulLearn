import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/shared/Navbar.jsx';

const CreateCoursePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState(null); // ## ADDED: State for the image file
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ## UPDATED: Use FormData to handle file upload ##
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('duration', duration);
    if (image) {
      formData.append('courseImage', image); // 'courseImage' must match the backend route
    }

    try {
      // Send formData instead of a JSON object
      await api.post('/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Course created successfully! Redirecting...');
      setTimeout(() => navigate('/courses'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-slate-900 pt-[-4rem]">
        <div className="w-full max-w-2xl p-8 space-y-6 bg-slate-800 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-white">Create a New Course</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300">Course Title</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 mt-1 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" className="w-full px-3 py-2 mt-1 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-slate-300">Duration (e.g., "8 Weeks")</label>
              <input id="duration" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} required className="w-full px-3 py-2 mt-1 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            {/* ## ADDED: File input for the course image ## */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-slate-300">Course Image (Optional)</label>
              <input 
                id="image" 
                type="file" 
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])} 
                className="w-full mt-1 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer"
              />
            </div>

            <button type="submit" className="w-full py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              Create Course
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCoursePage;