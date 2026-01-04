import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdBadge, MdAutoAwesome, MdArrowForward } from 'react-icons/md';
import { useUser } from '../../context/UserContext';

const OnboardingStep1 = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { updateOnboardingData } = useUser();

  const handleContinue = () => {
    if (name.trim()) {
      updateOnboardingData({ name });
      navigate('/onboarding/step2');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased selection:bg-primary/30 selection:text-primary font-body"
    >
      {/* Left Column: Visual / AI Representation */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative bg-surface-dark flex-col justify-between p-12 border-r border-surface-border/50">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-transparent to-background-dark/90 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center opacity-60 mix-blend-overlay" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAG0u8A0VNlYUwgsJPJKtEwU4hsB5Ag0MjRR8TY_-mbZNeuDgOCb_xJk-x6Q8VTuqkltxN5k6Z_6oaCkX31E8YXUV9spYQSMEBymMYpkS3iNQxLn83jL5dvXYEZnXW2pZBJHEwBuZGJKvaYkg7-9nhdwldNelWMIEfmTc3DHIYhKl88hoDJk7jmvzhtkOpWQaHrN7G87y0B_5EYJz_TbDVDHQUHdVGdqV3ag7Y3TdDOXxsUBpFeBCA1qiyACjEBeMAlyibIdsnyuWEg')" }}
          >
          </div>
        </div>
        
        {/* Content on top of image */}
        <div className="relative z-20">
          <div className="flex items-center gap-3 mb-8">
            <img src="/Taskwise-icon.png" alt="Taskwise Logo" className="w-10 h-10 rounded-xl shadow-lg" />
            <span className="text-xl font-bold tracking-tight text-white font-display">TASKWISE</span>
          </div>
        </div>
        
        <div className="relative z-20 max-w-md">
          <blockquote className="text-lg font-light leading-relaxed text-white mb-4 font-display">
            "Success is not about doing more, but about focusing on what matters. Let us handle the noise."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-primary"></div>
            <p className="text-gray-400 text-sm font-medium">Your AI Companion</p>
          </div>
        </div>
      </div>

      {/* Right Column: Interaction Form */}
      <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col h-screen overflow-y-auto lg:overflow-hidden relative bg-background-light dark:bg-background-dark">
        {/* Mobile Logo (visible only on small screens) */}
        <div className="lg:hidden p-6 flex items-center gap-2 border-b border-surface-border/30 dark:border-surface-border">
          <img src="/Taskwise-icon.png" alt="Taskwise Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-lg dark:text-white font-display">TASKWISE</span>
        </div>

        {/* Header / Progress Area */}
        <div className="w-full px-6 py-8 md:px-12 md:py-10 flex justify-end">
          <div className="w-full max-w-[200px] flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Step 1 of 4</span>
              <span className="text-xs font-semibold text-primary">25%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-surface-border overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "25%" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full rounded-full bg-primary"
              ></motion.div>
            </div>
          </div>
        </div>

        {/* Main Form Content */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 pb-20 max-w-2xl mx-auto w-full">
          <div className="space-y-8">
            {/* Heading Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1] font-display">
                Let's get <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">acquainted.</span>
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                Taskwise is designed to adapt to your workflow. To start personalizing your experience, how would you like to be addressed?
              </p>
            </motion.div>

            {/* Input Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="preferredName">
                  Preferred Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdBadge className="text-gray-500 group-focus-within:text-primary transition-colors duration-300 text-xl" />
                  </div>
                  <input 
                    autoComplete="off" 
                    autoFocus 
                    className="block w-full rounded-xl border-gray-300 dark:border-surface-border bg-white dark:bg-surface-dark pl-12 pr-4 py-4 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 shadow-sm outline-none" 
                    id="preferredName" 
                    name="preferredName" 
                    placeholder="e.g. Alex" 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {/* Context / Meta Text */}
                <div className="flex items-start gap-2 pt-2">
                  <MdAutoAwesome className="text-primary text-[18px] mt-0.5" />
                  <p className="text-sm text-gray-500 leading-snug">
                    Our AI assistant will use this name to personalize your daily briefings and task summaries.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pt-4"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={handleContinue}
                  className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-cyan-400 text-white dark:text-background-dark font-bold rounded-xl transition-all duration-200 transform active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                >
                  Continue
                  <MdArrowForward className="group-hover:translate-x-1 transition-transform text-xl" />
                </button>
                <button className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors py-2 px-4 rounded-lg">
                  Skip for now
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3   ml-1">
                Need help? <a className="text-primary hover:underline" href="#">Contact Support</a>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OnboardingStep1;
