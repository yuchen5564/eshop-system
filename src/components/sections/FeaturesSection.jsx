import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import {
  HomeOutlined,
  TruckOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useResponsive } from '../../hooks/useBreakpoint';
import ResponsiveContainer from '../responsive/ResponsiveContainer';

const { Title, Paragraph } = Typography;

const FeaturesSection = () => {
  const { isMobile, isTablet } = useResponsive();
  
  const featureCards = [
    {
      icon: <HomeOutlined style={{ 
        fontSize: isMobile ? '36px' : '48px', 
        color: '#52c41a' 
      }} />,
      title: '有機無毒',
      description: '嚴格把關農產品品質，確保無農藥殘留，讓您吃得安心健康。'
    },
    {
      icon: <TruckOutlined style={{ 
        fontSize: isMobile ? '36px' : '48px', 
        color: '#1890ff' 
      }} />,
      title: '快速配送',
      description: '24小時內快速出貨，保證農產品新鮮度，讓您享受最佳口感。'
    },
    {
      icon: <SafetyCertificateOutlined style={{ 
        fontSize: isMobile ? '36px' : '48px', 
        color: '#722ed1' 
      }} />,
      title: '品質保證',
      description: '與認證農場合作，提供品質保證，不滿意可退換貨。'
    }
  ];

  const getGutter = () => {
    if (isMobile) return [16, 16];
    if (isTablet) return [24, 24];
    return [32, 32];
  };

  return (
    <div style={{ 
      padding: isMobile ? '40px 0' : isTablet ? '60px 0' : '80px 0', 
      background: '#f5f5f5', 
      width: '100%', 
      margin: 0 
    }}>
      <ResponsiveContainer>
        <Title 
          level={isMobile ? 3 : 2} 
          style={{ 
            textAlign: 'center', 
            marginBottom: isMobile ? '32px' : '60px' 
          }}
        >
          為什麼選擇我們
        </Title>
        <Row gutter={getGutter()}>
          {featureCards.map((feature, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card 
                hoverable 
                style={{ 
                  textAlign: 'center', 
                  height: '100%',
                  borderRadius: '8px'
                }}
                bodyStyle={{
                  padding: isMobile ? '20px' : '24px'
                }}
              >
                <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
                  {feature.icon}
                </div>
                <Title level={isMobile ? 4 : 3}>{feature.title}</Title>
                <Paragraph style={{
                  fontSize: isMobile ? '14px' : '16px',
                  lineHeight: 1.6
                }}>
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </ResponsiveContainer>
    </div>
  );
};

export default FeaturesSection;