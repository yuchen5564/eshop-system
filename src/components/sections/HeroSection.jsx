import React from 'react';
import { Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

const HeroSection = ({ onPageChange }) => {
  return (
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
      <Paragraph style={{ 
        color: 'white', 
        fontSize: '20px', 
        marginBottom: '40px', 
        maxWidth: '600px', 
        margin: '0 auto 40px' 
      }}>
        與在地農夫合作，提供最新鮮、最優質的農產品。從農場到餐桌，我們為您把關每一份食材的品質。
      </Paragraph>
      <Button 
        type="primary" 
        size="large"
        style={{ 
          background: 'white', 
          borderColor: 'white', 
          color: '#52c41a', 
          fontSize: '18px', 
          height: '50px', 
          padding: '0 40px' 
        }}
        onClick={() => onPageChange('products')}
      >
        立即購買
      </Button>
    </div>
  );
};

export default HeroSection;