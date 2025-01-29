import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:5000', {
      auth: { token }
    });

    newSocket.on('new_message', (data) => {
      addNotification({
        type: 'message',
        title: 'New Message',
        content: `${data.senderName}: ${data.message}`,
        time: new Date(),
        read: false
      });
    });

    newSocket.on('friend_request', (data) => {
      addNotification({
        type: 'friend_request',
        title: 'Friend Request',
        content: `${data.senderName} sent you a friend request`,
        time: new Date(),
        read: false,
        requestId: data.requestId
      });
    });

    newSocket.on('course_enrollment', (data) => {
      addNotification({
        type: 'course',
        title: 'Course Enrollment',
        content: `You've been enrolled in ${data.courseName}`,
        time: new Date(),
        read: false
      });
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    message.info({
      content: notification.content,
      duration: 3
    });
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      socket
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext); 