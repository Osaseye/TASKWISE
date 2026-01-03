import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import StatsRow from '../components/dashboard/StatsRow';
import TodaysFocus from '../components/dashboard/TodaysFocus';
import UpcomingTasks from '../components/dashboard/UpcomingTasks';
import AIAssistantButton from '../components/dashboard/AIAssistantButton';

const DashboardPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased h-screen overflow-hidden flex selection:bg-primary selection:text-background-dark"
    >
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto relative custom-scrollbar">
        <Header />

        {/* Dashboard Content */}
        <div className="px-6 md:px-8 pb-20">
          <StatsRow />

          {/* Main Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-6">
            <TodaysFocus />
            <UpcomingTasks />
          </div>
        </div>
        {/* Background decorative gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      </main>
      <AIAssistantButton />
    </motion.div>
  );
};

export default DashboardPage;
