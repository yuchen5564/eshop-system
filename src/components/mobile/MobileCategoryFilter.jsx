import React from 'react';
import { Button, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const MobileCategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <div style={{
      padding: '16px',
      background: '#fff',
      borderBottom: '1px solid #f0f0f0',
      overflowX: 'auto',
      whiteSpace: 'nowrap'
    }}>
      <Space size="small">
        {categories.map(category => (
          <Button
            key={category.id}
            type={selectedCategory === category.id ? 'primary' : 'default'}
            size="small"
            onClick={() => onCategoryChange(category.id)}
            icon={category.id === 'all' ? <HomeOutlined /> : null}
            style={{
              minWidth: 'auto',
              fontSize: '12px',
              height: '32px',
              padding: '0 12px',
              borderRadius: '16px'
            }}
          >
            {category.id !== 'all' && (
              <span style={{ marginRight: '4px' }}>{category.icon}</span>
            )}
            {category.name}
          </Button>
        ))}
      </Space>
    </div>
  );
};

export default MobileCategoryFilter;