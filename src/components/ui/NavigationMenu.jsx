import React from 'react';
import { Menu } from 'antd';
import { 
  HomeOutlined, 
  ShoppingOutlined, 
  InfoCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';

const NavigationMenu = ({ 
  currentPage, 
  onPageChange, 
  mode = 'horizontal',
  showIcons = false 
}) => {
  const menuItems = [
    {
      key: 'home',
      label: '首頁',
      icon: showIcons ? <HomeOutlined /> : null,
      onClick: () => onPageChange('home')
    },
    {
      key: 'products',
      label: '商品',
      icon: showIcons ? <ShoppingOutlined /> : null,
      onClick: () => onPageChange('products')
    },
    {
      key: 'order-tracking',
      label: '訂單查詢',
      icon: showIcons ? <SearchOutlined /> : null,
      onClick: () => onPageChange('order-tracking')
    },
    {
      key: 'about',
      label: '關於我們',
      icon: showIcons ? <InfoCircleOutlined /> : null,
      onClick: () => onPageChange('about')
    }
  ];

  return (
    <Menu 
      mode={mode}
      selectedKeys={[currentPage]}
      items={menuItems}
      style={{ 
        border: 'none', 
        background: 'transparent',
        width: mode === 'vertical' ? '100%' : 'auto'
      }}
    />
  );
};

export default NavigationMenu;