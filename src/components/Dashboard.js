import React, { useState } from 'react';
import { Layout, Menu, Avatar, Badge, Card, Row, Col, Typography, Statistic, Space, Dropdown } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  MessageOutlined,
  BellOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ChatPage from './ChatPage';
import Courses from './Courses';
import Friends from './Friends';
import Settings from './Settings';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import UserProfile from './UserProfile';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Define userMenu items after handleLogout is defined
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate(`/dashboard/profile/${user.id}`)
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/dashboard/settings')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/courses')) return '2';
    if (path.includes('/friends')) return '3';
    if (path.includes('/chat')) return '4';
    if (path.includes('/settings')) return '5';
    return '1';
  };

  return (
    <NotificationProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={setCollapsed}
          style={{
            background: '#fff'
          }}
        >
          <div style={{ 
            height: '64px', 
            margin: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center' 
          }}>
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              Campus Hub
            </Title>
          </div>
          <Menu
            theme="light"
            selectedKeys={[getSelectedKey()]}
            mode="inline"
          >
            <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => navigate('/dashboard')}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="2" icon={<BookOutlined />} onClick={() => navigate('/dashboard/courses')}>
              Courses
            </Menu.Item>
            <Menu.Item key="3" icon={<TeamOutlined />} onClick={() => navigate('/dashboard/friends')}>
              Friends
            </Menu.Item>
            <Menu.Item key="4" icon={<MessageOutlined />} onClick={() => navigate('/dashboard/chat')}>
              Chat
            </Menu.Item>
            <Menu.Item key="5" icon={<SettingOutlined />} onClick={() => navigate('/dashboard/settings')}>
              Settings
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ 
            padding: '0 24px', 
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)'
          }}>
            <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
            <Space size="large">
              <NotificationDropdown />
              <Dropdown 
                menu={{ items: userMenuItems }} 
                trigger={['click']}
                placement="bottomRight"
              >
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar src={user.avatarUrl} icon={<UserOutlined />} />
                  <span>{user.username}</span>
                </Space>
              </Dropdown>
            </Space>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </NotificationProvider>
  );
};

// Create a DashboardHome component for the main dashboard view
const DashboardHome = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Courses Enrolled"
            value={5}
            prefix={<BookOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Friends"
            value={12}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Messages"
            value={25}
            prefix={<MessageOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Profile Views"
            value={100}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard; 