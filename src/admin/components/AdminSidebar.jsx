import React from 'react';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  FileTextOutlined,
  MailOutlined,
  GiftOutlined,
  TruckOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

const AdminSidebar = ({ selectedKey, onMenuSelect, collapsed }) => {
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '總覽'
    },
    {
      key: 'orders',
      icon: <FileTextOutlined />,
      label: '訂單管理'
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: '商品管理'
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: '產品類別'
    },
    {
      key: 'payments',
      icon: <CreditCardOutlined />,
      label: '付款方式'
    },
    {
      key: 'emails',
      icon: <MailOutlined />,
      label: '郵件管理'
    },
    {
      key: 'coupons',
      icon: <GiftOutlined />,
      label: '折價券管理'
    },
    {
      key: 'logistics',
      icon: <TruckOutlined />,
      label: '物流設定'
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: '用戶管理'
    },
    // {
    //   key: 'analytics',
    //   icon: <BarChartOutlined />,
    //   label: '數據分析'
    // },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系統設定'
    }
  ];

  return (
    <div style={{ 
      height: '100%', 
      borderRight: '1px solid #f0f0f0',
      background: '#fff'
    }}>
      {/* <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #f0f0f0',
        textAlign: 'center'
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🛠️</span>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>管理後台</span>
          </div>
        )}
        {collapsed && <span style={{ fontSize: '24px' }}>🛠️</span>}
      </div> */}
      
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => onMenuSelect(key)}
        style={{ 
          border: 'none', 
          height: '100%',
          overflow: 'auto'
        }}
        inlineCollapsed={collapsed}
      />
    </div>
  );
};

export default AdminSidebar;