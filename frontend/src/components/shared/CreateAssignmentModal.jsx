import React, { useState } from 'react';
import api from '../../services/api';

const CreateAssignmentModal = ({ courseId, onClose, onAssignmentCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/assignments', { title, description, dueDate, courseId });
      onAssignmentCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assignment.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-white mb-6">New Assignment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields for title, description, dueDate */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300">Title</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full mt-1 bg-slate-700 p-2 rounded-md"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full mt-1 bg-slate-700 p-2 rounded-md"/>
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-slate-300">Due Date</label>
            <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="w-full mt-1 bg-slate-700 p-2 rounded-md"/>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 rounded-md hover:bg-slate-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignmentModal;