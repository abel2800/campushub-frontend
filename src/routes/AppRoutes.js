import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import HomePage from '../components/HomePage';
import CoursePage from '../components/CoursesPage';
import SocialMediaPage from '../components/SocialMeadiaPage';
import ChatPage from '../components/chat';
import FriendsPage from '../pages/friendsPage';
import CreateAccount from '../components/CreateAccount';
import Login from '../components/Login';
import AddFriend from '../components/AddFriend';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/social-media" element={<SocialMediaPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/add-friend" element={<AddFriend />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to landing page if route not found */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;