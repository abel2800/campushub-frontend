import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Option } = Select;

const CreateAccount = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      console.log('Submitting registration:', values);

      const response = await api.post('/api/auth/register', values);
      
      if (response.data.success) {
        message.success('Account created successfully! Please login.');
        navigate('/'); // Redirect to login page
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create account';
      message.error(errorMessage);
      
      // Handle specific validation errors
      if (error.response?.data?.message.includes('email')) {
        form.setFields([
          {
            name: 'email',
            errors: ['This email is already registered']
          }
        ]);
      }
      if (error.response?.data?.message.includes('username')) {
        form.setFields([
          {
            name: 'username',
            errors: ['This username is already taken']
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card title="Create Account" style={{ width: 400 }}>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: 'Please input your first name!' },
              { min: 2, message: 'First name must be at least 2 characters!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: 'Please input your last name!' },
              { min: 2, message: 'Last name must be at least 2 characters!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters!' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers and underscores' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: 'Please select your department!' }]}
          >
            <Select placeholder="Select your department">
              <Option value="Computer Science">Computer Science</Option>
              <Option value="Electrical Engineering">Electrical Engineering</Option>
              <Option value="Mechanical Engineering">Mechanical Engineering</Option>
              <Option value="Civil Engineering">Civil Engineering</Option>
              <Option value="Business Administration">Business Administration</Option>
              <Option value="Economics">Economics</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create Account
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            Already have an account? {' '}
            <Button type="link" onClick={() => navigate('/')}>
              Login here
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateAccount;

