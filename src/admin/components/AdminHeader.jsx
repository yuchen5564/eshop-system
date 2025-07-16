import React from 'react';
import { Layout } from 'antd';
import { AdminBrand, CollapseButton, UserDropdown, BackToSiteButton } from './ui';

const { Header } = Layout;

const AdminHeader = ({ collapsed, onToggleCollapse, onBackToSite, style }) => {
  return (
    <Header style={{ 
      background: '#fff', 
      padding: '0 24px',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...style
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <CollapseButton 
          collapsed={collapsed}
          onToggle={onToggleCollapse}
        />
        <AdminBrand collapsed={false} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <BackToSiteButton onBackToSite={onBackToSite} />
        <UserDropdown onBackToSite={onBackToSite} />
      </div>
    </Header>
  );
};

export default AdminHeader;