import React from 'react';
import { 
  Row, 
  Col, 
  Typography, 
  Button, 
  Card, 
  Space 
} from 'antd';
import {
  HomeOutlined,
  TruckOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import ProductCard from '../components/ProductCard';

const { Title, Paragraph } = Typography;

const HomePage = ({ products, onAddToCart, onPageChange }) => {
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
    <div>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
        padding: '80px 0',
        textAlign: 'center',
        color: 'white',
        width: '100%',
        margin: 0
      }}>
        <Title style={{ color: 'white', fontSize: '48px', marginBottom: '24px' }}>
          新鮮農產品，直送到家
        </Title>
        <Paragraph style={{ color: 'white', fontSize: '20px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          與在地農夫合作，提供最新鮮、最優質的農產品。從農場到餐桌，我們為您把關每一份食材的品質。
        </Paragraph>
        <Button 
          type="primary" 
          size="large"
          style={{ background: 'white', borderColor: 'white', color: '#52c41a', fontSize: '18px', height: '50px', padding: '0 40px' }}
          onClick={() => onPageChange('products')}
        >
          立即購買
        </Button>
      </div>

      {/* Features Section */}
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

      {/* Popular Products Section */}
      <div style={{ padding: '80px 0', width: '100%', margin: 0 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '60px' }}>
            熱門商品
          </Title>
          <Row gutter={[24, 24]}>
            {products.filter(product => product.isActive !== false).slice(0, 4).map(product => (
              <Col xs={24} sm={12} md={6} key={product.id}>
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </Col>
            ))}
          </Row>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Button 
              type="primary" 
              size="large"
              onClick={() => onPageChange('products')}
            >
              查看更多商品
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;