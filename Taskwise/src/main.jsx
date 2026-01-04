import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
          </TaskProvider>
        </UserProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)
