import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import LandingPage from './components/LandingPage';
import CreateAccount from './components/CreateAccount';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { NotificationProvider } from './context/NotificationContext';
import Chat from './components/ChatPage';

function App() {
  return (
    <ConfigProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NotificationProvider>
    </ConfigProvider>
  );
}

export default App;