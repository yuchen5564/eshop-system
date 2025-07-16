import React from 'react';
import { Typography, Button } from 'antd';
import { useResponsive } from '../../hooks/useBreakpoint';
import ResponsiveContainer from '../responsive/ResponsiveContainer';

const { Title, Paragraph } = Typography;

const HeroSection = ({ onPageChange }) => {
  const { isMobile, isTablet } = useResponsive();
  
  const getTitleStyle = () => ({
    color: 'white', 
    fontSize: isMobile ? '28px' : isTablet ? '36px' : '48px', 
    marginBottom: '24px',
    lineHeight: 1.2
  });

  const getParagraphStyle = () => ({
    color: 'white', 
    fontSize: isMobile ? '16px' : '20px', 
    marginBottom: '40px', 
    maxWidth: isMobile ? '100%' : '600px', 
    margin: '0 auto 40px',
    lineHeight: 1.6
  });

  const getButtonStyle = () => ({
    background: 'white', 
    borderColor: 'white', 
    color: '#52c41a', 
    fontSize: isMobile ? '16px' : '18px', 
    height: isMobile ? '44px' : '50px', 
    padding: isMobile ? '0 24px' : '0 40px'
  });

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
      padding: isMobile ? '40px 0' : isTablet ? '60px 0' : '80px 0',
      textAlign: 'center',
      color: 'white',
      width: '100%',
      margin: 0
    }}>
      <ResponsiveContainer>
        <Title style={getTitleStyle()}>
          新鮮農產品，直送到家
        </Title>
        <Paragraph style={getParagraphStyle()}>
          與在地農夫合作，提供最新鮮、最優質的農產品。從農場到餐桌，我們為您把關每一份食材的品質。
        </Paragraph>
        <Button 
          type="primary" 
          size={isMobile ? 'middle' : 'large'}
          style={getButtonStyle()}
          onClick={() => onPageChange('products')}
        >
          立即購買
        </Button>
      </ResponsiveContainer>
    </div>
  );
};

export default HeroSection;