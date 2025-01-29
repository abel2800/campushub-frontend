import React from 'react';
import { List, Avatar, Button, Space } from 'antd';
import { MessageOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const FriendsList = ({ friends = [], onFriendRemoved }) => {
  const navigate = useNavigate();

  const handleMessage = async (friend) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // First try to get existing chat or create new one
      const response = await axios.post('/api/messages/create', {
        participantId: friend.friend.id
      });

      // Navigate to chat page with friend data
      navigate('/chat', {
        state: {
          participant: friend.friend,
          messages: response.data ? [response.data] : []
        },
        replace: false
      });
    } catch (error) {
      console.error('Error starting chat:', error);
      // Show error toast but don't redirect
      if (error.response?.status === 401) {
        toast.error('Please log in again');
        navigate('/login');
      } else {
        toast.error('Failed to start chat. Please try again.');
      }
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await axios.delete(`/api/friends/${friendId}`);
      onFriendRemoved(friendId);
      toast.success('Friend removed successfully');
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Failed to remove friend');
    }
  };

  if (!Array.isArray(friends)) {
    console.error('Friends prop is not an array:', friends);
    return (
      <Typography.Text type="danger">
        Error loading friends list
      </Typography.Text>
    );
  }

  if (friends.length === 0) {
    return (
      <Typography.Text type="secondary">
        No friends yet
      </Typography.Text>
    );
  }

  return (
    <List
      dataSource={friends}
      renderItem={(friend) => (
        <List.Item
          actions={[
            <Button
              key="message"
              type="primary"
              icon={<MessageOutlined />}
              onClick={() => handleMessage(friend)}
            >
              Message
            </Button>,
            <Button
              key="profile"
              icon={<UserOutlined />}
              onClick={() => navigate(`/profile/${friend.friend.id}`)}
            >
              View Profile
            </Button>,
            <Button
              key="remove"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveFriend(friend.friend.id)}
            >
              Remove
            </Button>
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar icon={<UserOutlined />}>
                {friend.friend.username[0]}
              </Avatar>
            }
            title={friend.friend.username}
            description={friend.friend.department}
          />
        </List.Item>
      )}
    />
  );
};

export default FriendsList; 