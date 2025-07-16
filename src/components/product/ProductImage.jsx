import React from 'react';
import { Tag } from 'antd';

const ProductImage = ({ image, discount }) => {
  return (
    <div style={{ 
      height: '200px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '80px',
      background: '#f0f0f0',
      position: 'relative'
    }}>
      {image}
      {discount > 0 && (
        <Tag color="red" style={{ position: 'absolute', top: '10px', right: '10px' }}>
          -{discount}%
        </Tag>
      )}
    </div>
  );
};

export default ProductImage;