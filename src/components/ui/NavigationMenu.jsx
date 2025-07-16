import React from 'react';
import { Menu } from 'antd';

const NavigationMenu = ({ currentPage, onPageChange }) => {
  const menuItems = [
    {
      key: 'home',
      label: '首頁',
      onClick: () => onPageChange('home')
    },
    {
      key: 'products',
      label: '商品',
      onClick: () => onPageChange('products')
    },
    {
      key: 'about',
      label: '關於我們',
      onClick: () => onPageChange('about')
    }
  ];

  return (
    <Menu 
      mode="horizontal" 
      selectedKeys={[currentPage]}
      items={menuItems}
      style={{ border: 'none', background: 'transparent' }}
    />
  );
};

export default NavigationMenu;