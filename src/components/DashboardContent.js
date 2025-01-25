import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  MessageOutlined, 
  BookOutlined 
} from '@ant-design/icons';

const { Title } = Typography;

const DashboardContent = () => {
  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Courses Enrolled"
              value={5}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Friends"
              value={12}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Messages"
              value={25}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Profile Views"
              value={100}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContent; 