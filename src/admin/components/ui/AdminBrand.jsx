import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const AdminBrand = ({ collapsed = false }) => {
  if (collapsed) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>🌱</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '20px' }}>🌱</span>
      <Text strong style={{ fontSize: '16px' }}>農鮮市集 - 管理後台</Text>
    </div>
  );
};

export default AdminBrand;