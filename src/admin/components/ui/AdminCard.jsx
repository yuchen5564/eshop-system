import React from 'react';
import { Card, Typography, Space, Button } from 'antd';
import { useResponsive } from '../../../hooks/useBreakpoint';

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
  const { isMobile, isTablet } = useResponsive();
  
  const getCardStyle = () => ({
    marginBottom: isMobile ? '12px' : '16px',
    borderRadius: '8px',
    ...style
  });

  const getBodyStyle = () => ({
    padding: isMobile ? '16px' : isTablet ? '20px' : '24px',
    ...bodyStyle
  });

  const getTitleLevel = () => {
    if (isMobile) return 5;
    if (isTablet) return 4;
    return 4;
  };

  const renderTitle = () => {
    if (!title) return undefined;
    
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        gap: isMobile ? '8px' : '16px'
      }}>
        <Title 
          level={getTitleLevel()} 
          style={{ 
            margin: 0,
            fontSize: isMobile ? '16px' : '18px'
          }}
        >
          {title}
        </Title>
        {extra && (
          <div style={{ 
            flexShrink: 0,
            width: isMobile ? '100%' : 'auto',
            textAlign: isMobile ? 'left' : 'right'
          }}>
            {extra}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card
      title={renderTitle()}
      loading={loading}
      style={getCardStyle()}
      bodyStyle={getBodyStyle()}
      actions={actions.length > 0 ? actions : undefined}
      size={isMobile ? 'small' : 'default'}
      {...props}
    >
      {children}
    </Card>
  );
};

export default AdminCard;