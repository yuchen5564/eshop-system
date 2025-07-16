import React from 'react';
import { Card, Statistic, Typography } from 'antd';

const { Text } = Typography;

const StatCard = ({ 
  title, 
  value, 
  prefix, 
  suffix, 
  icon, 
  trend,
  trendValue,
  loading = false,
  color = '#1890ff' 
}) => {
  return (
    <Card loading={loading}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <Statistic
            title={title}
            value={value}
            prefix={prefix}
            suffix={suffix}
            valueStyle={{ color, fontSize: '24px', fontWeight: 'bold' }}
          />
          {trend && (
            <div style={{ marginTop: '8px' }}>
              <Text type={trend === 'up' ? 'success' : trend === 'down' ? 'danger' : 'secondary'}>
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
              </Text>
            </div>
          )}
        </div>
        {icon && (
          <div style={{ 
            fontSize: '32px', 
            color, 
            opacity: 0.8,
            marginLeft: '16px'
          }}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;