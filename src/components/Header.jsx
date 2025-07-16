import React from 'react';
import { Layout, Row, Col, Space, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { Logo, SearchBar, NavigationMenu, CartButton } from './ui';

const { Header: AntHeader } = Layout;

const Header = ({ 
  searchTerm, 
  onSearchChange, 
  currentPage, 
  onPageChange, 
  cartItemsCount,
  cart,
  onRemoveFromCart,
  getTotalPrice 
}) => {
  return (
    <AntHeader style={{ 
      background: '#fff', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '0 24px',
      width: '100%'
    }}>
      <Row align="middle" justify="space-between">
        <Col>
          <Logo />
        </Col>
        
        <Col flex="auto" style={{ maxWidth: '500px', margin: '0 40px' }}>
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
          />
        </Col>
        
        <Col>
          <Space size="large">
            <NavigationMenu 
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
            
            <CartButton 
              cartItemsCount={cartItemsCount}
              cart={cart}
              onRemoveFromCart={onRemoveFromCart}
              onPageChange={onPageChange}
              getTotalPrice={getTotalPrice}
            />
            
            <Button 
              type="text" 
              icon={<SettingOutlined />}
              size="large"
              onClick={() => onPageChange('admin')}
              title="管理後台"
            />
          </Space>
        </Col>
      </Row>
    </AntHeader>
  );
};

export default Header;