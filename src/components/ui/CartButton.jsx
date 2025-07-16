import React from 'react';
import { Button, Badge, Dropdown } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import CartDropdown from '../CartDropdown';

const CartButton = ({ 
  cartItemsCount, 
  cart, 
  onRemoveFromCart, 
  onPageChange, 
  getTotalPrice 
}) => {
  return (
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
  );
};

export default CartButton;