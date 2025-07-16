import React from 'react';
import { Card, Space } from 'antd';
import { ProductImage, ProductInfo, ProductPrice, AddToCartButton } from './product';

const { Meta } = Card;

const ProductCard = ({ product, onAddToCart }) => {
  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card
      hoverable
      style={{ height: '100%' }}
      cover={
        <ProductImage 
          image={product.image}
          discount={discount}
        />
      }
      actions={[
        <AddToCartButton 
          product={product}
          onAddToCart={onAddToCart}
        />
      ]}
    >
      <Meta 
        description={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <ProductInfo product={product} />
            <ProductPrice 
              price={product.price}
              originalPrice={product.originalPrice}
            />
          </Space>
        }
      />
    </Card>
  );
};

export default ProductCard;