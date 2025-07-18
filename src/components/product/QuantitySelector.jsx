import React from 'react';
import { InputNumber, Button, Space } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 99, 
  stock = 99,
  disabled = false 
}) => {
  const handleInputChange = (value) => {
    if (value && value >= min && value <= Math.min(max, stock)) {
      onQuantityChange(value);
    }
  };

  const handleDecrease = () => {
    const newValue = quantity - 1;
    if (newValue >= min) {
      onQuantityChange(newValue);
    }
  };

  const handleIncrease = () => {
    const newValue = quantity + 1;
    if (newValue <= Math.min(max, stock)) {
      onQuantityChange(newValue);
    }
  };

  return (
    <Space align="center">
      <Button 
        icon={<MinusOutlined />}
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        size="small"
      />
      <InputNumber 
        min={min}
        max={Math.min(max, stock)}
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        style={{ width: '60px' }}
        size="small"
        controls={false}
      />
      <Button 
        icon={<PlusOutlined />}
        onClick={handleIncrease}
        disabled={disabled || quantity >= Math.min(max, stock)}
        size="small"
      />
    </Space>
  );
};

export default QuantitySelector;