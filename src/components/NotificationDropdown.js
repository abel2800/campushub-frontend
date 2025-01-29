import React from 'react';
import { Dropdown, Badge, List, Button, Typography, Space } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    switch (notification.type) {
      case 'message':
        navigate('/dashboard/chat');
        break;
      case 'friend_request':
        navigate('/dashboard/friends');
        break;
      case 'course':
        navigate('/dashboard/courses');
        break;
      default:
        break;
    }
  };

  const menu = (
    <List
      style={{ 
        width: 300, 
        maxHeight: 400, 
        overflow: 'auto',
        backgroundColor: 'white',
        padding: '8px'
      }}
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>Notifications</Text>
          <Button type="link" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
      }
      dataSource={notifications}
      renderItem={item => (
        <List.Item
          onClick={() => handleNotificationClick(item)}
          style={{ 
            cursor: 'pointer',
            backgroundColor: item.read ? 'white' : '#f0f0f0'
          }}
        >
          <Space direction="vertical" size={2}>
            <Text strong>{item.title}</Text>
            <Text type="secondary">{item.content}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {new Date(item.time).toLocaleString()}
            </Text>
          </Space>
        </List.Item>
      )}
    />
  );

  return (
    <Dropdown 
      overlay={menu} 
      trigger={['click']}
      placement="bottomRight"
    >
      <Badge count={unreadCount}>
        <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown; 