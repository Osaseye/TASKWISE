import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import AIAssistantButton from '../components/dashboard/AIAssistantButton';

const SettingsPage = () => {
  const [timezone, setTimezone] = useState('utc-8');
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="flex h-screen bg-[#111717] text-white overflow-hidden font-display">
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative flex flex-col items-center bg-[#111717]">
        {/* Header Container */}
        <div className="w-full max-w-[1024px] px-8 md:px-12 lg:px-16 py-8 flex flex-col gap-8">
          
          {/* Page Heading */}
          <div className="flex flex-col gap-2 border-b border-[#293738] pb-6">
            <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Settings</h1>
            <p className="text-text-subtle text-base font-normal">Manage your account preferences and configurations.</p>
          </div>

          {/* Profile Card */}
          <Link to="/profile" className="group block">
            <div className="bg-surface-dark border border-border-dark rounded-xl p-6 flex items-center gap-6 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1ec9d2] to-[#112021] flex items-center justify-center text-white text-xl font-bold border-2 border-[#293738] shadow-lg z-10">
                AM
              </div>
              <div className="flex-1 z-10">
                <h2 className="text-white text-xl font-bold group-hover:text-primary transition-colors">Alex Morgan</h2>
                <p className="text-text-subtle text-sm">alex.morgan@example.com</p>
              </div>
              <div className="z-10 flex items-center gap-2">
                <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">View Profile</span>
                <span className="material-symbols-outlined text-text-subtle group-hover:text-primary transition-colors">chevron_right</span>
              </div>
              
              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </Link>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Regional Preferences */}
            <div className="flex flex-col gap-4">
              <h2 className="text-white text-lg font-bold px-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">public</span>
                Regional
              </h2>
              <div className="bg-surface-dark border border-border-dark rounded-xl p-6 flex flex-col gap-6 h-full">
                <label className="flex flex-col gap-2">
                  <span className="text-white text-sm font-medium">Timezone</span>
                  <div className="relative">
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full appearance-none rounded-lg bg-[#111717] border border-border-dark focus:border-primary focus:ring-1 focus:ring-primary text-white h-11 px-4 pr-10 transition-all cursor-pointer text-sm"
                    >
                      <option value="utc-8">Pacific Time (US & Canada)</option>
                      <option value="utc-5">Eastern Time (US & Canada)</option>
                      <option value="utc+0">London (GMT+00:00)</option>
                      <option value="utc+1">Paris (GMT+01:00)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle pointer-events-none text-lg">expand_more</span>
                  </div>
                </label>
                
                <label className="flex flex-col gap-2">
                  <span className="text-white text-sm font-medium">Language</span>
                  <div className="relative">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full appearance-none rounded-lg bg-[#111717] border border-border-dark focus:border-primary focus:ring-1 focus:ring-primary text-white h-11 px-4 pr-10 transition-all cursor-pointer text-sm"
                    >
                      <option value="en">English (United States)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle pointer-events-none text-lg">expand_more</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Appearance */}
            <div className="flex flex-col gap-4">
              <h2 className="text-white text-lg font-bold px-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">palette</span>
                Appearance
              </h2>
              <div className="bg-surface-dark border border-border-dark rounded-xl p-6 flex flex-col gap-6 h-full">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-white text-sm font-medium">Dark Mode</span>
                    <span className="text-xs text-text-subtle">Easier on the eyes in low light.</span>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                    <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#293738]">
                  <div className="flex flex-col gap-1">
                    <span className="text-white text-sm font-medium">Compact Mode</span>
                    <span className="text-xs text-text-subtle">Show more content on screen.</span>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={compactMode}
                      onChange={(e) => setCompactMode(e.target.checked)}
                    />
                    <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex flex-col gap-4">
              <h2 className="text-white text-lg font-bold px-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">notifications</span>
                Notifications
              </h2>
              <div className="bg-surface-dark border border-border-dark rounded-xl p-6 flex flex-col gap-5 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">Email Alerts</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                    <div className="relative w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">Push Notifications</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                    />
                    <div className="relative w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">Marketing Emails</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={marketingEmails}
                      onChange={(e) => setMarketingEmails(e.target.checked)}
                    />
                    <div className="relative w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Security & Privacy */}
            <div className="flex flex-col gap-4">
              <h2 className="text-white text-lg font-bold px-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">security</span>
                Security
              </h2>
              <div className="bg-surface-dark border border-border-dark rounded-xl p-6 flex flex-col gap-5 h-full">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-white text-sm font-medium">Two-Factor Auth</span>
                    <span className="text-xs text-text-subtle">Add an extra layer of security.</span>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={twoFactor}
                      onChange={(e) => setTwoFactor(e.target.checked)}
                    />
                    <div className="relative w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-[#111717] border border-border-dark hover:border-primary/50 transition-colors group text-sm">
                  <span className="text-white font-medium">Change Password</span>
                  <span className="material-symbols-outlined text-text-subtle text-base group-hover:text-primary">arrow_forward</span>
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-[#111717] border border-border-dark hover:border-primary/50 transition-colors group text-sm">
                  <span className="text-white font-medium">Active Sessions</span>
                  <span className="material-symbols-outlined text-text-subtle text-base group-hover:text-primary">devices</span>
                </button>
              </div>
            </div>

            {/* Data & Support */}
            <div className="flex flex-col gap-4">
              <h2 className="text-white text-lg font-bold px-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">database</span>
                Data & Support
              </h2>
              <div className="bg-surface-dark border border-border-dark rounded-xl p-6 flex flex-col gap-4 h-full">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#111717] transition-colors text-left">
                  <span className="material-symbols-outlined text-text-subtle">download</span>
                  <span className="text-white text-sm font-medium">Export My Data</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#111717] transition-colors text-left">
                  <span className="material-symbols-outlined text-text-subtle">help</span>
                  <span className="text-white text-sm font-medium">Help Center</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#111717] transition-colors text-left">
                  <span className="material-symbols-outlined text-text-subtle">bug_report</span>
                  <span className="text-white text-sm font-medium">Report a Bug</span>
                </button>
              </div>
            </div>

            {/* Account Actions (Redesigned) */}
            <div className="flex flex-col gap-4">
              <h2 className="text-white text-lg font-bold px-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400">warning</span>
                Danger Zone
              </h2>
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 flex flex-col justify-center gap-4 h-full">
                <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-[#111717] border border-border-dark hover:bg-[#1c2626] transition-colors text-sm font-medium text-white">
                  <span className="material-symbols-outlined text-base">logout</span>
                  Log Out
                </button>
                
                <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors text-sm font-medium text-red-400">
                  <span className="material-symbols-outlined text-base">delete</span>
                  Delete Account
                </button>
              </div>
            </div>

          </div>

          <div className="text-center text-xs text-text-subtle pb-24">
            <p>TASKWISE v1.0.2 • © 2026 Taskwise Inc.</p>
          </div>

        </div>
      </main>

      <AIAssistantButton />
    </div>
  );
};

export default SettingsPage;
