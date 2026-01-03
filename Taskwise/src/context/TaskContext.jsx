import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  // Initial dummy data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Review Q3 Financial Reports',
      priority: 'High',
      time: '2:00 PM',
      category: 'Finance',
      completed: false,
    },
    {
      id: 2,
      title: 'Team Sync Meeting',
      priority: 'Medium',
      time: '4:30 PM',
      category: 'Team',
      completed: false,
    },
    {
      id: 3,
      title: 'Update Project Documentation',
      priority: 'Low',
      time: '11:00 AM',
      category: 'Documentation',
      completed: true,
    }
  ]);

  const [stats, setStats] = useState({
    completionRate: 78,
    focusTime: '4h 12m',
    deepWork: '4.5 hrs'
  });

  // Calculate stats based on tasks
  useEffect(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const rate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    
    setStats(prev => ({
      ...prev,
      completionRate: rate
    }));
  }, [tasks]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (task) => {
    setTasks(prev => [...prev, { ...task, id: Date.now(), completed: false }]);
  };

  const updateTask = (id, updatedData) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updatedData } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const value = {
    tasks,
    stats,
    toggleTask,
    addTask,
    updateTask,
    deleteTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
