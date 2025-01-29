import React, { useState } from 'react';
import { Form, Input, Button, message, Row, Col, Typography, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', {
        email: values.email.toLowerCase().trim(),
        password: values.password
      });

      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '20px' }}>
      <Row gutter={[32, 32]} justify="center" align="middle" style={{ minHeight: '90vh' }}>
        {/* Left side - Website Info */}
        <Col xs={24} md={12} lg={14}>
          <div style={{ padding: '20px' }}>
            <Title style={{ color: '#1890ff', fontSize: '3.5rem', marginBottom: '20px' }}>
              Campus Hub
            </Title>
            <Paragraph style={{ fontSize: '1.5rem', color: '#666' }}>
              Connect with your campus community, share knowledge, and collaborate with peers.
            </Paragraph>
            <div style={{ marginTop: '40px' }}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card style={{ borderRadius: '8px' }}>
                    <Title level={4}>Share & Connect</Title>
                    <Paragraph>
                      Share your academic experiences and connect with fellow students.
                    </Paragraph>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card style={{ borderRadius: '8px' }}>
                    <Title level={4}>Collaborate</Title>
                    <Paragraph>
                      Work together on projects and share resources with your classmates.
                    </Paragraph>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card style={{ borderRadius: '8px' }}>
                    <Title level={4}>Stay Updated</Title>
                    <Paragraph>
                      Get the latest updates about campus events and academic activities.
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </Col>

        {/* Right side - Login Form */}
        <Col xs={24} md={12} lg={8}>
          <Card 
            style={{ 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
              borderRadius: '8px',
              maxWidth: '400px',
              margin: '0 auto'
            }}
          >
            <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
              Welcome to CampusHub
            </Title>
            <Form
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large">
                  Log in
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center' }}>
                <Button type="link" onClick={() => navigate('/create-account')}>
                  Create New Account
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LandingPage;