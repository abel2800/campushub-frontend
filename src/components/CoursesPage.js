import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Spin, Input, Tag, Space, message } from 'antd';
import { BookOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;
const { Meta } = Card;

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  // Sample courses data for testing
  const sampleCourses = [
    {
      id: 1,
      title: "Introduction to Programming",
      description: "Learn the basics of programming with Python",
      category: "Programming",
      level: "Beginner",
      duration: 20,
      imageUrl: "https://via.placeholder.com/300x200"
    },
    {
      id: 2,
      title: "Web Development Fundamentals",
      description: "Master HTML, CSS, and JavaScript",
      category: "Web Development",
      level: "Intermediate",
      duration: 30,
      imageUrl: "https://via.placeholder.com/300x200"
    }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Uncomment the API call when backend is ready
      // const response = await api.get('/api/courses');
      // setCourses(response.data);
      
      // Using sample data for now
      setCourses(sampleCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      message.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const categories = ['All', 'Programming', 'Data Science', 'Web Development', 'AI/ML', 'Cybersecurity'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Available Courses</Title>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Input
            placeholder="Search courses..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: 400 }}
          />
          <Space wrap>
            <FilterOutlined /> Categories:
            {categories.map(category => (
              <Tag
                key={category}
                color={selectedCategory === category ? 'blue' : 'default'}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Tag>
            ))}
          </Space>
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredCourses.map((course) => (
            <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={course.title}
                    src={course.imageUrl}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
                onClick={() => handleCourseClick(course.id)}
              >
                <Meta
                  title={course.title}
                  description={
                    <>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                        {course.description.length > 100 
                          ? `${course.description.substring(0, 100)}...` 
                          : course.description}
                      </Text>
                      <Tag color="blue">{course.category}</Tag>
                      <Tag color="green">{course.level}</Tag>
                      <Tag color="orange">{`${course.duration} hours`}</Tag>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {!loading && filteredCourses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text type="secondary">No courses found matching your criteria.</Text>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;