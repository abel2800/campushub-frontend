import React from 'react';
import { List, Avatar, Button, Space, Card, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const FriendRequests = ({ requests, onRequestAccepted }) => {
  const handleAccept = async (requestId) => {
    try {
      await axios.post(`/api/friends/requests/${requestId}/accept`);
      toast.success('Friend request accepted!');
      onRequestAccepted();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Failed to accept friend request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(`/api/friends/requests/${requestId}/reject`);
      toast.success('Friend request rejected');
      onRequestAccepted();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error('Failed to reject friend request');
    }
  };

  if (requests.length === 0) {
    return (
      <Typography.Text type="secondary">
        No pending friend requests
      </Typography.Text>
    );
  }

  return (
    <List
      dataSource={requests}
      renderItem={(request) => (
        <List.Item key={request.id}>
          <Card style={{ width: '100%' }}>
            <List.Item.Meta
              avatar={<Avatar>{request.sender.username[0]}</Avatar>}
              title={request.sender.username}
              description={request.sender.department}
            />
            <Space>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleAccept(request.id)}
              >
                Accept
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(request.id)}
              >
                Reject
              </Button>
            </Space>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default FriendRequests;