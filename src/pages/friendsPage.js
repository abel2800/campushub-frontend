import React, { useState, useEffect } from 'react';
import { Input, List, Button, message, Card, Avatar, Tabs } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import api from '../services/api';

const { TabPane } = Tabs;

const FriendsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch friend requests and friends list on component mount
  useEffect(() => {
    fetchFriendRequests();
    fetchFriends();
  }, []);

  const handleSearch = async (value) => {
    try {
      setLoading(true);
      console.log('Searching for:', value); // Debug log

      if (!value.trim()) {
        setUsers([]);
        return;
      }

      const response = await api.get('/api/friends/search', {
        params: { username: value }
      });

      console.log('Search response:', response.data); // Debug log
      setUsers(response.data);
    } catch (error) {
      console.error('Search error:', error);
      message.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to avoid too many requests
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleAddFriend = async (userId) => {
    try {
      await api.post('/api/friends/send-request', { receiverId: userId });
      message.success('Friend request sent successfully');
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, requestSent: true }
          : user
      ));
    } catch (error) {
      console.error('Add friend error:', error);
      message.error('Failed to send friend request');
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await api.get('/api/friends/requests');
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Fetch requests error:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await api.get('/api/friends/list');
      setFriends(response.data);
    } catch (error) {
      console.error('Fetch friends error:', error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await api.post(`/api/friends/accept-request/${requestId}`);
      message.success('Friend request accepted');
      fetchFriendRequests();
      fetchFriends();
    } catch (error) {
      message.error('Failed to accept request');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Add Friends" key="1">
            <Input
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '20px' }}
            />

            <List
              loading={loading}
              dataSource={users}
              locale={{ 
                emptyText: searchTerm 
                  ? 'No users found' 
                  : 'Start typing to search for users'
              }}
              renderItem={user => (
                <List.Item
                  actions={[
                    user.requestSent ? (
                      <Button disabled>Request Sent</Button>
                    ) : (
                      <Button 
                        type="primary" 
                        onClick={() => handleAddFriend(user.id)}
                      >
                        Add Friend
                      </Button>
                    )
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={`${user.firstName} ${user.lastName}`}
                    description={`@${user.username}`}
                  />
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane tab={`Friend Requests (${friendRequests.length})`} key="2">
            <List
              dataSource={friendRequests}
              renderItem={request => (
                <List.Item
                  actions={[
                    <Button 
                      type="primary" 
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      Accept
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={`${request.sender.firstName} ${request.sender.lastName}`}
                    description={`@${request.sender.username}`}
                  />
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane tab={`Friends (${friends.length})`} key="3">
            <List
              dataSource={friends}
              renderItem={friend => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={`${friend.firstName} ${friend.lastName}`}
                    description={`@${friend.username}`}
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default FriendsPage;
