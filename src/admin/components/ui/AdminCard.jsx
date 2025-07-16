import React from 'react';
import { Card, Typography, Space, Button } from 'antd';

const { Title } = Typography;

const AdminCard = ({ 
  title, 
  children, 
  extra, 
  loading = false,
  style = {},
  bodyStyle = {},
  actions = [],
  ...props 
}) => {
  return (
    <Card
      title={title && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>{title}</Title>
          {extra && <div>{extra}</div>}
        </div>
      )}
      loading={loading}
      style={{ marginBottom: '16px', ...style }}
      bodyStyle={{ padding: '24px', ...bodyStyle }}
      actions={actions.length > 0 ? actions : undefined}
      {...props}
    >
      {children}
    </Card>
  );
};

export default AdminCard;