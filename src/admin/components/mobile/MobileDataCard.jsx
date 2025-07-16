import React from 'react';
import { Card, Space, Typography, Button, Divider } from 'antd';
import { useResponsive } from '../../../hooks/useBreakpoint';

const { Text, Title } = Typography;

const MobileDataCard = ({ 
  dataSource = [], 
  renderItem, 
  loading = false,
  title,
  extra,
  emptyText = '暫無數據'
}) => {
  const { isMobile } = useResponsive();

  if (!isMobile) {
    return null; // 只在移動端顯示
  }

  return (
    <div style={{ padding: '0 16px' }}>
      {title && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px',
          padding: '0 8px'
        }}>
          <Title level={4} style={{ margin: 0 }}>{title}</Title>
          {extra}
        </div>
      )}
      
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {dataSource.length === 0 ? (
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Text type="secondary">{emptyText}</Text>
            </div>
          </Card>
        ) : (
          dataSource.map((item, index) => (
            <Card 
              key={item.id || index}
              loading={loading}
              size="small"
              style={{ 
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
              bodyStyle={{ padding: '12px 16px' }}
            >
              {renderItem ? renderItem(item, index) : (
                <Text>請提供 renderItem 函數</Text>
              )}
            </Card>
          ))
        )}
      </Space>
    </div>
  );
};

// 預設的用戶卡片渲染器
export const renderUserCard = (user) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
      <div style={{ flex: 1 }}>
        <Text strong style={{ fontSize: '14px' }}>
          {user.displayName || '未設定姓名'}
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {user.email}
        </Text>
      </div>
      <Space size="small">
        <Button type="text" size="small">編輯</Button>
        <Button type="text" size="small" danger>刪除</Button>
      </Space>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontSize: '12px' }}>
        角色: {user.role === 'admin' ? '管理員' : '用戶'}
      </Text>
      <Text style={{ fontSize: '12px', color: user.isActive ? '#52c41a' : '#ff4d4f' }}>
        {user.isActive ? '啟用' : '停用'}
      </Text>
    </div>
  </div>
);

// 預設的產品卡片渲染器
export const renderProductCard = (product) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
      <div style={{ 
        width: '60px', 
        height: '60px', 
        background: '#f0f0f0',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        marginRight: '12px'
      }}>
        {product.image}
      </div>
      
      <div style={{ flex: 1 }}>
        <Text strong style={{ fontSize: '14px' }}>
          {product.name}
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {product.category} • 庫存: {product.stock}
        </Text>
        <br />
        <Text style={{ fontSize: '14px', color: '#52c41a', fontWeight: 'bold' }}>
          NT$ {product.price}
        </Text>
      </div>
      
      <Space direction="vertical" size="small" align="end">
        <Button type="text" size="small">編輯</Button>
        <Text style={{ 
          fontSize: '10px', 
          color: product.isActive ? '#52c41a' : '#ff4d4f'
        }}>
          {product.isActive ? '上架' : '下架'}
        </Text>
      </Space>
    </div>
  </div>
);

export default MobileDataCard;