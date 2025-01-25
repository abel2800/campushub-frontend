import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input, Button, List, Avatar, Badge, Spin, message } from 'antd';
import { SendOutlined, LoadingOutlined, BellOutlined } from '@ant-design/icons';
import axios from 'axios';
import io from 'socket.io-client';

const Chat = () => {
  // Define all state variables at the top
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [friend, setFriend] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadChats, setUnreadChats] = useState({});
  
  const { friendId } = useParams();
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // Initialize socket connection once
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
      query: { userId: currentUser.id }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('newMessage', (message) => {
      // Update messages immediately when received
      setMessages(prev => [...prev, message]);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      // Update chat list to show latest message
      fetchChatList();
      fetchUnreadCounts(); // Update notification counts
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser.id]);

  // Fetch chat list
  const fetchChatList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/messages/chats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatList(response.data);
    } catch (error) {
      console.error('Error fetching chat list:', error);
    }
  };

  // Send message with optimistic update
  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    const tempId = Date.now();
    const tempMessage = {
      id: tempId,
      content: newMessage.trim(),
      senderId: currentUser.id,
      chatId: chatId,
      createdAt: new Date().toISOString()
    };

    // Optimistic update
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/messages/send',
        {
          chatId: parseInt(chatId),
          content: tempMessage.content,
          receiverId: friendId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Emit to socket for real-time update
      socket?.emit('sendMessage', {
        ...response.data,
        receiverId: friendId
      });

      // Update messages with server response
      setMessages(prev => 
        prev.map(msg => msg.id === tempId ? response.data : msg)
      );
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  // Initialize chat data
  useEffect(() => {
    const initializeChat = async () => {
      if (!friendId) return;
      
      try {
        const token = localStorage.getItem('token');
        
        // Parallel requests for faster loading
        const [chatResponse, friendResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/messages/chat/${friendId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:5000/api/users/${friendId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setChatId(chatResponse.data.id);
        setFriend(friendResponse.data);

        // Join socket room for this chat
        socket?.emit('joinChat', chatResponse.data.id);

        // Get messages after chat is initialized
        if (chatResponse.data.id) {
          const messagesResponse = await axios.get(
            `http://localhost:5000/api/messages/${chatResponse.data.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMessages(messagesResponse.data);
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();
    fetchChatList();
  }, [friendId, socket]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add function to fetch unread counts
  const fetchUnreadCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/messages/unread', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(response.data.totalCount);
      setUnreadChats(response.data.chatCounts);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  // Fetch initial counts
  useEffect(() => {
    fetchUnreadCounts();
  }, []);

  // Render loading state
  if (!currentUser) {
    return <div>Please log in</div>;
  }

  return (
    <div className="chat-container" style={{ display: 'flex', height: '100vh' }}>
      {/* Chat List Sidebar */}
      <div style={{ 
        width: '350px', 
        borderRight: '1px solid #dbdbdb',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Chat Header with Notification Bell */}
        <div style={{ 
          padding: '20px',
          borderBottom: '1px solid #dbdbdb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0 }}>Chats</h2>
          <Badge count={unreadCount} size="small">
            <BellOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          </Badge>
        </div>

        {/* Chat List with Individual Notifications */}
        <List
          dataSource={chatList}
          renderItem={chat => (
            <List.Item 
              onClick={() => navigate(`/chat/${chat.user.id}`)}
              style={{ 
                padding: '10px 20px',
                cursor: 'pointer',
                backgroundColor: chat.user.id === parseInt(friendId) ? '#f0f2f5' : 'transparent'
              }}
            >
              <List.Item.Meta
                avatar={<Avatar src={chat.user.profilePicture}>{chat.user.firstName?.[0]}</Avatar>}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{`${chat.user.firstName} ${chat.user.lastName}`}</span>
                    {unreadChats[chat.id] > 0 && (
                      <Badge count={unreadChats[chat.id]} size="small" />
                    )}
                  </div>
                }
                description={chat.lastMessage?.content}
              />
            </List.Item>
          )}
        />
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Chat Header */}
        <div style={{ 
          padding: '16px 20px',
          borderBottom: '1px solid #dbdbdb',
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Avatar 
            size={40} 
            src={friend?.profilePicture}
            style={{ marginRight: '12px' }}
          >
            {friend?.firstName?.[0]}
          </Avatar>
          <h3 style={{ margin: 0 }}>{friend?.firstName} {friend?.lastName}</h3>
        </div>

        {/* Messages Area */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
          padding: '20px',
          backgroundColor: '#fff'
        }}>
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              style={{
                marginBottom: '12px',
                display: 'flex',
                justifyContent: msg.senderId === currentUser.id ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '22px',
                  maxWidth: '60%',
                  backgroundColor: msg.senderId === currentUser.id ? '#0095f6' : '#efefef',
                  color: msg.senderId === currentUser.id ? 'white' : 'black'
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div style={{ 
          padding: '20px',
          borderTop: '1px solid #dbdbdb',
          backgroundColor: '#fff'
        }}>
          <Input.Group compact style={{ display: 'flex' }}>
            <Input
              style={{ 
                flex: 1,
                borderRadius: '22px',
                padding: '8px 16px',
                marginRight: '10px'
              }}
              placeholder="Message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={sendMessage}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              onClick={sendMessage}
              shape="circle"
              style={{
                backgroundColor: '#0095f6',
                borderColor: '#0095f6'
              }}
            />
          </Input.Group>
        </div>
      </div>
    </div>
  );
};

export default Chat;