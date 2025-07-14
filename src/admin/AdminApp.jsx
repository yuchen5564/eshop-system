import React, { useState } from 'react';
import { Layout } from 'antd';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import AdminDashboard from './pages/AdminDashboard';
import OrderManagement from './pages/OrderManagement';
import ProductManagement from './pages/ProductManagement';
import CategoryManagement from './pages/CategoryManagement';
import PaymentManagement from './pages/PaymentManagement';
import EmailManagement from './pages/EmailManagement';
import CouponManagement from './pages/CouponManagement';
import LogisticsManagement from './pages/LogisticsManagement';
import SystemSettings from './pages/SystemSettings';

const { Content, Sider } = Layout;

const AdminApp = ({ onBackToSite }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuSelect = (key) => {
    setSelectedMenu(key);
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
      case 'analytics':
        return (
          <div style={{ padding: '24px', textAlign: 'center', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>
              <h2>📊 數據分析</h2>
              <p>功能開發中...</p>
            </div>
          </div>
        );
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
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
      
      <Layout style={{ marginTop: '64px', height: 'calc(100vh - 64px)' }}>
        <Sider 
          width={250} 
          collapsedWidth={80}
          collapsed={collapsed}
          style={{ 
            background: '#fff',
            position: 'fixed',
            left: 0,
            top: '64px',
            bottom: 0,
            zIndex: 999,
            overflow: 'auto'
          }}
          breakpoint="lg"
          onBreakpoint={(broken) => {
            if (broken) {
              setCollapsed(true);
            }
          }}
        >
          <AdminSidebar
            selectedKey={selectedMenu}
            onMenuSelect={handleMenuSelect}
            collapsed={collapsed}
          />
        </Sider>
        
        <Layout style={{ 
          marginLeft: collapsed ? '80px' : '250px',
          transition: 'margin-left 0.2s'
        }}>
          <Content style={{ 
            background: '#f0f2f5', 
            height: 'calc(100vh - 64px)',
            overflow: 'auto'
          }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminApp;