// Inside FindFriends.js
import React, { useState, useEffect } from 'react';
import { Input, List, Avatar, Button, Card, Typography } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';

const { Search } = Input;

const FindFriends = ({ onRequestSent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/users/search?query=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Error searching users');
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(searchUsers, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  const handleSendRequest = async (userId) => {
    try {
      await axios.post(`/api/friends/requests`, { receiverId: userId });
      toast.success('Friend request sent!');
      onRequestSent();
      setSearchResults(prevResults =>
        prevResults.map(user =>
          user.id === userId ? { ...user, requestSent: true } : user
        )
      );
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Failed to send friend request');
    }
  };

  return (
    <div>
      <Search
        placeholder="Search users by username or department..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: 20 }}
        loading={loading}
      />
      
      <List
        dataSource={searchResults}
        locale={{
          emptyText: searchQuery ? 'No users found' : 'Start typing to search users'
        }}
        renderItem={(user) => (
          <List.Item key={user.id}>
            <Card style={{ width: '100%' }}>
              <List.Item.Meta
                avatar={<Avatar>{user.username[0]}</Avatar>}
                title={user.username}
                description={user.department}
              />
              {user.isFriend ? (
                <Button disabled>Friends</Button>
              ) : user.requestSent ? (
                <Button disabled>Request Sent</Button>
              ) : (
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => handleSendRequest(user.id)}
                >
                  Add Friend
                </Button>
              )}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default FindFriends;