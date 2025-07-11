import React from 'react';
import { 
  List, 
  Typography, 
  Button, 
  Space, 
  Divider,
  Empty,
  Popconfirm
} from 'antd';
import {
  ShoppingCartOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

const CartDropdown = ({ cart, onRemoveFromCart, onViewCart, getTotalPrice }) => {
  if (cart.length === 0) {
    return (
      <div style={{ 
        width: '320px', 
        padding: '16px',
        textAlign: 'center'
      }}>
        <Empty 
          image={<ShoppingCartOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />}
          description="購物車是空的"
          styles={{ image: { height: '60px' } }}
        />
      </div>
    );
  }

  return (
    <div style={{ width: '320px', maxHeight: '400px' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={5} style={{ margin: 0 }}>購物車 ({cart.length})</Title>
      </div>
      
      <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
        <List
          dataSource={cart}
          renderItem={(item) => (
            <List.Item
              style={{ padding: '12px 16px' }}
              actions={[
                <Popconfirm
                  title="移除商品"
                  description="確定要從購物車移除這個商品嗎？"
                  onConfirm={() => onRemoveFromCart(item.id)}
                  okText="確定"
                  cancelText="取消"
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                  />
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div style={{ 
                    fontSize: '24px', 
                    width: '40px', 
                    textAlign: 'center' 
                  }}>
                    {item.image}
                  </div>
                }
                title={
                  <div style={{ fontSize: '14px' }}>
                    {item.name}
                  </div>
                }
                description={
                  <Space direction="vertical" size={2}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {item.farm} • {item.location}
                    </Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        NT$ {item.price} × {item.quantity}
                      </Text>
                      <Text strong style={{ color: '#52c41a', fontSize: '12px' }}>
                        NT$ {item.price * item.quantity}
                      </Text>
                    </div>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </div>
      
      <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <Text strong>總計：</Text>
          <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
            NT$ {getTotalPrice()}
          </Title>
        </div>
        
        <Button 
          type="primary" 
          block 
          size="large"
          onClick={onViewCart}
        >
          查看購物車
        </Button>
      </div>
    </div>
  );
};

export default CartDropdown;