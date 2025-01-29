import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Tabs, List, Button, Input, Space, message } from 'antd';
import { UserOutlined, LikeOutlined, CommentOutlined, SendOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [newComment, setNewComment] = useState('');
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/api/users/profile/${userId}`);
      setProfile(response.data);
    } catch (error) {
      message.error('Failed to load profile');
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/api/posts/${postId}/like`);
      fetchProfile();
    } catch (error) {
      message.error('Failed to like post');
    }
  };

  const handleComment = async (postId) => {
    try {
      await api.post(`/api/posts/${postId}/comment`, { content: newComment });
      setNewComment('');
      fetchProfile();
    } catch (error) {
      message.error('Failed to add comment');
    }
  };

  const handleMessage = () => {
    navigate('/dashboard/chat', { state: { userId: profile.id } });
  };

  if (!profile) return null;

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Avatar size={128} src={profile.avatarUrl} icon={<UserOutlined />} />
            <Title level={2}>{profile.firstName} {profile.lastName}</Title>
            <Text type="secondary">@{profile.username}</Text>
            <div style={{ marginTop: '16px' }}>
              <Button type="primary" onClick={handleMessage}>
                Send Message
              </Button>
            </div>
          </div>

          <Tabs defaultActiveKey="1">
            <TabPane tab="Posts" key="1">
              <List
                itemLayout="vertical"
                dataSource={profile.Posts}
                renderItem={post => (
                  <Card style={{ marginBottom: '16px' }}>
                    <div>{post.content}</div>
                    <div style={{ marginTop: '16px' }}>
                      <Space>
                        <Button 
                          icon={<LikeOutlined />} 
                          onClick={() => handleLike(post.id)}
                        >
                          {post.Likes?.length || 0}
                        </Button>
                        <Button icon={<CommentOutlined />}>
                          {post.Comments?.length || 0}
                        </Button>
                      </Space>
                    </div>

                    <List
                      itemLayout="horizontal"
                      dataSource={post.Comments}
                      renderItem={comment => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={comment.User.avatarUrl} />}
                            title={comment.User.username}
                            description={comment.content}
                          />
                        </List.Item>
                      )}
                    />

                    <div style={{ marginTop: '16px' }}>
                      <TextArea
                        rows={2}
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                      />
                      <Button 
                        type="primary" 
                        icon={<SendOutlined />}
                        onClick={() => handleComment(post.id)}
                        style={{ marginTop: '8px' }}
                      >
                        Comment
                      </Button>
                    </div>
                  </Card>
                )}
              />
            </TabPane>
          </Tabs>
        </Space>
      </Card>
    </div>
  );
};

export default UserProfile; 