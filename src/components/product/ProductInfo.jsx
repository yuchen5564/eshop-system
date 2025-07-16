import React from 'react';
import { Typography, Space } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ProductInfo = ({ product }) => {
  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <Title level={3}>{product.name}</Title>
      <Space>
        <EnvironmentOutlined />
        <Text type="secondary">{product.farm} • {product.location}</Text>
      </Space>
      <Paragraph ellipsis={{ rows: 2 }}>{product.description}</Paragraph>
      <Text type="secondary">產品計價單位：{product.unit}</Text>
      <Text type="secondary">庫存: {product.stock}</Text>
    </Space>
  );
};

export default ProductInfo;