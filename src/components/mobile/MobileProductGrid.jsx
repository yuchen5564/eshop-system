import React from 'react';
import { Row, Col } from 'antd';
import ProductCard from '../ProductCard';

const MobileProductGrid = ({ products, onAddToCart, columns = 2 }) => {
  const getColSpan = () => {
    if (columns === 1) return 24;
    if (columns === 2) return 12;
    return 8;
  };

  return (
    <Row gutter={[12, 12]}>
      {products.map(product => (
        <Col span={getColSpan()} key={product.id}>
          <ProductCard 
            product={product} 
            onAddToCart={onAddToCart}
            compact={true}
          />
        </Col>
      ))}
    </Row>
  );
};

export default MobileProductGrid;