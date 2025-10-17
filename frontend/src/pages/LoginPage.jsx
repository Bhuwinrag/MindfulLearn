import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: 'url("/images/login-background.jpg")' }}
    >
      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 sm:p-10 w-full max-w-md border border-white/20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-8">Login to Your Account</h2>
        
        {/* THIS IS THE FIX: Replaced the broken placeholder with the actual error display */}
        {error && (
          <motion.p 
            className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email" id="email"
              className="w-full px-4 py-2 bg-slate-800/60 rounded-md text-white placeholder-slate-500 border border-transparent focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="your@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
              required disabled={loading}
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full px-4 py-2 bg-slate-800/60 rounded-md text-white placeholder-slate-500 border border-transparent focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
              required disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-6 flex items-center px-3 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;