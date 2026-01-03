import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const toggleAIAssistant = () => {
    setIsAIAssistantOpen(prev => !prev);
  };

  const openAIAssistant = () => setIsAIAssistantOpen(true);
  const closeAIAssistant = () => setIsAIAssistantOpen(false);

  return (
    <UIContext.Provider value={{ 
      isAIAssistantOpen, 
      toggleAIAssistant, 
      openAIAssistant, 
      closeAIAssistant 
    }}>
      {children}
    </UIContext.Provider>
  );
};
