import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Avatar, 
  Input, 
  Button, 
  Space, 
  List,
  Upload,
  message,
  Typography
} from 'antd';
import { 
  LikeOutlined, 
  CommentOutlined, 
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons';
import axios from '../utils/axios';

const { Content } = Layout;
const { TextArea } = Input;
const { Text } = Typography;

const SocialMediaPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      message.error('Failed to fetch posts');
    }
  };

  const handlePost = async () => {
    if (!newPost.trim() && fileList.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', newPost);
      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }

      await axios.post('/api/posts', formData);
      setNewPost('');
      setFileList([]);
      await fetchPosts();
      message.success('Post created successfully');
    } catch (error) {
      message.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`/api/posts/${postId}/like`);
      await fetchPosts();
    } catch (error) {
      message.error('Failed to like post');
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      return false;
    },
    onChange: ({ fileList }) => setFileList(fileList),
    fileList,
    maxCount: 1
  };

  return (
    <Content style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <TextArea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
          <Space>
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
            <Button 
              type="primary" 
              onClick={handlePost} 
              loading={loading}
            >
              Post
            </Button>
          </Space>
        </Space>
      </Card>

      <List
        itemLayout="vertical"
        size="large"
        dataSource={posts}
        renderItem={(post) => (
          <Card style={{ marginBottom: 16 }}>
            <Card.Meta
              avatar={
                <Avatar icon={<UserOutlined />}>
                  {post.user?.username?.[0]}
                </Avatar>
              }
              title={post.user?.username}
              description={new Date(post.createdAt).toLocaleString()}
            />
            <div style={{ margin: '16px 0' }}>
              <Text>{post.content}</Text>
            </div>
            {post.image && (
              <div style={{ marginBottom: 16 }}>
                <img
                  src={post.image}
                  alt="Post"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 400,
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
            <Space>
              <Button 
                icon={<LikeOutlined />}
                onClick={() => handleLike(post.id)}
              >
                {post.likes || 0} Likes
              </Button>
              <Button icon={<CommentOutlined />}>
                {post.comments?.length || 0} Comments
              </Button>
            </Space>
          </Card>
        )}
      />
    </Content>
  );
};

export default SocialMediaPage; 