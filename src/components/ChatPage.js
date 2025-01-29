import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Layout, 
  Input, 
  Button, 
  List, 
  Avatar, 
  Typography, 
  Space,
  Divider 
} from 'antd';
import { 
  SendOutlined, 
  SearchOutlined,
  UserOutlined 
} from '@ant-design/icons';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const { Content, Sider } = Layout;
const { Text } = Typography;
const { Search } = Input;

const ChatPage = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedChat, setSelectedChat] = useState(location.state?.chatId || null);
  const [currentParticipant, setCurrentParticipant] = useState(location.state?.participant || null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchRecentChats();
    if (location.state?.chatId) {
      fetchMessages(location.state.chatId);
    }
  }, [location.state]);

  const fetchRecentChats = async () => {
    try {
      const response = await axios.get('/api/chats/recent');
      setRecentChats(response.data);
    } catch (error) {
      console.error('Error fetching recent chats:', error);
    }
  };

  const handleSearch = async (value) => {
    try {
      const response = await axios.get(`/api/friends/search?query=${value}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleChatSelect = async (chat) => {
    setSelectedChat(chat.id);
    setCurrentParticipant(chat.participant);
    await fetchMessages(chat.id);
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`/api/chats/${chatId}/messages`);
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await axios.post(`/api/chats/${selectedChat}/messages`, {
        content: newMessage.trim()
      });
      
      setNewMessage('');
      await fetchMessages(selectedChat);
      await fetchRecentChats();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Content style={{ padding: '24px', minHeight: '100%' }}>
      <Layout style={{ background: '#fff', minHeight: 'calc(100vh - 112px)' }}>
        {/* Chat List Sidebar */}
        <Sider width={300} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '20px' }}>
            <Search
              placeholder="Search friends"
              onSearch={handleSearch}
              style={{ marginBottom: '20px' }}
            />
            
            {searchQuery ? (
              <List
                dataSource={searchResults}
                renderItem={(user) => (
                  <List.Item 
                    onClick={() => handleChatSelect(user)}
                    style={{ cursor: 'pointer' }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={user.username}
                      description={user.department}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <List
                dataSource={recentChats}
                renderItem={(chat) => (
                  <List.Item 
                    onClick={() => handleChatSelect(chat)}
                    style={{ 
                      cursor: 'pointer',
                      background: selectedChat === chat.id ? '#f0f0f0' : 'transparent'
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar>{chat.participant.username[0]}</Avatar>}
                      title={chat.participant.username}
                      description={chat.lastMessage?.content}
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
        </Sider>

        {/* Chat Area */}
        <Content style={{ padding: '20px' }}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div style={{ marginBottom: '20px', borderBottom: '1px solid #f0f0f0', padding: '10px 0' }}>
                <Space>
                  <Avatar>{currentParticipant?.username[0]}</Avatar>
                  <Text strong>{currentParticipant?.username}</Text>
                </Space>
              </div>

              {/* Messages */}
              <div style={{ height: 'calc(100vh - 280px)', overflowY: 'auto', padding: '20px 0' }}>
                <List
                  dataSource={messages}
                  renderItem={(message) => (
                    <List.Item style={{
                      justifyContent: message.sender_id === currentParticipant?.id ? 'flex-start' : 'flex-end'
                    }}>
                      <div style={{
                        background: message.sender_id === currentParticipant?.id ? '#f0f0f0' : '#1890ff',
                        color: message.sender_id === currentParticipant?.id ? 'inherit' : '#fff',
                        padding: '8px 12px',
                        borderRadius: '16px',
                        maxWidth: '70%'
                      }}>
                        {message.content}
                      </div>
                    </List.Item>
                  )}
                />
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onPressEnter={handleSendMessage}
                    placeholder="Type a message..."
                  />
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                  />
                </Space.Compact>
              </div>
            </>
          ) : (
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              flexDirection: 'column' 
            }}>
              <SendOutlined style={{ fontSize: '48px', marginBottom: '16px', color: '#1890ff' }} />
              <Text>Your Messages</Text>
              <Text type="secondary">Send private messages to a friend</Text>
            </div>
          )}
        </Content>
      </Layout>
    </Content>
  );
};

export default ChatPage; 