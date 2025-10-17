import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ title, children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full max-w-md p-8 space-y-6 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-white">{title}</h2>
        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;