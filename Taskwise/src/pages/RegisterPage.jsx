import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdPerson, MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FaGoogle, FaGithub, FaSpinner } from 'react-icons/fa';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/onboarding/step1');
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-background-dark min-h-screen flex items-center justify-center p-4 antialiased selection:bg-primary selection:text-background-dark relative overflow-hidden font-body text-white"
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4 relative">
            <img 
              src="/Taskwise-icon.png" 
              alt="Taskwise Logo" 
              className="w-16 h-16 rounded-xl shadow-lg transform rotate-0 hover:rotate-3 transition-transform duration-500" 
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">TASKWISE</h1>
          <p className="mt-2 text-sm text-gray-400">Plan smarter, achieve more.</p>
        </div>
        <div className="bg-surface-dark rounded-2xl shadow-xl border border-surface-border p-8 relative overflow-hidden backdrop-blur-sm bg-opacity-90">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-primary"></div>
          <h2 className="text-xl font-semibold text-white mb-6">Create your account</h2>
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="name">Full Name</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdPerson className="text-gray-400 text-xl" />
                </div>
                <input 
                  className="block w-full pl-10 pr-3 py-3 border-surface-border rounded-lg leading-5 bg-background-dark text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-shadow duration-200" 
                  id="name" 
                  name="name" 
                  placeholder="John Doe" 
                  required 
                  type="text"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email address</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="text-gray-400 text-xl" />
                </div>
                <input 
                  className="block w-full pl-10 pr-3 py-3 border-surface-border rounded-lg leading-5 bg-background-dark text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-shadow duration-200" 
                  id="email" 
                  name="email" 
                  placeholder="you@example.com" 
                  required 
                  type="email"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
              <div className="relative rounded-md shadow-sm group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLock className="text-gray-400 text-xl" />
                </div>
                <input 
                  className="block w-full pl-10 pr-10 py-3 border-surface-border rounded-lg leading-5 bg-background-dark text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-shadow duration-200" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? "text" : "password"} 
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <MdVisibility className="text-gray-400 hover:text-gray-200 transition-colors text-xl" />
                  ) : (
                    <MdVisibilityOff className="text-gray-400 hover:text-gray-200 transition-colors text-xl" />
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-400">Must be at least 8 characters.</p>
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input 
                  className="h-4 w-4 text-primary focus:ring-primary border-surface-border rounded bg-background-dark" 
                  id="terms" 
                  name="terms" 
                  type="checkbox"
                />
              </div>
              <div className="ml-2 text-sm">
                <label className="font-medium text-gray-300" htmlFor="terms">
                  I agree to the <a className="text-primary hover:text-secondary hover:underline" href="#">Terms</a> and <a className="text-primary hover:text-secondary hover:underline" href="#">Privacy Policy</a>.
                </label>
              </div>
            </div>
            <div>
              <button 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-background-dark bg-gradient-to-r from-primary to-blue-400 hover:from-primary-dark hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface-dark transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin h-5 w-5 text-background-dark" />
                ) : (
                  "Get Started"
                )}
              </button>
            </div>
          </form>
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface-dark text-gray-400">Or continue with</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button 
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-surface-border rounded-lg shadow-sm bg-background-dark text-sm font-medium text-gray-200 hover:bg-surface-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface-dark transition-colors" 
                type="button"
              >
                <FaGoogle className="h-5 w-5" />
                <span className="ml-2">Google</span>
              </button>
              <button 
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-surface-border rounded-lg shadow-sm bg-background-dark text-sm font-medium text-gray-200 hover:bg-surface-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface-dark transition-colors" 
                type="button"
              >
                <FaGithub className="h-5 w-5" />
                <span className="ml-2">GitHub</span>
              </button>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-gray-400">
            Already have an account?{' '}
            <Link className="font-semibold text-primary hover:text-primary-dark transition-colors" to="/login">
              Sign in
            </Link>
          </p>
        </div>
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2026 TASKWISE Inc. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <a className="text-xs text-gray-500 hover:text-gray-300" href="#">Privacy</a>
            <a className="text-xs text-gray-500 hover:text-gray-300" href="#">Terms</a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
