import React, { useState } from 'react';
import { Layout, Row, Col, Button, Drawer, Space, Badge } from 'antd';
import { 
  MenuOutlined, 
  SearchOutlined, 
  ShoppingCartOutlined,
  SettingOutlined 
} from '@ant-design/icons';
import { Logo, SearchBar, NavigationMenu, CartButton } from '../ui';

const { Header: AntHeader } = Layout;

const MobileHeader = ({ 
  searchTerm, 
  onSearchChange, 
  currentPage, 
  onPageChange, 
  cartItemsCount,
  cart,
  onRemoveFromCart,
  getTotalPrice 
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const handleMenuSelect = (page) => {
    onPageChange(page);
    setDrawerVisible(false);
  };

  return (
    <>
      <AntHeader style={{ 
        background: '#fff', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '0 16px',
        width: '100%'
      }}>
        <Row align="middle" justify="space-between">
          <Col flex="auto">
            <Space size="small">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={toggleDrawer}
                size="large"
              />
              <Logo size="small" />
            </Space>
          </Col>
          
          <Col>
            <Space size="small">
              <Button
                type="text"
                icon={<SearchOutlined />}
                onClick={toggleSearch}
                size="large"
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
              />
            </Space>
          </Col>
        </Row>
        
        {/* 可展開的搜尋列 */}
        {searchVisible && (
          <div style={{ 
            padding: '12px 0', 
            borderTop: '1px solid #f0f0f0',
            marginTop: '8px'
          }}>
            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
            />
          </div>
        )}
      </AntHeader>

      {/* 側邊抽屜選單 */}
      <Drawer
        title={<Logo size="small" />}
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        styles={{
          body: { padding: 0 }
        }}
      >
        <div style={{ padding: '16px' }}>
          <NavigationMenu 
            currentPage={currentPage}
            onPageChange={handleMenuSelect}
            mode="vertical"
            showIcons={true}
          />
        </div>
      </Drawer>
    </>
  );
};

export default MobileHeader;