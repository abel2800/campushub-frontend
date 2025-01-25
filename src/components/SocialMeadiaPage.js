import React, { useState, useEffect } from 'react';
import { Card, Button, Input, List, Typography, Row, Col } from 'antd';
import { LikeOutlined, CommentOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;

const SocialMediaPage = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts/feed');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/posts/create', {
        user_id: 1, // Replace with actual user ID
        caption: newPost,
      });
      setPosts([response.data, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <Row gutter={16}>
        <Col span={12}>
          <Input.TextArea
            rows={4}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
          />
          <Button onClick={handlePostSubmit} type="primary" style={{ marginTop: '10px' }}>
            Post
          </Button>
        </Col>
      </Row>

      <List
        itemLayout="vertical"
        size="large"
        dataSource={posts}
        renderItem={(post) => (
          <List.Item
            key={post.id}
            extra={
              <Button type="link">
                <LikeOutlined /> {post.like_count} Likes
              </Button>
            }
          >
            <Card title={`Posted by ${post.full_name}`}>
              <Text>{post.caption}</Text>
              <div>
                <Button type="link">
                  <CommentOutlined /> {post.comment_count} Comments
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default SocialMediaPage;