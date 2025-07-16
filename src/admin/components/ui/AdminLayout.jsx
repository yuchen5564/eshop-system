import React from 'react';
import { Layout } from 'antd';
import { useResponsive } from '../../../hooks/useBreakpoint';

const { Content, Sider } = Layout;

const AdminLayout = ({ 
  header, 
  sidebar, 
  children, 
  collapsed, 
  siderWidth = 250,
  collapsedWidth = 80,
  onCollapse 
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  const getMarginLeft = () => {
    if (isMobile) return 0;
    return collapsed ? collapsedWidth : siderWidth;
  };

  const getSiderStyle = () => {
    if (isMobile) {
      return {
        position: 'fixed',
        left: collapsed ? -siderWidth : 0,
        top: '64px',
        bottom: 0,
        zIndex: 1000,
        background: '#fff',
        transition: 'left 0.2s',
        overflow: 'auto'
      };
    }
    
    return {
      background: '#fff',
      position: 'fixed',
      left: 0,
      top: '64px',
      bottom: 0,
      zIndex: 999,
      overflow: 'auto'
    };
  };

  const headerHeight = isMobile ? '56px' : '64px';
  
  return (
    <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {header}
      
      <Layout style={{ 
        marginTop: headerHeight, 
        height: `calc(100vh - ${headerHeight})`
      }}>
        <Sider 
          width={siderWidth} 
          collapsedWidth={isMobile ? 0 : collapsedWidth}
          collapsed={collapsed}
          style={getSiderStyle()}
          breakpoint="lg"
          trigger={null}
        >
          {sidebar}
        </Sider>
        
        <Layout style={{ 
          marginLeft: getMarginLeft(),
          transition: 'margin-left 0.2s'
        }}>
          <Content style={{ 
            background: '#f0f2f5', 
            height: `calc(100vh - ${headerHeight})`,
            overflow: 'auto',
            padding: isMobile ? '12px' : isTablet ? '16px' : '24px'
          }}>
            {children}
          </Content>
        </Layout>
      </Layout>
      
      {/* Mobile overlay */}
      {isMobile && !collapsed && (
        <div 
          style={{
            position: 'fixed',
            top: headerHeight,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            zIndex: 999
          }}
          onClick={() => {
            if (onCollapse) {
              onCollapse(true);
            }
          }}
        />
      )}
    </Layout>
  );
};

export default AdminLayout;