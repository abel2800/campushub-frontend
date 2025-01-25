import React, { useState, useEffect } from 'react';
import { Card, Button, Input, List, Tabs, message, Avatar, AutoComplete, Modal, Dropdown, Menu } from 'antd';
import { UserAddOutlined, CheckOutlined, CloseOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';

const { TabPane } = Tabs;

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/friends/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched friends:', response.data); // Debug log
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      message.error('Failed to fetch friends');
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/friends/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      message.error('Failed to fetch friend requests');
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, []);

  // Search users with dropdown menu
  const searchUsers = async (searchText) => {
    if (!searchText) {
      setSearchOptions([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/users/search?query=${searchText}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const options = response.data.map(user => ({
        value: user.username,
        label: (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1" onClick={() => handleAddFriend(user.username)}>
                  <UserAddOutlined /> Add Friend
                </Menu.Item>
                <Menu.Item key="2" onClick={() => showUserProfile(user)}>
                  <UserOutlined /> View Profile
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
              <Avatar 
                src={user.profilePicture} 
                size={24} 
                style={{ marginRight: 8 }}
              >
                {user.firstName[0]}
              </Avatar>
              <span>{`${user.firstName} ${user.lastName} (@${user.username})`}</span>
            </div>
          </Dropdown>
        ),
        user: user
      }));
      
      setSearchOptions(options);
    } catch (error) {
      console.error('Search error:', error);
      message.error('Error searching users');
    }
  };

  // Show user profile modal
  const showUserProfile = (user) => {
    setSelectedUser(user);
    setIsProfileModalVisible(true);
  };

  // Send friend request
  const handleAddFriend = async (username) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/friends/request',
        { username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Friend request sent successfully!');
      setSearchOptions([]);
    } catch (error) {
      if (error.response?.data?.message === 'Friend request already exists') {
        message.info('You have already sent a friend request to this user');
      } else {
        message.error(error.response?.data?.message || 'Failed to send friend request');
      }
    } finally {
      setLoading(false);
    }
  };

  // Respond to friend request
  const handleFriendRequest = async (requestId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/friends/respond/${requestId}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      message.success(`Friend request ${status}`);
      await fetchFriendRequests(); // Refresh requests
      if (status === 'accepted') {
        await fetchFriends(); // Refresh friends list if accepted
      }
    } catch (error) {
      console.error('Error handling friend request:', error);
      message.error('Failed to handle friend request');
    }
  };

  const handleMessageClick = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      // Get or create chat
      const response = await axios.get(`http://localhost:5000/api/messages/chat/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Navigate to chat with the friend
      navigate(`/chat/${friendId}`);
    } catch (error) {
      console.error('Error opening chat:', error);
      message.error('Failed to open chat');
    }
  };

  // Debounce search to prevent too many API calls
  const debouncedSearch = debounce(searchUsers, 300);

  // Add this useEffect to verify the connection when the component mounts
  useEffect(() => {
    const testConnection = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/test');
        console.log('API test response:', response.data);
      } catch (error) {
        console.error('API test error:', error);
        message.error('Could not connect to server');
      }
    };

    testConnection();
  }, []);

  const sendFriendRequest = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/friends/request', 
        { receiverId: userId },  // Changed from friendId to receiverId
        { headers: { Authorization: `Bearer ${token}` }}
      );
      message.success('Friend request sent successfully');
      fetchFriendRequests();
    } catch (error) {
      console.error('Error sending friend request:', error);
      message.error('Failed to send friend request');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card title="Add Friend" style={{ marginBottom: '20px' }}>
        <AutoComplete
          style={{ width: '100%' }}
          options={searchOptions}
          onSearch={debouncedSearch}
          placeholder="Search users by name or username"
          notFoundContent="No users found"
        />
      </Card>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Friends" key="1">
          <List
            itemLayout="horizontal"
            dataSource={friends}
            renderItem={(friend) => (
              <List.Item
                actions={[
                  <Button onClick={() => handleMessageClick(friend.id)}>Message</Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar>
                      {friend.firstName ? friend.firstName[0].toUpperCase() : '?'}
                    </Avatar>
                  }
                  title={`${friend.firstName || ''} ${friend.lastName || ''}`.trim() || 'Unknown User'}
                  description={friend.username || 'No username'}
                />
              </List.Item>
            )}
          />
        </TabPane>

        <TabPane tab={`Friend Requests (${friendRequests.length})`} key="2">
          <List
            itemLayout="horizontal"
            dataSource={friendRequests}
            renderItem={(request) => {
              const sender = request.sender || {};
              return (
                <List.Item
                  actions={[
                    <Button 
                      type="primary" 
                      onClick={() => handleFriendRequest(request.id, 'accepted')}
                    >
                      Accept
                    </Button>,
                    <Button 
                      danger 
                      onClick={() => handleFriendRequest(request.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar>
                        {sender.firstName ? sender.firstName[0].toUpperCase() : '?'}
                      </Avatar>
                    }
                    title={`${sender.firstName || ''} ${sender.lastName || ''}`.trim() || 'Unknown User'}
                    description={sender.username || 'No username'}
                  />
                </List.Item>
              );
            }}
          />
        </TabPane>
      </Tabs>

      <Modal
        title="User Profile"
        visible={isProfileModalVisible}
        onCancel={() => setIsProfileModalVisible(false)}
        footer={null}
      >
        {selectedUser && (
          <div style={{ textAlign: 'center' }}>
            <Avatar 
              src={selectedUser.profilePicture} 
              size={100}
            >
              {selectedUser.firstName[0]}
            </Avatar>
            <h2>{`${selectedUser.firstName} ${selectedUser.lastName}`}</h2>
            <p>@{selectedUser.username}</p>
            <p>{selectedUser.department}</p>
            <Button 
              type="primary" 
              onClick={() => handleAddFriend(selectedUser.username)}
              style={{ marginRight: 8 }}
            >
              Add Friend
            </Button>
            <Button onClick={() => handleMessageClick(selectedUser.id)}>
              Message
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FriendsPage;