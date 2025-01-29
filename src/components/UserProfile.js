import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Avatar, 
  Tabs, 
  List, 
  Button, 
  Space, 
  Typography,
  Statistic,
  Row,
  Col,
  Image,
  Divider 
} from 'antd';
import { 
  UserOutlined, 
  SettingOutlined,
  EditOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setProfile(response.data);
    } catch (error) {
      toast.error('Failed to fetch profile');
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`/api/posts/user/${userId}`);
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <Content style={{ padding: '24px' }}>
      <Card>
        <Row gutter={24}>
          <Col span={8}>
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <Avatar size={164} src={profile?.avatar}>
                {profile?.username[0]}
              </Avatar>
              <Title level={2}>{profile?.username}</Title>
              <Text type="secondary">{profile?.department}</Text>
            </Space>
          </Col>
          <Col span={16}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="Posts" value={posts.length} />
              </Col>
              <Col span={8}>
                <Statistic title="Friends" value={profile?.friendsCount} />
              </Col>
              <Col span={8}>
                <Statistic title="Courses" value={profile?.coursesCount} />
              </Col>
            </Row>
            <Divider />
            <Text>{profile?.bio}</Text>
          </Col>
        </Row>
      </Card>

      <Tabs defaultActiveKey="posts" style={{ marginTop: '24px' }}>
        <TabPane tab="Posts" key="posts">
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={posts}
            renderItem={(post) => (
              <List.Item>
                <Card
                  cover={
                    post.image && (
                      <Image
                        alt="post"
                        src={post.image}
                        style={{ height: 200, objectFit: 'cover' }}
                      />
                    )
                  }
                >
                  <Card.Meta
                    title={post.createdAt}
                    description={post.content}
                  />
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="About" key="about">
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Title level={4}>About Me</Title>
              <Text>{profile?.about}</Text>
              <Divider />
              <Title level={4}>Department</Title>
              <Text>{profile?.department}</Text>
              <Divider />
              <Title level={4}>Interests</Title>
              <Text>{profile?.interests}</Text>
            </Space>
          </Card>
        </TabPane>
      </Tabs>
    </Content>
  );
};

export default UserProfile; 