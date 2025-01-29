import React, { useState, useEffect, useRef } from 'react';
import { Layout, List, Input, Button, Avatar, Space, Typography, Empty } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

const { Content, Sider } = Layout;
const { Text } = Typography;

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchRecentChats();
    
    // Initialize socket connection with proper error handling
    try {
      socketRef.current = io('http://localhost:5000', {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        // Don't redirect on socket errors
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        // Don't redirect on disconnection
      });

      socketRef.current.on('new_message', (message) => {
        if (selectedChat && message.sender_id === selectedChat.id) {
          setMessages(prev => [...prev, message]);
          scrollToBottom();
        }
        fetchRecentChats();
      });
    } catch (error) {
      console.error('Socket initialization error:', error);
      // Don't redirect on socket errors
    }

    if (location.state?.participant) {
      handleChatSelect(location.state.participant);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [location.state]);

  const fetchRecentChats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('/api/messages/recent', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRecentChats(response.data);
    } catch (error) {
      console.error('Error fetching recent chats:', error);
      // Only redirect if it's specifically a 401 error
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      }
    }
  };

  const fetchMessages = async (participantId) => {
    try {
      if (!participantId) {
        console.error('No participant ID provided');
        return;
      }
      const response = await axios.get(`/api/messages/${participantId}`);
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleChatSelect = async (participant) => {
    if (!participant || !participant.id) {
      console.error('Invalid participant data:', participant);
      return;
    }

    try {
      setSelectedChat(participant);
      
      // Create chat first
      await axios.post('/api/messages/create', {
        participantId: participant.id
      });

      // Then fetch messages
      await fetchMessages(participant.id);
    } catch (error) {
      console.error('Error in chat selection:', error);
      toast.error('Failed to load chat');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat?.id) return;

    try {
      const response = await axios.post('/api/messages/send', {
        participantId: selectedChat.id,
        content: newMessage.trim()
      });

      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      await fetchRecentChats();
      scrollToBottom();

      // Emit message through socket
      if (socketRef.current) {
        socketRef.current.emit('send_message', response.data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout style={{ minHeight: 'calc(100vh - 64px)' }}>
      <Sider width={300} theme="light" style={{ overflow: 'auto' }}>
        {recentChats.length > 0 ? (
          <List
            dataSource={recentChats}
            renderItem={(chat) => (
              <List.Item 
                onClick={() => handleChatSelect(chat.participant)}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: selectedChat?.id === chat.participant.id ? '#f0f0f0' : 'transparent',
                  padding: '12px'
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar>{chat.participant.username?.[0]}</Avatar>}
                  title={chat.participant.username}
                  description={chat.lastMessage?.content || 'No messages yet'}
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description="No recent chats" 
            style={{ padding: '20px' }}
          />
        )}
      </Sider>

      <Content style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        {selectedChat ? (
          <>
            <div style={{ marginBottom: '24px' }}>
              <Space>
                <Avatar size="large">{selectedChat.username?.[0]}</Avatar>
                <Text strong>{selectedChat.username}</Text>
              </Space>
            </div>

            <div style={{ 
              flex: 1, 
              overflow: 'auto',
              padding: '24px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              {messages.length > 0 ? (
                <List
                  dataSource={messages}
                  renderItem={(message) => {
                    const isSender = message.sender_id === parseInt(localStorage.getItem('userId'));
                    return (
                      <List.Item style={{
                        justifyContent: isSender ? 'flex-end' : 'flex-start',
                        border: 'none'
                      }}>
                        <div style={{
                          backgroundColor: isSender ? '#1890ff' : '#fff',
                          color: isSender ? '#fff' : 'inherit',
                          padding: '8px 16px',
                          borderRadius: '16px',
                          maxWidth: '70%',
                          wordBreak: 'break-word'
                        }}>
                          {message.content}
                        </div>
                      </List.Item>
                    );
                  }}
                />
              ) : (
                <Empty description="No messages yet" />
              )}
              <div ref={messagesEndRef} />
            </div>

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
          </>
        ) : (
          <Empty 
            description="Select a chat to start messaging"
            style={{ margin: 'auto' }}
          />
        )}
      </Content>
    </Layout>
  );
};

export default ChatPage;