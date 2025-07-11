import React, { useState } from 'react';
import { Layout } from 'antd';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import AdminDashboard from './pages/AdminDashboard';
import OrderManagement from './pages/OrderManagement';
import ProductManagement from './pages/ProductManagement';
import PaymentManagement from './pages/PaymentManagement';

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
      case 'payments':
        return <PaymentManagement />;
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
        return (
          <div style={{ padding: '24px', textAlign: 'center', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>
              <h2>⚙️ 系統設定</h2>
              <p>功能開發中...</p>
            </div>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminHeader 
        collapsed={collapsed} 
        onToggleCollapse={toggleCollapse}
        onBackToSite={onBackToSite}
      />
      
      <Layout>
        <Sider 
          width={250} 
          collapsedWidth={80}
          collapsed={collapsed}
          style={{ background: '#fff' }}
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
        
        <Layout>
          <Content style={{ 
            background: '#f0f2f5', 
            minHeight: 'calc(100vh - 64px)',
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