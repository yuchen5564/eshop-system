import React from 'react';
import { Table } from 'antd';
import { useResponsive } from '../../../hooks/useBreakpoint';

const AdminTable = ({ 
  dataSource, 
  columns, 
  loading = false,
  rowKey = 'id',
  pagination = { pageSize: 10, showSizeChanger: true },
  scroll,
  ...props 
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  const getResponsivePagination = () => {
    if (isMobile) {
      return {
        pageSize: 5,
        showSizeChanger: false,
        showQuickJumper: false,
        showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        size: 'small'
      };
    }
    
    if (isTablet) {
      return {
        pageSize: 8,
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      };
    }
    
    return pagination;
  };

  const getResponsiveScroll = () => {
    // 統一使用橫向滾動，就像優惠券管理頁面一樣
    return scroll || { x: 1200 };
  };

  return (
    <div style={{ 
      overflowX: 'auto',
      background: '#fff',
      borderRadius: '6px'
    }}>
      <Table
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        rowKey={rowKey}
        pagination={getResponsivePagination()}
        scroll={getResponsiveScroll()}
        size={isMobile ? 'small' : 'default'}
        style={{ 
          background: '#fff'
        }}
        {...props}
      />
    </div>
  );
};

export default AdminTable;