import React from 'react';
import { Space, Typography } from 'antd';

const { Title, Text } = Typography;

const ProductPrice = ({ price, originalPrice }) => {
  return (
    <Space size="middle">
      <Title level={3} type="success" style={{ margin: 0 }}>
        NT$ {price}
      </Title>
      {originalPrice > price && (
        <Text delete type="secondary">NT$ {originalPrice}</Text>
      )}
    </Space>
  );
};

export default ProductPrice;