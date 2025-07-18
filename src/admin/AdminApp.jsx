import React, { useState, useEffect } from 'react';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { AdminLayout } from './components/ui';
import AdminDashboard from './pages/AdminDashboard';
import OrderManagement from './pages/OrderManagement';
import ProductManagement from './pages/ProductManagement';
import CategoryManagement from './pages/CategoryManagement';
import PaymentManagement from './pages/PaymentManagement';
import EmailManagement from './pages/EmailManagement';
import CouponManagement from './pages/CouponManagement';
import LogisticsManagement from './pages/LogisticsManagement';
import UserManagement from './pages/UserManagement';
import SystemSettings from './pages/SystemSettings';
import { EmptyState } from '../components/common';
import { useResponsive } from '../hooks/useBreakpoint';
import { useAuth } from '../contexts/AuthContext';
import { useAdminUser } from '../hooks/useAdminUser';
import permissionService from '../services/permissionService';

const AdminApp = ({ onBackToSite }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const { isMobile } = useResponsive();
  const { user } = useAuth();
  const { adminUser, loading } = useAdminUser();

  // 在移動端預設收合側邊欄
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuSelect = (key) => {
    setSelectedMenu(key);
    
    // 在移動端選擇選單項目後自動收合側邊欄
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return (
          <ProtectedRoute pageKey="dashboard" user={adminUser}>
            <AdminDashboard />
          </ProtectedRoute>
        );
      case 'orders':
        return (
          <ProtectedRoute pageKey="order-management" user={adminUser}>
            <OrderManagement />
          </ProtectedRoute>
        );
      case 'products':
        return (
          <ProtectedRoute pageKey="product-management" user={adminUser}>
            <ProductManagement />
          </ProtectedRoute>
        );
      case 'categories':
        return (
          <ProtectedRoute pageKey="category-management" user={adminUser}>
            <CategoryManagement />
          </ProtectedRoute>
        );
      case 'payments':
        return (
          <ProtectedRoute pageKey="payment-management" user={adminUser}>
            <PaymentManagement />
          </ProtectedRoute>
        );
      case 'emails':
        return (
          <ProtectedRoute pageKey="email-management" user={adminUser}>
            <EmailManagement />
          </ProtectedRoute>
        );
      case 'coupons':
        return (
          <ProtectedRoute pageKey="coupon-management" user={adminUser}>
            <CouponManagement />
          </ProtectedRoute>
        );
      case 'logistics':
        return (
          <ProtectedRoute pageKey="logistics-management" user={adminUser}>
            <LogisticsManagement />
          </ProtectedRoute>
        );
      case 'users':
        return (
          <ProtectedRoute pageKey="user-management" user={adminUser}>
            <UserManagement />
          </ProtectedRoute>
        );
      case 'analytics':
        return (
          <EmptyState 
            icon="📊"
            title="數據分析"
            description="功能開發中..."
          />
        );
      case 'settings':
        return (
          <ProtectedRoute pageKey="system-settings" user={adminUser}>
            <SystemSettings />
          </ProtectedRoute>
        );
      default:
        return (
          <ProtectedRoute pageKey="dashboard" user={adminUser}>
            <AdminDashboard />
          </ProtectedRoute>
        );
    }
  };

  // 如果還在加載用戶資料，顯示加載狀態
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>載入中...</div>
      </div>
    );
  }

  return (
    <AdminLayout
      collapsed={collapsed}
      onCollapse={setCollapsed}
      header={
        <AdminHeader 
          collapsed={collapsed} 
          onToggleCollapse={toggleCollapse}
          onBackToSite={onBackToSite}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000
          }}
        />
      }
      sidebar={
        <AdminSidebar
          selectedKey={selectedMenu}
          onMenuSelect={handleMenuSelect}
          collapsed={collapsed}
          currentUser={adminUser}
          onBreakpoint={(broken) => {
            if (broken) {
              setCollapsed(true);
            }
          }}
        />
      }
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminApp;