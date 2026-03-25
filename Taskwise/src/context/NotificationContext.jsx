import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      setNotifications(notifs);
    }, (error) => {
      if (error.code === "permission-denied") {
        console.warn("Firestore permission denied. Notifications will not be synced. Check your Firebase security rules.");
      } else {
        console.error("Error fetching notifications:", error);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addNotification = async (notification) => {
    const toastFn =
      notification.type === "success" ? toast.success
      : notification.type === "error" ? toast.error
      : notification.type === "info"  ? toast.info
      : toast;

    toastFn(notification.title, {
      description: notification.message,
      duration: 5000,
    });

    if (currentUser) {
      try {
        await addDoc(collection(db, "notifications"), {
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
      const notifRef = doc(db, "notifications", id);
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;
    notifications.forEach(async (n) => {
      if (!n.read) {
        await markAsRead(n.id);
      }
    });
  };

  const removeNotification = async (id) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, "notifications", id));
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
    </NotificationContext.Provider>
  );
};
