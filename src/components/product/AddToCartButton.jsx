import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AddToCartButton = ({ product, onAddToCart, disabled = false }) => {
  return (
    <Button 
      type="primary" 
      icon={<PlusOutlined />}
      onClick={() => onAddToCart(product)}
      size="large"
      disabled={disabled || product.stock === 0}
    >
      {product.stock === 0 ? '缺貨' : '加入購物車'}
    </Button>
  );
};

export default AddToCartButton;