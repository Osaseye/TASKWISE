import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import AIAssistantButton from '../components/dashboard/AIAssistantButton';

const SettingsPage = () => {
  return (
    <div className="flex h-screen bg-background-dark overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Settings" />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Profile Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-dark border border-white/5 rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-gray-400">edit</span>
              </div>
              
              <Link to="/profile" className="flex items-center gap-6 relative z-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-accent-blue to-primary flex items-center justify-center text-white text-2xl font-bold border-4 border-background-dark shadow-lg">
                  AL
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">Alex Doe</h2>
                  <p className="text-gray-400 mb-3">alex.doe@example.com</p>
                  <span className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                    Manage Profile <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </div>
              </Link>
              
              {/* Decorative background blur */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            </motion.div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Appearance */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-surface-dark border border-white/5 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <span className="material-symbols-outlined">palette</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Appearance</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">Customize the look and feel of your workspace.</p>
                <div className="flex items-center justify-between p-3 rounded-xl bg-background-dark border border-white/5">
                  <span className="text-sm text-gray-300">Theme</span>
                  <select className="bg-transparent text-sm text-white border-none focus:ring-0 cursor-pointer">
                    <option>Dark Mode</option>
                    <option>Light Mode</option>
                    <option>System</option>
                  </select>
                </div>
              </motion.div>

              {/* Notifications */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface-dark border border-white/5 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                    <span className="material-symbols-outlined">notifications</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Notifications</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">Manage how you receive alerts and updates.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Email Digest</span>
                    <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Push Notifications</span>
                    <div className="w-10 h-5 bg-gray-600 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Integrations */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-surface-dark border border-white/5 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <span className="material-symbols-outlined">extension</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Integrations</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">Connect with your favorite tools.</p>
                <button className="w-full py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm text-white transition-colors">
                  Manage Integrations
                </button>
              </motion.div>

              {/* Account Security */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-surface-dark border border-white/5 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                    <span className="material-symbols-outlined">security</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Security</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">Update password and security settings.</p>
                <button className="w-full py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm text-white transition-colors">
                  Change Password
                </button>
              </motion.div>
            </div>

            {/* Danger Zone */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="border border-red-500/20 rounded-2xl p-6 bg-red-500/5"
            >
              <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">Permanently delete your account and all data.</p>
                <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-colors">
                  Delete Account
                </button>
              </div>
            </motion.div>

          </div>
        </main>
      </div>
      <AIAssistantButton />
    </div>
  );
};

export default SettingsPage;
