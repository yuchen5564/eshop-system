import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action,
  style = {} 
}) => {
  return (
    <div style={{ 
      padding: '48px 24px',
      textAlign: 'center',
      background: '#fff',
      borderRadius: '8px',
      ...style
    }}>
      {icon && (
        <div style={{ 
          fontSize: '64px', 
          marginBottom: '16px',
          opacity: 0.6
        }}>
          {icon}
        </div>
      )}
      
      {title && (
        <Title level={3} style={{ color: '#666' }}>
          {title}
        </Title>
      )}
      
      {description && (
        <Paragraph style={{ color: '#999', marginBottom: '24px' }}>
          {description}
        </Paragraph>
      )}
      
      {action && action}
    </div>
  );
};

export default EmptyState;