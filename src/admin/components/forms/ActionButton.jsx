import React from 'react';
import { Button, Tooltip } from 'antd';

const ActionButton = ({ 
  icon, 
  onClick, 
  type = 'text',
  danger = false,
  tooltip,
  disabled = false,
  loading = false,
  size = 'small',
  style = {},
  children,
  ...props 
}) => {
  const button = (
    <Button
      type={type}
      icon={icon}
      onClick={onClick}
      danger={danger}
      disabled={disabled}
      loading={loading}
      size={size}
      style={style}
      {...props}
    >
      {children}
    </Button>
  );

  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }

  return button;
};

export default ActionButton;