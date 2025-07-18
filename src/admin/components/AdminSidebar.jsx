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
import permissionService from '../../services/permissionService';

const AdminSidebar = ({ selectedKey, onMenuSelect, collapsed, currentUser }) => {
  // 定義所有菜單項目及其對應的頁面權限
  const allMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '總覽',
      pageKey: 'dashboard'
    },
    {
      key: 'orders',
      icon: <FileTextOutlined />,
      label: '訂單管理',
      pageKey: 'order-management'
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: '商品管理',
      pageKey: 'product-management'
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: '產品類別',
      pageKey: 'category-management'
    },
    {
      key: 'payments',
      icon: <CreditCardOutlined />,
      label: '付款方式',
      pageKey: 'payment-management'
    },
    {
      key: 'emails',
      icon: <MailOutlined />,
      label: '郵件管理',
      pageKey: 'email-management'
    },
    {
      key: 'coupons',
      icon: <GiftOutlined />,
      label: '折價券管理',
      pageKey: 'coupon-management'
    },
    {
      key: 'logistics',
      icon: <TruckOutlined />,
      label: '物流設定',
      pageKey: 'logistics-management'
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: '用戶管理',
      pageKey: 'user-management'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系統設定',
      pageKey: 'system-settings'
    }
  ];

  // 根據用戶權限過濾菜單項目
  const menuItems = allMenuItems.filter(item => {
    // 如果沒有用戶資料，只顯示儀表板
    if (!currentUser) {
      return item.pageKey === 'dashboard';
    }
    
    return permissionService.canAccessPage(currentUser, item.pageKey);
  }).map(item => ({
    key: item.key,
    icon: item.icon,
    label: item.label
  }));

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