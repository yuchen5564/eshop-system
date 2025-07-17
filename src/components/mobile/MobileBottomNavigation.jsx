import React from 'react';
import { Badge, Button } from 'antd';
import { 
  HomeOutlined, 
  ShoppingOutlined, 
  ShoppingCartOutlined,
  InfoCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';

const MobileBottomNavigation = ({ 
  currentPage, 
  onPageChange, 
  cartItemsCount = 0 
}) => {
  const navItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首頁'
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: '商品'
    },
    {
      key: 'cart',
      icon: cartItemsCount > 0 ? (
        <Badge count={cartItemsCount} size="small">
          <ShoppingCartOutlined />
        </Badge>
      ) : (
        <ShoppingCartOutlined />
      ),
      label: '購物車'
    },
    {
      key: 'order-tracking',
      icon: <SearchOutlined />,
      label: '訂單查詢'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#fff',
      borderTop: '1px solid #f0f0f0',
      padding: '8px 0 env(safe-area-inset-bottom)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center'
    }}>
      {navItems.map(item => (
        <Button
          key={item.key}
          type="text"
          onClick={() => onPageChange(item.key)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: 'auto',
            padding: '8px 4px',
            color: currentPage === item.key ? '#1890ff' : '#666',
            fontSize: '12px',
            border: 'none',
            background: 'transparent'
          }}
        >
          <div style={{ 
            fontSize: '18px', 
            marginBottom: '2px',
            color: currentPage === item.key ? '#1890ff' : '#666'
          }}>
            {item.icon}
          </div>
          <span style={{
            fontSize: '10px',
            color: currentPage === item.key ? '#1890ff' : '#666'
          }}>
            {item.label}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default MobileBottomNavigation;