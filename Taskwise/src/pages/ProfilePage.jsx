import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import AIAssistantButton from '../components/dashboard/AIAssistantButton';

const ProfilePage = () => {
  return (
    <div className="flex h-screen bg-background-dark overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="My Profile" />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-dark border border-white/5 rounded-2xl p-8"
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-accent-blue to-primary flex items-center justify-center text-white text-4xl font-bold border-4 border-background-dark shadow-lg mb-4">
                  AL
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Alex Doe</h2>
                <p className="text-gray-400">alex.doe@example.com</p>
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium">
                    Edit Profile
                  </button>
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-colors font-medium">
                    Change Password
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                      <div className="text-white">Alex Doe</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email</label>
                      <div className="text-white">alex.doe@example.com</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Phone</label>
                      <div className="text-white">+1 (555) 123-4567</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Location</label>
                      <div className="text-white">San Francisco, CA</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Account Statistics</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Member Since</label>
                      <div className="text-white">January 2024</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Plan</label>
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        Pro Plan
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Tasks Completed</label>
                      <div className="text-white">1,234</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </main>
      </div>
      
      <AIAssistantButton />
    </div>
  );
};

export default ProfilePage;
