import React, { useState } from 'react';
import { Dropdown, Avatar, Typography, Modal, message } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';
import { signOutUser } from '../../../services/authService';

const { Text } = Typography;

const UserDropdown = ({ onBackToSite }) => {
  const { user } = useAuth();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutLoading(true);
    try {
      const result = await signOutUser();
      if (result.success) {
        message.success('登出成功');
        setLogoutModalVisible(false);
        setTimeout(() => {
          onBackToSite();
        }, 500);
      } else {
        message.error('登出失敗');
      }
    } catch (error) {
      message.error('登出失敗');
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutModalVisible(false);
  };

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'logout':
        handleLogout();
        break;
      case 'profile':
        message.info('個人資料功能開發中...');
        break;
      case 'settings':
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
    <>
      <Dropdown
        menu={{ items: userMenuItems, onClick: handleMenuClick }}
        placement="bottomRight"
        arrow
        trigger={['click']}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '6px',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f0f0f0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        >
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{user?.displayName || user?.email || '管理員'}</Text>
          <DownOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
        </div>
      </Dropdown>
      
      <Modal
        title="確認登出"
        open={logoutModalVisible}
        onOk={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        confirmLoading={logoutLoading}
        okText="確定"
        cancelText="取消"
        centered
      >
        <p>您確定要登出管理後台嗎？</p>
      </Modal>
    </>
  );
};

export default UserDropdown;