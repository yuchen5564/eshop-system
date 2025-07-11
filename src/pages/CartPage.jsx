import React from 'react';
import { 
  Row, 
  Col, 
  Typography, 
  Button, 
  Space,
  Empty,
  Card,
  InputNumber,
  Divider,
  Popconfirm
} from 'antd';
import {
  ShoppingCartOutlined,
  EnvironmentOutlined,
  MinusOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const CartPage = ({ 
  cart, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  getTotalPrice, 
  onPageChange 
}) => {
  return (
    <div style={{ padding: '40px 0', width: '100%', minHeight: 'calc(100vh - 200px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Title level={2} style={{ marginBottom: '40px' }}>購物車</Title>
        
        {cart.length === 0 ? (
          <Empty 
            description="購物車是空的"
            image={<ShoppingCartOutlined style={{ fontSize: '80px', color: '#d9d9d9' }} />}
          >
            <Button type="primary" onClick={() => onPageChange('products')}>
              繼續購物
            </Button>
          </Empty>
        ) : (
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {cart.map(item => (
                  <Card key={item.id}>
                    <Row align="middle" gutter={[16, 16]}>
                      <Col flex="60px">
                        <div style={{ fontSize: '40px', textAlign: 'center' }}>
                          {item.image}
                        </div>
                      </Col>
                      <Col flex="auto">
                        <Title level={4}>{item.name}</Title>
                        <Space direction="vertical" size="small">
                          <Text type="secondary">
                            <EnvironmentOutlined /> {item.farm} • {item.location}
                          </Text>
                          <Text strong style={{ color: '#52c41a' }}>
                            NT$ {item.price} / {item.unit}
                          </Text>
                        </Space>
                      </Col>
                      <Col>
                        <Space align="center">
                          <Button 
                            icon={<MinusOutlined />}
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          />
                          <InputNumber 
                            min={1}
                            value={item.quantity}
                            onChange={(value) => onUpdateQuantity(item.id, value)}
                            style={{ width: '60px' }}
                          />
                          <Button 
                            icon={<PlusOutlined />}
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          />
                        </Space>
                      </Col>
                      <Col>
                        <Space direction="vertical" size="small" style={{ textAlign: 'right' }}>
                          <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                            NT$ {item.price * item.quantity}
                          </Title>
                          <Popconfirm
                            title="移除商品"
                            description={`確定要從購物車移除「${item.name}」嗎？`}
                            onConfirm={() => onRemoveFromCart(item.id)}
                            okText="確定"
                            cancelText="取消"
                          >
                            <Button 
                              type="text" 
                              danger
                              icon={<DeleteOutlined />}
                            >
                              移除
                            </Button>
                          </Popconfirm>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Space>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card title="訂單摘要" style={{ position: 'sticky', top: '24px' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Row justify="space-between">
                    <Text>商品總計</Text>
                    <Text strong>NT$ {getTotalPrice()}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text>運費</Text>
                    <Text strong>NT$ 100</Text>
                  </Row>
                  <Divider />
                  <Row justify="space-between">
                    <Title level={4}>總計</Title>
                    <Title level={4} style={{ color: '#52c41a' }}>
                      NT$ {getTotalPrice() + 100}
                    </Title>
                  </Row>
                  <Button 
                    type="primary" 
                    size="large" 
                    block
                    onClick={() => onPageChange('checkout')}
                  >
                    前往結帳
                  </Button>
                  <Button 
                    size="large" 
                    block
                    onClick={() => onPageChange('products')}
                  >
                    繼續購物
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default CartPage;