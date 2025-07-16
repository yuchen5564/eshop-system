import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import ProductCard from '../ProductCard';

const { Title } = Typography;

const PopularProductsSection = ({ products, onAddToCart, onPageChange }) => {
  return (
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
  );
};

export default PopularProductsSection;