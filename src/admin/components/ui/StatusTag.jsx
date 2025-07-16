import React from 'react';
import { Tag } from 'antd';

const StatusTag = ({ status, children, ...props }) => {
  const getStatusProps = (status) => {
    switch (status) {
      case 'active':
      case 'enabled':
      case 'online':
      case 'published':
        return { color: 'green' };
      case 'inactive':
      case 'disabled':
      case 'offline':
      case 'draft':
        return { color: 'red' };
      case 'pending':
      case 'processing':
        return { color: 'orange' };
      case 'completed':
      case 'success':
        return { color: 'blue' };
      default:
        return { color: 'default' };
    }
  };

  return (
    <Tag {...getStatusProps(status)} {...props}>
      {children}
    </Tag>
  );
};

export default StatusTag;