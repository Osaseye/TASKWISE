import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TaskDetailsModal from './TaskDetailsModal';

const UpcomingTasks = () => {
  const [selectedTask, setSelectedTask] = useState(null);

  // Mock data for upcoming tasks
  const upcomingTasks = [
    {
      id: 'u1',
      title: 'Dentist Appointment',
      time: '9:00 AM - 10:00 AM',
      date: 'Tomorrow',
      category: 'Personal',
      priority: 'Medium',
      color: 'bg-accent-purple'
    },
    {
      id: 'u2',
      title: 'Buy Milk & Coffee',
      time: 'After work',
      date: 'Tomorrow',
      category: 'Shopping',
      priority: 'Low',
      color: 'bg-primary'
    },
    {
      id: 'u3',
      title: 'Project Alpha Deadline',
      time: '5:00 PM',
      date: 'Friday, Oct 24',
      category: 'Work',
      priority: 'High',
      description: 'Critical deadline for the Alpha phase.',
      color: 'bg-red-500'
    },
    {
      id: 'u4',
      title: 'Weekly Retrospective',
      time: '11:00 AM',
      date: 'Friday, Oct 24',
      category: 'Work',
      priority: 'Medium',
      color: 'bg-accent-blue'
    }
  ];

  return (
    <div className="lg:col-span-1 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Upcoming</h3>
        <a className="text-xs text-primary hover:text-primary-dark font-medium" href="#">View All</a>
      </div>
      
      {/* Removed overflow-hidden to prevent hover clipping */}
      <div className="bg-surface-dark border border-[#293738] rounded-xl p-1 h-full flex flex-col">
        {/* Date Header 1 */}
        <div className="px-3 py-2 bg-[#293738]/50 border-b border-[#293738] rounded-t-lg">
          <p className="text-xs font-semibold text-white">Tomorrow</p>
        </div>
        <div className="p-1.5">
          {upcomingTasks.slice(0, 2).map(task => (
            <motion.div 
              key={task.id}
              whileHover={{ x: 4, backgroundColor: '#293738' }}
              onClick={() => setSelectedTask(task)}
              className="group flex items-start gap-2 p-2 rounded-lg transition-colors cursor-pointer"
            >
              <div className={`mt-0.5 min-w-[3px] h-3 ${task.color} rounded-full`}></div>
              <div>
                <p className="text-white text-xs font-medium mb-0.5">{task.title}</p>
                <p className="text-text-secondary text-[10px]">{task.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Date Header 2 */}
        <div className="px-3 py-2 bg-[#293738]/50 border-b border-[#293738] border-t">
          <p className="text-xs font-semibold text-white">Friday, Oct 24</p>
        </div>
        <div className="p-1.5">
          {upcomingTasks.slice(2, 4).map(task => (
            <motion.div 
              key={task.id}
              whileHover={{ x: 4, backgroundColor: '#293738' }}
              onClick={() => setSelectedTask(task)}
              className="group flex items-start gap-2 p-2 rounded-lg transition-colors cursor-pointer"
            >
              <div className={`mt-0.5 min-w-[3px] h-3 ${task.color} rounded-full`}></div>
              <div>
                <p className="text-white text-xs font-medium mb-0.5">{task.title}</p>
                <p className="text-text-secondary text-[10px]">{task.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Empty State Illustration Placeholder (Conceptual) */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 opacity-40 min-h-[50px]">
          <span className="material-symbols-outlined text-3xl text-text-secondary mb-1">event_available</span>
          <p className="text-[10px] text-text-secondary text-center">Plan ahead to stay relaxed.</p>
        </div>
      </div>

      <TaskDetailsModal 
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
    </div>
  );
};

export default UpcomingTasks;
