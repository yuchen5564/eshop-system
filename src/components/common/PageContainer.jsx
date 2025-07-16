import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const PageContainer = ({ 
  title, 
  children, 
  extra, 
  style = {},
  padding = '24px' 
}) => {
  return (
    <div style={{ 
      padding, 
      background: '#fff', 
      minHeight: '100%',
      ...style 
    }}>
      {title && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <Title level={2} style={{ margin: 0 }}>
            {title}
          </Title>
          {extra && <div>{extra}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default PageContainer;