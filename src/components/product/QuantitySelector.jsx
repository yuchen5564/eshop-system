import React from 'react';
import { InputNumber } from 'antd';

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

  return (
    <InputNumber
      value={quantity}
      onChange={handleInputChange}
      min={min}
      max={Math.min(max, stock)}
      disabled={disabled}
      size="small"
      controls={true}
      style={{ 
        width: '80px', 
        textAlign: 'center'
      }}
    />
  );
};

export default QuantitySelector;