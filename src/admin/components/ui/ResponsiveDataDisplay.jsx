import React from 'react';
import { useResponsive } from '../../../hooks/useBreakpoint';
import AdminTable from './AdminTable';
import MobileDataCard from '../mobile/MobileDataCard';

const ResponsiveDataDisplay = ({
  // 表格props
  dataSource = [],
  columns = [],
  loading = false,
  rowKey = 'id',
  pagination,
  scroll,
  
  // 移動端卡片props
  renderMobileCard,
  mobileTitle,
  mobileExtra,
  emptyText = '暫無數據',
  
  // 其他props
  ...props
}) => {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <MobileDataCard
        dataSource={dataSource}
        renderItem={renderMobileCard}
        loading={loading}
        title={mobileTitle}
        extra={mobileExtra}
        emptyText={emptyText}
      />
    );
  }

  return (
    <AdminTable
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      rowKey={rowKey}
      pagination={pagination}
      scroll={scroll}
      {...props}
    />
  );
};

export default ResponsiveDataDisplay;