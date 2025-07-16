import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import {
  HomeOutlined,
  TruckOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const FeaturesSection = () => {
  const featureCards = [
    {
      icon: <HomeOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
      title: '有機無毒',
      description: '嚴格把關農產品品質，確保無農藥殘留，讓您吃得安心健康。'
    },
    {
      icon: <TruckOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: '快速配送',
      description: '24小時內快速出貨，保證農產品新鮮度，讓您享受最佳口感。'
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: '48px', color: '#722ed1' }} />,
      title: '品質保證',
      description: '與認證農場合作，提供品質保證，不滿意可退換貨。'
    }
  ];

  return (
    <div style={{ padding: '80px 0', background: '#f5f5f5', width: '100%', margin: 0 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '60px' }}>
          為什麼選擇我們
        </Title>
        <Row gutter={[32, 32]}>
          {featureCards.map((feature, index) => (
            <Col xs={24} md={8} key={index}>
              <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
                <div style={{ marginBottom: '24px' }}>
                  {feature.icon}
                </div>
                <Title level={3}>{feature.title}</Title>
                <Paragraph>{feature.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default FeaturesSection;