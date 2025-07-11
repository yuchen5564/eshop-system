import React from 'react';
import { Layout, Button, Dropdown, Avatar, Space, Typography } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

const AdminHeader = ({ collapsed, onToggleCollapse, onBackToSite }) => {
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '個人資料'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '設定'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '登出'
    }
  ];

  return (
    <Header style={{ 
      background: '#fff', 
      padding: '0 24px',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapse}
          style={{ fontSize: '16px', width: 40, height: 40 }}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🌱</span>
          <Text strong style={{ fontSize: '16px' }}>農鮮市集 - 管理後台</Text>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button
          type="primary"
          onClick={onBackToSite}
          style={{ marginRight: '8px' }}
        >
          返回網站
        </Button>
        
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{ fontSize: '16px' }}
        />
        
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '6px',
            transition: 'background-color 0.2s'
          }}>
            <Avatar size="small" icon={<UserOutlined />} />
            <Text>管理員</Text>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AdminHeader;