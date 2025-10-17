import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/shared/Navbar';
import { motion } from 'framer-motion';

const ForumPage = () => {
  const { courseId } = useParams();
  const [threads, setThreads] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const { data } = await api.get(`/forums/threads/course/${courseId}`);
        setThreads(data);
      } catch (error) {
        console.error('Failed to fetch threads', error);
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, [courseId]);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/forums/threads', { title, content, courseId });
      setThreads([data, ...threads]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Failed to create thread', error);
    }
  };

  if (loading) return <div className="text-white text-center">Loading...</div>;

  return (
    <>
      <Navbar />
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <h1 className="text-4xl font-bold text-white mb-8">Discussion Forum</h1>
        
        {/* Create new thread form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleCreateThread} className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Start a New Discussion</h2>
            <div>
              <input type="text" placeholder="Discussion Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-slate-800/60 p-2 rounded-md text-white" />
            </div>
            <div>
              <textarea placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} required rows="3" className="w-full bg-slate-800/60 p-2 rounded-md text-white" />
            </div>
            <button type="submit" className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Post Thread</button>
          </form>
        </div>

        {/* List of threads */}
        <div className="space-y-4">
          {threads.length > 0 ? threads.map(thread => (
            <Link to={`/thread/${thread._id}`} key={thread._id} className="block bg-slate-800/60 p-4 rounded-lg hover:bg-slate-700/80">
              <h3 className="text-xl font-semibold text-white">{thread.title}</h3>
              <p className="text-sm text-slate-400">By {thread.author.name} on {new Date(thread.createdAt).toLocaleDateString()}</p>
            </Link>
          )) : <p className="text-slate-400">No discussions yet. Be the first to start one!</p>}
        </div>
      </motion.div>
    </>
  );
};

export default ForumPage;