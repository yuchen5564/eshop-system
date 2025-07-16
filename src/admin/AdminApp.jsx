import React, { useState, useEffect } from 'react';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
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

const AdminApp = ({ onBackToSite }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const { isMobile } = useResponsive();

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
        return <AdminDashboard />;
      case 'orders':
        return <OrderManagement />;
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'emails':
        return <EmailManagement />;
      case 'coupons':
        return <CouponManagement />;
      case 'logistics':
        return <LogisticsManagement />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return (
          <EmptyState 
            icon="📊"
            title="數據分析"
            description="功能開發中..."
          />
        );
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminDashboard />;
    }
  };

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