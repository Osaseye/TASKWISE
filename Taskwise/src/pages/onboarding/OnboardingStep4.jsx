import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdTimer, MdAccessTime, MdGroup, MdDashboard, MdArrowForward, MdArrowBack, MdCheck } from 'react-icons/md';
import { useUser } from '../../context/UserContext';
import { FaSpinner } from 'react-icons/fa';

const styles = [
  { id: 'deep', label: 'Deep Work', description: 'Long, uninterrupted sessions', icon: MdTimer },
  { id: 'pomodoro', label: 'Pomodoro', description: 'Short bursts with breaks', icon: MdAccessTime },
  { id: 'collaborative', label: 'Collaborative', description: 'Team-focused & meetings', icon: MdGroup },
  { id: 'flexible', label: 'Flexible', description: 'Adaptable to changing needs', icon: MdDashboard },
];

const OnboardingStep4 = () => {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { updateOnboardingData, saveOnboardingData } = useUser();

  const handleComplete = async () => {
    if (!selectedStyle) return;
    
    setIsSaving(true);
    try {
      // Update the last piece of data
      updateOnboardingData({ workStyle: selectedStyle });
      
      // Save everything to Firestore
      await saveOnboardingData();
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/onboarding/step3');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased selection:bg-primary/30 selection:text-primary font-body"
    >
      {/* Left Column */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative bg-surface-dark flex-col justify-between p-12 border-r border-surface-border/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-transparent to-background-dark/90 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center opacity-60 mix-blend-overlay" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAG0u8A0VNlYUwgsJPJKtEwU4hsB5Ag0MjRR8TY_-mbZNeuDgOCb_xJk-x6Q8VTuqkltxN5k6Z_6oaCkX31E8YXUV9spYQSMEBymMYpkS3iNQxLn83jL5dvXYEZnXW2pZBJHEwBuZGJKvaYkg7-9nhdwldNelWMIEfmTc3DHIYhKl88hoDJk7jmvzhtkOpWQaHrN7G87y0B_5EYJz_TbDVDHQUHdVGdqV3ag7Y3TdDOXxsUBpFeBCA1qiyACjEBeMAlyibIdsnyuWEg')" }}
          >
          </div>
        </div>
        
        <div className="relative z-20">
          <div className="flex items-center gap-3 mb-8">
            <img src="/Taskwise-icon.png" alt="Taskwise Logo" className="w-10 h-10 rounded-xl shadow-lg" />
            <span className="text-xl font-bold tracking-tight text-white font-display">TASKWISE</span>
          </div>
        </div>
        
        <div className="relative z-20 max-w-md">
          <blockquote className="text-lg font-light leading-relaxed text-white mb-4 font-display">
            "We're almost there. Let's set up your workspace to match your rhythm."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-primary"></div>
            <p className="text-gray-400 text-sm font-medium">Your AI Companion</p>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col h-screen overflow-y-auto lg:overflow-hidden relative bg-background-light dark:bg-background-dark">
        <div className="lg:hidden p-6 flex items-center gap-2 border-b border-surface-border/30 dark:border-surface-border">
          <img src="/Taskwise-icon.png" alt="Taskwise Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-lg dark:text-white font-display">TASKWISE</span>
        </div>

        <div className="w-full px-6 py-8 md:px-12 md:py-10 flex justify-end">
          <div className="w-full max-w-[200px] flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Step 4 of 4</span>
              <span className="text-xs font-semibold text-primary">100%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-surface-border overflow-hidden">
              <motion.div 
                initial={{ width: "75%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full rounded-full bg-primary"
              ></motion.div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 pb-20 max-w-2xl mx-auto w-full">
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1] font-display">
                How do you <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">prefer to work?</span>
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                Choose the style that fits you best. You can always change this later.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-start gap-3 group text-left ${
                    selectedStyle === style.id 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-gray-200 dark:border-surface-border bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-400 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <div className="flex justify-between w-full items-start">
                    <style.icon className={`text-xl ${selectedStyle === style.id ? 'text-primary' : 'text-gray-400 group-hover:text-primary transition-colors'}`} />
                    {selectedStyle === style.id && <MdCheck className="text-primary text-xl" />}
                  </div>
                  <div>
                    <span className="font-bold block mb-1 text-gray-900 dark:text-white">{style.label}</span>
                    <span className="text-xs opacity-80">{style.description}</span>
                  </div>
                </button>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pt-4 flex flex-col sm:flex-row items-center gap-4"
            >
              <button 
                onClick={handleBack}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <MdArrowBack /> Back
              </button>
              <button 
                onClick={handleComplete}
                disabled={!selectedStyle || isSaving}
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-cyan-400 text-white dark:text-background-dark font-bold rounded-xl transition-all duration-200 transform active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Setting up...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Setup</span>
                    <MdArrowForward className="group-hover:translate-x-1 transition-transform text-xl" />
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OnboardingStep4;
