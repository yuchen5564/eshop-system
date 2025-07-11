import React from 'react';
import { 
  Layout, 
  Row, 
  Col, 
  Space, 
  Typography, 
  Input, 
  Menu, 
  Badge, 
  Button,
  Dropdown 
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';
import CartDropdown from './CartDropdown';

const { Header: AntHeader } = Layout;
const { Title } = Typography;
const { Search } = Input;

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
          <Space size="large" align="center">
            <div style={{ fontSize: '32px' }}>🌱</div>
            <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
              農鮮市集
            </Title>
          </Space>
        </Col>
        
        <Col flex="auto" style={{ maxWidth: '500px', margin: '0 40px' }}>
          <Search
            placeholder="搜尋農產品..."
            size="large"
            value={searchTerm}
            onChange={onSearchChange}
            style={{ width: '100%' }}
          />
        </Col>
        
        <Col>
          <Space size="large">
            <Menu 
              mode="horizontal" 
              selectedKeys={[currentPage]}
              items={menuItems}
              style={{ border: 'none', background: 'transparent' }}
            />
            
            <Dropdown
              popupRender={() => (
                <div style={{ 
                  background: '#fff', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' 
                }}>
                  <CartDropdown 
                    cart={cart}
                    onRemoveFromCart={onRemoveFromCart}
                    onViewCart={() => onPageChange('cart')}
                    getTotalPrice={getTotalPrice}
                  />
                </div>
              )}
              trigger={['hover']}
              placement="bottomRight"
            >
              <Badge count={cartItemsCount} showZero>
                <Button 
                  type="text" 
                  icon={<ShoppingCartOutlined />}
                  size="large"
                  onClick={() => onPageChange('cart')}
                />
              </Badge>
            </Dropdown>
            
            <Button 
              type="text" 
              icon={<UserOutlined />}
              size="large"
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