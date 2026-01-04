import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';

const TaskContext = createContext();

const calculateNextDueDate = (currentDateStr, recurrence) => {
  const date = currentDateStr ? new Date(currentDateStr) : new Date();
  
  switch (recurrence.type) {
    case 'daily':
      date.setDate(date.getDate() + (recurrence.interval || 1));
      break;
    case 'weekly':
      date.setDate(date.getDate() + (recurrence.interval || 1) * 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + (recurrence.interval || 1));
      break;
    default:
      return null;
  }
  return date.toISOString();
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const { addNotification } = useNotifications();
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    completionRate: 0,
    focusTime: '0h 0m',
    deepWork: '0 hrs'
  });

  // Fetch tasks from Firestore
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => {
        // Client-side sort by createdAt desc
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tasks:", error);
      addNotification({
        title: 'Error',
        message: 'Failed to load tasks.',
        type: 'error'
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Calculate stats based on tasks
  useEffect(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed);
    const rate = totalTasks === 0 ? 0 : Math.round((completedTasks.length / totalTasks) * 100);
    
    // Calculate Streak
    let currentStreak = 0;
    
    if (completedTasks.length > 0) {
      // Get unique dates of completed tasks
      const completedDates = [...new Set(completedTasks.map(task => {
        if (!task.completedAt) return null;
        const date = task.completedAt.toDate ? task.completedAt.toDate() : new Date(task.completedAt);
        return date.toDateString();
      }).filter(Boolean))];

      // Sort dates descending (newest first)
      completedDates.sort((a, b) => new Date(b) - new Date(a));

      // Check if today or yesterday is in the list to start the streak
      const today = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      // Streak is active if we completed a task today or yesterday
      if (completedDates.includes(today) || completedDates.includes(yesterdayStr)) {
        currentStreak = 1;
        // Start checking from the most recent valid streak day
        let currentDate = new Date(completedDates.includes(today) ? today : yesterdayStr);
        
        // Check previous days
        while (true) {
          currentDate.setDate(currentDate.getDate() - 1);
          if (completedDates.includes(currentDate.toDateString())) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }
    
    setStats(prev => ({
      ...prev,
      completionRate: rate,
      currentStreak,
      bestStreak: Math.max(currentStreak, prev.bestStreak || 0)
    }));
  }, [tasks]);

  const toggleTask = async (id) => {
    try {
      const taskToToggle = tasks.find(t => t.id === id);
      if (!taskToToggle) return;

      const newStatus = !taskToToggle.completed;
      const taskRef = doc(db, 'tasks', id);
      
      await updateDoc(taskRef, {
        completed: newStatus,
        completedAt: newStatus ? serverTimestamp() : null
      });

      // Handle Recurrence Logic
      if (newStatus && taskToToggle.recurrence) {
        try {
          const nextDueDate = calculateNextDueDate(taskToToggle.dueDate, taskToToggle.recurrence);
          
          if (nextDueDate) {
            // Remove ID and system fields from the copy
            const { id, completed, completedAt, createdAt, ...taskData } = taskToToggle;
            
            await addDoc(collection(db, 'tasks'), {
              ...taskData,
              userId: currentUser.uid,
              completed: false,
              createdAt: serverTimestamp(),
              dueDate: nextDueDate
            });
            
            addNotification({
              title: 'Recurring Task',
              message: 'Next instance scheduled automatically.',
              type: 'info'
            });
          }
        } catch (recError) {
          console.error("Error creating recurring task:", recError);
        }
      }

      if (newStatus) {
        addNotification({
          title: 'Task Completed',
          message: `You completed "${taskToToggle.title}"`,
          type: 'success'
        });
      }
    } catch (error) {
      console.error("Error toggling task:", error);
      addNotification({
        title: 'Error',
        message: 'Failed to update task status.',
        type: 'error'
      });
    }
  };

  const addTask = async (task) => {
    if (!currentUser) {
      addNotification({
        title: 'Error',
        message: 'You must be logged in to add tasks.',
        type: 'error'
      });
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), {
        ...task,
        userId: currentUser.uid,
        completed: false,
        createdAt: serverTimestamp()
      });

      addNotification({
        title: 'Task Created',
        message: `"${task.title}" has been added to your list.`,
        type: 'success'
      });
    } catch (error) {
      console.error("Error adding task:", error);
      addNotification({
        title: 'Error',
        message: 'Failed to create task.',
        type: 'error'
      });
    }
  };

  const updateTask = async (id, updatedData) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, updatedData);
      
      addNotification({
        title: 'Task Updated',
        message: 'Task details have been updated.',
        type: 'success'
      });
    } catch (error) {
      console.error("Error updating task:", error);
      addNotification({
        title: 'Error',
        message: 'Failed to update task.',
        type: 'error'
      });
    }
  };

  const deleteTask = async (id) => {
    try {
      const taskToDelete = tasks.find(t => t.id === id);
      await deleteDoc(doc(db, 'tasks', id));
      
      if (taskToDelete) {
        addNotification({
          title: 'Task Deleted',
          message: `"${taskToDelete.title}" has been removed.`,
          type: 'info'
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      addNotification({
        title: 'Error',
        message: 'Failed to delete task.',
        type: 'error'
      });
    }
  };

  const processAICommand = async (command) => {
    if (!currentUser) {
      addNotification({
        title: 'Error',
        message: 'You must be logged in to use AI features.',
        type: 'error'
      });
      return;
    }

    try {
      const { aiService } = await import('../services/aiService');
      const taskData = await aiService.parseTaskCommand(command);
      await addTask(taskData);
      return taskData;
    } catch (error) {
      console.error("AI Command Error:", error);
      addNotification({
        title: 'AI Error',
        message: 'Failed to process command.',
        type: 'error'
      });
      throw error;
    }
  };

  const value = {
    tasks,
    stats,
    loading,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    processAICommand
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
