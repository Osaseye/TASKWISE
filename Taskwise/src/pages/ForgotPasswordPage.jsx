import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdEmail, MdArrowBack, MdLockReset } from 'react-icons/md';

const ForgotPasswordPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-background-dark min-h-screen flex items-center justify-center p-4 antialiased selection:bg-primary selection:text-background-dark relative overflow-hidden font-body text-white"
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-blue-600/20 rounded-full blur-3xl opacity-30"></div>
      </div>
      
      <div className="w-full max-w-md">
        <div className="bg-surface-dark rounded-2xl shadow-xl border border-surface-border p-8 relative overflow-hidden backdrop-blur-sm bg-opacity-90">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-primary to-blue-400"></div>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-surface-border rounded-full flex items-center justify-center mx-auto mb-4 text-primary transform hover:scale-110 transition-transform duration-300">
              <MdLockReset className="text-3xl" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <form action="#" className="space-y-6" method="POST">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1" htmlFor="email">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="text-gray-400 text-xl" />
                </div>
                <input 
                  className="block w-full pl-10 pr-3 py-3 border border-surface-border rounded-xl bg-background-dark text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow sm:text-sm" 
                  id="email" 
                  name="email" 
                  placeholder="name@taskwise.ai" 
                  required 
                  type="email"
                />
              </div>
            </div>
            
            <button 
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-background-dark bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface-dark transition-all duration-200 transform hover:-translate-y-0.5" 
              type="submit"
            >
              Reset Password
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link 
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors group" 
              to="/login"
            >
              <MdArrowBack className="text-base mr-1 transform group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
        
        <p className="mt-6 text-center text-xs text-gray-500">
          © 2026 Taskwise AI Inc. All rights reserved.
        </p>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
