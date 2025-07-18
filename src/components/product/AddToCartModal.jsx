import React, { useState, useEffect } from 'react';
import { Modal, Space, Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import QuantitySelector from './QuantitySelector';
import { EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AddToCartModal = ({ 
  visible, 
  onClose, 
  product, 
  onAddToCart 
}) => {
  const [quantity, setQuantity] = useState(1);

  // 當modal開啟時重置數量為1
  useEffect(() => {
    if (visible) {
      setQuantity(1);
    }
  }, [visible]);

  const handleConfirm = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!product) return null;

  return (
    <Modal
      title="加入購物車"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="confirm" 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleConfirm}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? '缺貨' : '加入購物車'}
        </Button>
      ]}
      width={400}
    >
      <Space direction="vertical" size="medium" style={{ width: '100%' }}>
        {/* 商品圖片 */}
        <div style={{ 
          textAlign: 'center',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '60px',
          background: '#f0f0f0',
          borderRadius: '8px'
        }}>
          {product.image}
        </div>
        
        {/* 商品資訊 */}
        <div style={{ textAlign: 'center' }}>
          <Title level={4} style={{ margin: '8px 0' }}>{product.name}</Title>
          <EnvironmentOutlined /> <Text type="secondary">{product.farm} • {product.location}</Text>
        </div>
        
        {/* 價格資訊 */}
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Text strong style={{ fontSize: '18px', color: '#ff4d4f' }}>
              ${product.price}
            </Text>
            {product.originalPrice > product.price && (
              <Text delete type="secondary">
                ${product.originalPrice}
              </Text>
            )}
            <Text type="secondary">/ {product.unit}</Text>
          </Space>
        </div>
        
        {/* 庫存資訊 */}
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">庫存: {product.stock} {product.unit}</Text>
        </div>
        
        {/* 數量選擇 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '16px 0'
        }}>
          <Text strong>購買數量:</Text>
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
            stock={product.stock}
            disabled={product.stock === 0}
          />
        </div>
        
        {/* 總計 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0'
        }}>
          <Text strong>小計:</Text>
          <Text strong style={{ fontSize: '18px', color: '#ff4d4f' }}>
            ${(product.price * quantity).toFixed(0)}
          </Text>
        </div>
      </Space>
    </Modal>
  );
};

export default AddToCartModal;