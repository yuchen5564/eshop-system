import React from 'react';
import { Layout } from 'antd';
import { AdminBrand, CollapseButton, UserDropdown, BackToSiteButton } from './ui';
import { useResponsive } from '../../hooks/useBreakpoint';

const { Header } = Layout;

const AdminHeader = ({ collapsed, onToggleCollapse, onBackToSite, style }) => {
  const { isMobile, isTablet } = useResponsive();
  
  const getHeaderStyle = () => ({
    background: '#fff', 
    padding: isMobile ? '0 12px' : '0 24px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: isMobile ? '56px' : '64px',
    ...style
  });

  const getLeftSectionStyle = () => ({
    display: 'flex', 
    alignItems: 'center', 
    gap: isMobile ? '8px' : '16px',
    flex: isMobile ? 1 : 'none',
    overflow: 'hidden'
  });

  const getRightSectionStyle = () => ({
    display: 'flex', 
    alignItems: 'center', 
    gap: isMobile ? '8px' : '16px',
    flexShrink: 0
  });

  return (
    <Header style={getHeaderStyle()}>
      <div style={getLeftSectionStyle()}>
        <CollapseButton 
          collapsed={collapsed}
          onToggle={onToggleCollapse}
        />
        {!isMobile && <AdminBrand collapsed={false} />}
      </div>

      <div style={getRightSectionStyle()}>
        {!isMobile && <BackToSiteButton onBackToSite={onBackToSite} />}
        <UserDropdown onBackToSite={onBackToSite} />
      </div>
    </Header>
  );
};

export default AdminHeader;