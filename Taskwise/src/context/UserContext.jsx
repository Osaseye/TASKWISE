import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useNotifications } from './NotificationContext';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Temporary storage for onboarding data before saving
  const [onboardingData, setOnboardingData] = useState({
    name: '',
    role: '',
    goals: [],
    workStyle: ''
  });

  useEffect(() => {
    if (!currentUser) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userRef = doc(db, 'users', currentUser.uid);

    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      } else {
        // User document doesn't exist yet (new user)
        setUserProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user profile:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const updateOnboardingData = (data) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const saveOnboardingData = async () => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const finalData = {
        ...onboardingData,
        email: currentUser.email,
        createdAt: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isOnboarded: true
      };

      await setDoc(userRef, finalData, { merge: true });
      
      addNotification({
        title: 'Setup Complete',
        message: 'Your profile has been created.',
        type: 'success'
      });
      
      // Update local profile immediately to avoid flicker
      setUserProfile(finalData);
      
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      addNotification({
        title: 'Error',
        message: 'Failed to save profile data.',
        type: 'error'
      });
      throw error;
    }
  };

  const updateUserProfile = async (data) => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, data);
      
      addNotification({
        title: 'Profile Updated',
        message: 'Your changes have been saved.',
        type: 'success'
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      addNotification({
        title: 'Error',
        message: 'Failed to update profile.',
        type: 'error'
      });
      throw error;
    }
  };

  const value = {
    userProfile,
    loading,
    onboardingData,
    updateOnboardingData,
    saveOnboardingData,
    updateUserProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
