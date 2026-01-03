import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskConfirmationModal from './TaskConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { addTask, tasks } = useTasks();
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingText, setLoadingText] = useState('Processing...');

  const pendingTasksCount = tasks.filter(t => !t.completed).length;

  useEffect(() => {
    let interval;
    if (isProcessing) {
      const texts = ['Analyzing request...', 'Extracting details...', 'Scheduling task...'];
      let i = 0;
      setLoadingText(texts[0]);
      interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleNLP = async () => {
    if (!inputValue.trim()) return;

    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Mock parsing logic - in a real app this would call an API
      const mockParsed = {
        title: inputValue,
        time: '9:00 AM', // Default or extracted
        priority: 'Medium',
        category: 'General'
      };
      
      // Simple keyword extraction for demo
      if (inputValue.toLowerCase().includes('urgent') || inputValue.toLowerCase().includes('important')) {
        mockParsed.priority = 'High';
      }
      if (inputValue.toLowerCase().includes('meeting')) {
        mockParsed.category = 'Work';
      }
      
      setParsedData(mockParsed);
      setIsProcessing(false);
      setShowModal(true);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleNLP();
    }
  };

  const handleConfirm = (data) => {
    addTask(data);
    setShowModal(false);
    setInputValue('');
    setParsedData(null);
  };

  return (
    <header className="pt-6 px-6 pb-4 md:px-8 flex flex-col gap-4 shrink-0 z-10 relative">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">Good Morning, Alex</h2>
          <p className="text-text-secondary text-sm">You have {pendingTasksCount} tasks pending today. Stay focused.</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-[#293738] hover:bg-[#3d5152] flex items-center justify-center text-white transition-colors relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-primary border border-[#293738]"></span>
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 bg-[#1c2a2b] border border-[#3d5152] rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-[#293738] flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white">Notifications</h4>
                  <button className="text-[10px] text-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-3 hover:bg-[#293738]/50 transition-colors cursor-pointer border-b border-[#293738]/50">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0"></div>
                      <div>
                        <p className="text-xs text-white font-medium">Meeting in 15 mins</p>
                        <p className="text-[10px] text-text-secondary mt-0.5">Team Sync • 4:30 PM</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-[#293738]/50 transition-colors cursor-pointer">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-accent-blue shrink-0"></div>
                      <div>
                        <p className="text-xs text-white font-medium">New feature available</p>
                        <p className="text-[10px] text-text-secondary mt-0.5">Try the new AI insights dashboard</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* NLP Input */}
      <div className="w-full max-w-3xl mx-auto relative group z-0">
        <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-blue/20 to-primary/20 rounded-xl blur opacity-30 transition-opacity ${isProcessing ? 'animate-pulse opacity-80' : 'group-hover:opacity-60'}`}></div>
        <div className={`relative bg-[#1c2a2b] border ${isProcessing ? 'border-primary/50' : 'border-[#3d5152]'} rounded-xl flex items-center shadow-lg focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all overflow-hidden`}>
          
          {/* Loading Progress Bar */}
          {isProcessing && (
            <motion.div 
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent-blue to-primary w-full"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          )}

          <div className={`pl-4 text-primary ${isProcessing ? 'animate-spin' : 'animate-pulse'}`}>
            <span className="material-symbols-outlined text-[20px]">
              {isProcessing ? 'sync' : 'auto_awesome'}
            </span>
          </div>
          <input 
            className="w-full bg-transparent border-none text-white placeholder-text-secondary/70 px-4 py-3 focus:ring-0 text-sm md:text-base font-light outline-none" 
            placeholder={isProcessing ? loadingText : "What would you like to achieve today? Type 'Meeting with team at 2pm'..."}
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
          <div className="pr-2 flex items-center gap-1">
            <button 
              className="text-text-secondary hover:text-white p-1.5 rounded-lg transition-colors"
              title="Voice Input"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
            <button 
              onClick={handleNLP}
              disabled={!inputValue.trim() || isProcessing}
              className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                !inputValue.trim() || isProcessing 
                  ? 'bg-[#293738] text-text-secondary cursor-not-allowed' 
                  : 'bg-[#293738] hover:bg-primary hover:text-[#111717] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>

      <TaskConfirmationModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        initialData={parsedData}
      />
    </header>
  );
};

export default Header;
