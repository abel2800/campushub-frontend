import React from 'react';
import { Menu } from 'antd';
import { 
  HomeOutlined, 
  BookOutlined, 
  TeamOutlined, 
  MessageOutlined,
  GlobalOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <Menu 
      mode="horizontal" 
      selectedKeys={[location.pathname]}
      style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}
    >
      <Menu.Item key="/" icon={<HomeOutlined />}>
        <Link to="/">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="/courses" icon={<BookOutlined />}>
        <Link to="/courses">Courses</Link>
      </Menu.Item>
      <Menu.Item key="/social" icon={<GlobalOutlined />}>
        <Link to="/social">Social Media</Link>
      </Menu.Item>
      <Menu.Item key="/friends" icon={<TeamOutlined />}>
        <Link to="/friends">Friends</Link>
      </Menu.Item>
      <Menu.Item key="/chat" icon={<MessageOutlined />}>
        <Link to="/chat">Chat</Link>
      </Menu.Item>
      <Menu.Item key="/profile" icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
