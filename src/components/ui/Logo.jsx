import React from 'react';
import { Space, Typography } from 'antd';

const { Title } = Typography;

const Logo = ({ size = 'medium' }) => {
  const sizes = {
    small: { fontSize: '24px', titleLevel: 3 },
    medium: { fontSize: '32px', titleLevel: 2 },
    large: { fontSize: '48px', titleLevel: 1 }
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <Space size="large" align="center">
      <div style={{ fontSize: currentSize.fontSize }}>🌱</div>
      <Title level={currentSize.titleLevel} style={{ margin: 0, color: '#52c41a' }}>
        農鮮市集
      </Title>
    </Space>
  );
};

export default Logo;