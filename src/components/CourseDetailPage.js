import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Typography, Spin, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Sample course data for testing
  const sampleCourse = {
    id: courseId,
    title: "Sample Course",
    description: "This is a sample course description",
    videoUrls: [
      "https://www.youtube.com/embed/sample1",
      "https://www.youtube.com/embed/sample2"
    ],
    progress: 30
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      // Uncomment the API call when backend is ready
      // const response = await api.get(`/api/courses/${courseId}`);
      // setCourse(response.data);
      
      // Using sample data for now
      setCourse(sampleCourse);
    } catch (error) {
      console.error('Error fetching course details:', error);
      message.error('Failed to load course details');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text type="secondary">Course not found</Text>
        <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Button 
        type="link" 
        onClick={() => navigate('/courses')}
        style={{ marginBottom: '20px' }}
      >
        <LeftOutlined /> Back to Courses
      </Button>

      <Title level={2}>{course.title}</Title>
      
      <Card>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
            src={course.videoUrls[currentVideoIndex]}
            title={`${course.title} - Video ${currentVideoIndex + 1}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <Text>{course.description}</Text>
        </div>

        <div style={{ marginTop: '20px' }}>
          <Progress percent={course.progress || 0} />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setCurrentVideoIndex(prev => prev - 1)}
            disabled={currentVideoIndex === 0}
          >
            <LeftOutlined /> Previous Video
          </Button>
          <Button
            onClick={() => setCurrentVideoIndex(prev => prev + 1)}
            disabled={currentVideoIndex === course.videoUrls.length - 1}
          >
            Next Video <RightOutlined />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CourseDetailPage; 