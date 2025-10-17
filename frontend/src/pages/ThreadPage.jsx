import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/shared/Navbar';
import { motion } from 'framer-motion';

const ThreadPage = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const { data } = await api.get(`/forums/threads/${threadId}`);
        setThread(data.thread);
        setPosts(data.posts);
      } catch (error) {
        console.error('Failed to fetch thread', error);
      } finally {
        setLoading(false);
      }
    };
    fetchThread();
  }, [threadId]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/forums/posts', { content: replyContent, threadId });
      setPosts([...posts, data]);
      setReplyContent('');
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  if (loading) return <div className="text-white text-center">Loading...</div>;
  if (!thread) return <div className="text-white text-center">Thread not found.</div>;

  return (
    <>
      <Navbar />
      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        {/* Original Thread Post */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-white">{thread.title}</h1>
          <p className="text-sm text-slate-400 mt-2">By {thread.author.name} on {new Date(thread.createdAt).toLocaleDateString()}</p>
          <p className="text-slate-200 mt-4 whitespace-pre-wrap">{thread.content}</p>
        </div>

        {/* Replies */}
        <h2 className="text-2xl font-bold text-white mb-4">Replies</h2>
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post._id} className="bg-slate-800/60 p-4 rounded-lg">
              <p className="text-sm text-slate-400">{post.author.name} replied on {new Date(post.createdAt).toLocaleDateString()}</p>
              <p className="text-slate-200 mt-2 whitespace-pre-wrap">{post.content}</p>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        <div className="mt-8">
          <form onSubmit={handleCreatePost} className="space-y-4">
            <h3 className="text-xl font-bold text-white">Your Reply</h3>
            <div>
              <textarea placeholder="Write your reply..." value={replyContent} onChange={(e) => setReplyContent(e.target.value)} required rows="4" className="w-full bg-slate-800/60 p-2 rounded-md text-white" />
            </div>
            <button type="submit" className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Post Reply</button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default ThreadPage;