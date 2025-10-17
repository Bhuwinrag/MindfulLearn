import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const StudentAnalysisModal = ({ student, report, isLoading, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-slate-800 border border-white/20 rounded-2xl shadow-xl w-full max-w-2xl p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X />
          </button>
          <h2 className="text-2xl font-bold text-white mb-4">AI Performance Analysis: {student?.name}</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
            </div>
          ) : (
            <div className="text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/50 p-4 rounded-lg max-h-[60vh] overflow-y-auto">
              {report}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentAnalysisModal;