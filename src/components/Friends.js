// Inside Friends.js
import React, { useState, useEffect } from 'react';
import { Tabs, Badge, Typography, Card } from 'antd';
import { UserAddOutlined, BellOutlined, TeamOutlined } from '@ant-design/icons';
import FindFriends from './FindFriends';
import FriendRequests from './FriendRequests';
import FriendsList from './FriendsList';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const { TabPane } = Tabs;

const Friends = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(fetchPendingRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchFriends(), fetchPendingRequests()]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load friend data');
      toast.error('Failed to load friend data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get('/api/friends');
      const formattedFriends = Array.isArray(response.data) ? response.data : [];
      setFriends(formattedFriends);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setFriends([]);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get('/api/friends/requests/pending');
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }
  };

  return (
    <Card style={{ margin: '24px' }}>
      <Typography.Title level={4} style={{ marginBottom: 24 }}>
        Friends
      </Typography.Title>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <UserAddOutlined />
              Find Friends
            </span>
          }
          key="1"
        >
          <FindFriends onRequestSent={fetchPendingRequests} loading={loading} />
        </TabPane>

        <TabPane
          tab={
            <Badge count={pendingRequests.length}>
              <span>
                <BellOutlined />
                Friend Requests
              </span>
            </Badge>
          }
          key="2"
        >
          <FriendRequests
            requests={pendingRequests}
            onRequestAccepted={() => {
              fetchFriends();
              fetchPendingRequests();
            }}
            loading={loading}
          />
        </TabPane>

        <TabPane
          tab={
            <Badge count={friends.length}>
              <span>
                <TeamOutlined />
                Friends
              </span>
            </Badge>
          }
          key="3"
        >
          <FriendsList
            friends={friends}
            onFriendRemoved={fetchFriends}
            loading={loading}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Friends;