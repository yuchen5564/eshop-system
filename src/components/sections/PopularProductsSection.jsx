import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import ProductCard from '../ProductCard';
import { useResponsive } from '../../hooks/useBreakpoint';
import ResponsiveContainer from '../responsive/ResponsiveContainer';

const { Title } = Typography;

const PopularProductsSection = ({ products, onAddToCart, onPageChange }) => {
  const { isMobile, isTablet } = useResponsive();
  
  const getGutter = () => {
    if (isMobile) return [16, 16];
    if (isTablet) return [20, 20];
    return [24, 24];
  };

  const getColSpan = () => {
    if (isMobile) return { xs: 24, sm: 12 };
    if (isTablet) return { xs: 24, sm: 12, md: 8 };
    return { xs: 24, sm: 12, md: 6 };
  };

  return (
    <div style={{ 
      padding: isMobile ? '40px 0' : isTablet ? '60px 0' : '80px 0', 
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
          熱門商品
        </Title>
        <Row gutter={getGutter()}>
          {products.filter(product => product.isActive !== false).slice(0, 4).map(product => (
            <Col {...getColSpan()} key={product.id}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </Col>
          ))}
        </Row>
        <div style={{ 
          textAlign: 'center', 
          marginTop: isMobile ? '32px' : '40px' 
        }}>
          <Button 
            type="primary" 
            size={isMobile ? 'middle' : 'large'}
            onClick={() => onPageChange('products')}
            style={{
              height: isMobile ? '44px' : '48px',
              fontSize: isMobile ? '16px' : '18px',
              padding: isMobile ? '0 24px' : '0 32px'
            }}
          >
            查看更多商品
          </Button>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default PopularProductsSection;