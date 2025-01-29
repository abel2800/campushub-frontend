import React from 'react';
import { Card, List, Button, Tag, Typography, Space } from 'antd';
import { BookOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Courses = () => {
  // Sample course data - replace with actual API call
  const courses = [
    {
      id: 1,
      title: 'Introduction to Computer Science',
      instructor: 'Dr. Smith',
      schedule: 'Mon, Wed 10:00 AM',
      status: 'In Progress',
      enrolled: '150 students'
    },
    {
      id: 2,
      title: 'Data Structures and Algorithms',
      instructor: 'Dr. Johnson',
      schedule: 'Tue, Thu 2:00 PM',
      status: 'Upcoming',
      enrolled: '120 students'
    },
    // Add more courses as needed
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3}>My Courses</Title>
          <Button type="primary">Enroll in New Course</Button>
        </div>

        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
          dataSource={courses}
          renderItem={course => (
            <List.Item>
              <Card
                hoverable
                actions={[
                  <Button type="link">View Details</Button>,
                  <Button type="link">Course Material</Button>
                ]}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Title level={4}>{course.title}</Title>
                  
                  <Space>
                    <UserOutlined />
                    <Text>{course.instructor}</Text>
                  </Space>

                  <Space>
                    <ClockCircleOutlined />
                    <Text>{course.schedule}</Text>
                  </Space>

                  <Space>
                    <BookOutlined />
                    <Text>{course.enrolled}</Text>
                  </Space>

                  <Tag color={course.status === 'In Progress' ? 'processing' : 'warning'}>
                    {course.status}
                  </Tag>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      </Space>
    </div>
  );
};

export default Courses; 