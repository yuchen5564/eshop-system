import React from 'react';
import { Layout } from 'antd';

const { Content, Sider } = Layout;

const AdminLayout = ({ 
  header, 
  sidebar, 
  children, 
  collapsed, 
  siderWidth = 250,
  collapsedWidth = 80 
}) => {
  return (
    <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {header}
      
      <Layout style={{ marginTop: '64px', height: 'calc(100vh - 64px)' }}>
        <Sider 
          width={siderWidth} 
          collapsedWidth={collapsedWidth}
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
        >
          {sidebar}
        </Sider>
        
        <Layout style={{ 
          marginLeft: collapsed ? collapsedWidth : siderWidth,
          transition: 'margin-left 0.2s'
        }}>
          <Content style={{ 
            background: '#f0f2f5', 
            height: 'calc(100vh - 64px)',
            overflow: 'auto'
          }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;