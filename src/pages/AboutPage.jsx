import React from 'react';
import { 
  Row, 
  Col, 
  Typography, 
  Card, 
  Space 
} from 'antd';
import {
  PhoneOutlined,
  ClockCircleOutlined,
  MailOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const AboutPage = () => {
  return (
    <div style={{ padding: '40px 0', width: '100%', minHeight: 'calc(100vh - 200px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '60px' }}>
          關於農鮮市集
        </Title>
        
        <Row gutter={[32, 32]} style={{ marginBottom: '60px' }}>
          <Col xs={24} md={12}>
            <Card>
              <Title level={3} style={{ color: '#52c41a' }}>我們的使命</Title>
              <Paragraph>
                農鮮市集致力於連接消費者與在地農夫，提供最新鮮、最優質的農產品。我們相信透過直接採購，不僅能讓消費者享受到更好的產品，也能支持台灣的農業發展。
              </Paragraph>
              <Paragraph>
                我們嚴格把關每一項農產品的品質，確保從農場到餐桌的每一個環節都符合最高標準。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card>
              <Title level={3} style={{ color: '#52c41a' }}>我們的承諾</Title>
              <Space direction="vertical" size="middle">
                <Text>• 100% 台灣在地農產品</Text>
                <Text>• 嚴格的品質檢驗標準</Text>
                <Text>• 公平的農夫收購價格</Text>
                <Text>• 24小時快速配送服務</Text>
                <Text>• 完整的售後服務保障</Text>
              </Space>
            </Card>
          </Col>
        </Row>
        
        <Card style={{ background: 'linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%)' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '40px' }}>
            聯絡我們
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
              <PhoneOutlined style={{ fontSize: '40px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={4}>客服專線</Title>
              <Text>0800-123-456</Text>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
              <ClockCircleOutlined style={{ fontSize: '40px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={4}>營業時間</Title>
              <Text>週一至週六 09:00-18:00</Text>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
              <MailOutlined style={{ fontSize: '40px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={4}>電子郵件</Title>
              <Text>service@farmfresh.com.tw</Text>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;