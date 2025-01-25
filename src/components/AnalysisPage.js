import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Progress, Typography } from 'antd';
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;

const AnalysisPage = () => {
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/analysis');
        setProgressData(response.data);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };
    fetchProgressData();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '50px' }}>
        <Title level={2}>Course Progress</Title>
        <Row gutter={16}>
          {progressData.map(course => (
            <Col span={8} key={course.id}>
              <Card title={course.title} bordered>
                <p>Time Spent: {course.timeSpent} hours</p>
                <Progress percent={course.progress} />
                <p>Grade: {course.grade}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default AnalysisPage;
