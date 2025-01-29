import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Input, List, Typography, Row, Col, Avatar, 
  Space, message, Upload, Modal 
} from 'antd';
import { 
  LikeOutlined, CommentOutlined, SendOutlined,
  UploadOutlined, PictureOutlined 
} from '@ant-design/icons';
import api from '../services/api';

const { Text } = Typography;
const { TextArea } = Input;

// Custom Comment Component
const CommentItem = ({ comment }) => (
  <div style={{ display: 'flex', marginBottom: '16px' }}>
    <Avatar src={comment.user.avatarUrl} style={{ marginRight: '12px' }} />
    <div>
      <Text strong>{comment.user.username}</Text>
      <Text style={{ marginLeft: '8px' }}>{comment.content}</Text>
    </div>
  </div>
);

const SocialMediaPage = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/posts/feed');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      message.error('Failed to load posts');
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim() && fileList.length === 0) {
      message.warning('Please add some text or an image to post');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('caption', newPost);
      
      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }

      const response = await api.post('/api/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPosts([response.data, ...posts]);
      setNewPost('');
      setFileList([]);
      message.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      message.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const uploadButton = (
    <div>
      <PictureOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleLike = async (postId) => {
    try {
      await api.post(`/api/posts/${postId}/like`);
      fetchPosts(); // Refresh posts to update likes
    } catch (error) {
      console.error('Error liking post:', error);
      message.error('Failed to like post');
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;

    try {
      await api.post(`/api/posts/${postId}/comment`, {
        content: commentText
      });
      setCommentText('');
      setActiveCommentPost(null);
      fetchPosts(); // Refresh posts to update comments
      message.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error('Failed to add comment');
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={16} lg={12} xl={12}>
          <Card>
            <TextArea
              rows={4}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
            />
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Button 
              onClick={handlePostSubmit} 
              type="primary" 
              style={{ marginTop: '10px' }}
              loading={loading}
            >
              Post
            </Button>
          </Card>

          <List
            itemLayout="vertical"
            size="large"
            dataSource={posts}
            renderItem={(post) => (
              <Card 
                style={{ marginTop: '16px' }}
                actions={[
                  <Button 
                    type="text" 
                    icon={<LikeOutlined />}
                    onClick={() => handleLike(post.id)}
                  >
                    {post.likesCount} Likes
                  </Button>,
                  <Button 
                    type="text" 
                    icon={<CommentOutlined />}
                    onClick={() => setActiveCommentPost(post.id)}
                  >
                    {post.commentsCount} Comments
                  </Button>
                ]}
              >
                <Card.Meta
                  avatar={<Avatar src={post.user.avatarUrl} />}
                  title={post.user.username}
                  description={post.caption}
                />
                
                {post.imageUrl && (
                  <div style={{ marginTop: '16px' }}>
                    <img 
                      src={post.imageUrl} 
                      alt="Post" 
                      style={{ width: '100%', borderRadius: '8px' }} 
                    />
                  </div>
                )}

                {activeCommentPost === post.id && (
                  <div style={{ marginTop: '16px' }}>
                    <List
                      itemLayout="horizontal"
                      dataSource={post.comments}
                      renderItem={comment => (
                        <CommentItem comment={comment} />
                      )}
                    />
                    <Space.Compact style={{ width: '100%', marginTop: '12px' }}>
                      <Input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        onPressEnter={() => handleComment(post.id)}
                      />
                      <Button 
                        type="primary" 
                        icon={<SendOutlined />}
                        onClick={() => handleComment(post.id)}
                      />
                    </Space.Compact>
                  </div>
                )}
              </Card>
            )}
          />
        </Col>
      </Row>

      <Modal
        visible={previewVisible}
        title="Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

// Helper function to convert file to base64
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export default SocialMediaPage; 