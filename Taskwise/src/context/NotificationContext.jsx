import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const Toast = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-24 left-4 right-4 md:left-auto md:bottom-6 md:right-6 z-[100] bg-[#1c2a2b] border border-[#3d5152] rounded-xl shadow-2xl p-4 flex items-start gap-3 md:max-w-sm backdrop-blur-md"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        notification.type === 'success' ? 'bg-primary/20 text-primary' :
        notification.type === 'error' ? 'bg-red-500/20 text-red-500' :
        'bg-blue-500/20 text-blue-500'
      }`}>
        <span className="material-symbols-outlined text-[18px]">
          {notification.type === 'success' ? 'check_circle' :
           notification.type === 'error' ? 'error' :
           'notifications'}
        </span>
      </div>
      <div className="flex-1">
        <h4 className="text-white font-bold text-sm">{notification.title}</h4>
        <p className="text-[#9eb6b7] text-xs mt-1 leading-relaxed">{notification.message}</p>
      </div>
      <button 
        onClick={onClose}
        className="text-[#5f7475] hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </motion.div>
  );
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => {
        // Client-side sort
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      setNotifications(notifs);
    }, (error) => {
      if (error.code === 'permission-denied') {
        console.warn("Firestore permission denied. Notifications will not be synced. Check your Firebase security rules.");
      } else {
        console.error("Error fetching notifications:", error);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addNotification = async (notification) => {
    // Show toast immediately for better UX
    setToast({ ...notification, id: Date.now() });

    if (currentUser) {
      try {
        await addDoc(collection(db, 'notifications'), {
          ...notification,
          userId: currentUser.uid,
          read: false,
          createdAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Error adding notification:", error);
      }
    }
  };

  const markAsRead = async (id) => {
    if (!currentUser) return;
    try {
      const notifRef = doc(db, 'notifications', id);
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;
    // Batch update would be better here, but for simplicity we'll iterate
    // In a real app, use a batch write
    notifications.forEach(async (n) => {
      if (!n.read) {
        await markAsRead(n.id);
      }
    });
  };

  const removeNotification = async (id) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      markAsRead, 
      markAllAsRead, 
      removeNotification 
    }}>
      {children}
      <AnimatePresence>
        {toast && (
          <Toast 
            key={toast.id} 
            notification={toast} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};
