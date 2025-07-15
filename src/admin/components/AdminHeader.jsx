import React from 'react';
import { Layout, Button, Dropdown, Avatar, Space, Typography, Modal, message } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { signOutUser } from '../../services/authService';

const { Header } = Layout;
const { Text } = Typography;

const AdminHeader = ({ collapsed, onToggleCollapse, onBackToSite, style }) => {
  const { user } = useAuth();

  const handleLogout = () => {
    Modal.confirm({
      title: '確認登出',
      content: '您確定要登出管理後台嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = await signOutUser();
          if (result.success) {
            console.log('Logout successful');
            message.success('登出成功');
            // 登出後會自動觸發AuthContext的狀態更新，回到登入頁面
          } else {
            console.log('Logout failed:', result.error);
            message.error('登出失敗');
          }
        } catch (error) {
          console.log('Logout error:', error);
          message.error('登出失敗');
        }
      }
    });
  };

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'logout':
        handleLogout();
        break;
      case 'profile':
        // 實作個人資料功能
        message.info('個人資料功能開發中...');
        break;
      case 'settings':
        // 實作設定功能
        message.info('設定功能開發中...');
        break;
      default:
        break;
    }
  };

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
      justifyContent: 'space-between',
      ...style
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
          menu={{ items: userMenuItems, onClick: handleMenuClick }}
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
            <Text>{user?.displayName || user?.email || '管理員'}</Text>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AdminHeader;