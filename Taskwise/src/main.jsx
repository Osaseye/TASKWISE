import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.jsx'
import { TaskProvider } from './context/TaskContext.jsx'
import { NotificationProvider } from './context/NotificationContext'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <UserProvider>
          <TaskProvider>
            <App />
            <Toaster position="bottom-right" richColors />
          </TaskProvider>
        </UserProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)
