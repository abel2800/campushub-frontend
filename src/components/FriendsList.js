import React from 'react';
import { List, Avatar, Button, Space, Card, Typography } from 'antd';
import { MessageOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const FriendsList = ({ friends = [], onFriendRemoved }) => {
  const navigate = useNavigate();

  const handleMessage = async (friendData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token when messaging:', token);
      
      if (!token) {
        toast.error('Not authenticated');
        navigate('/login');
        return;
      }

      const response = await axios.post('/api/chats/create', {
        participantId: friendData.id
      });

      if (response.data && response.data.id) {
        navigate('/chat', {
          state: {
            chatId: response.data.id,
            participant: {
              id: friendData.id,
              username: friendData.username,
              department: friendData.department
            }
          }
        });
      } else {
        toast.error('Failed to create chat');
      }
    } catch (error) {
      console.error('Chat creation error:', error);
      if (error.response?.status === 401) {
        toast.error('Please login again');
        navigate('/login');
      } else {
        toast.error('Failed to start chat');
      }
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/friends/${friendId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Friend removed');
      if (onFriendRemoved) {
        onFriendRemoved();
      }
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
      renderItem={(friend) => {
        // Safety check for friend object
        if (!friend || !friend.friend) {
          return null;
        }

        const friendData = friend.friend;
        return (
          <List.Item key={friendData.id}>
            <Card style={{ width: '100%' }}>
              <List.Item.Meta
                avatar={
                  <Avatar>{friendData.username?.[0]}</Avatar>
                }
                title={friendData.username}
                description={friendData.department}
              />
              <Space>
                <Button
                  type="primary"
                  icon={<MessageOutlined />}
                  onClick={() => handleMessage(friendData)}
                >
                  Message
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveFriend(friendData.id)}
                >
                  Remove
                </Button>
              </Space>
            </Card>
          </List.Item>
        );
      }}
    />
  );
};

export default FriendsList; 