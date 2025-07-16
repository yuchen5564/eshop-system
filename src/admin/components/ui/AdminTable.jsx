import React from 'react';
import { Table } from 'antd';

const AdminTable = ({ 
  dataSource, 
  columns, 
  loading = false,
  rowKey = 'id',
  pagination = { pageSize: 10, showSizeChanger: true },
  scroll,
  ...props 
}) => {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      rowKey={rowKey}
      pagination={pagination}
      scroll={scroll}
      style={{ background: '#fff' }}
      {...props}
    />
  );
};

export default AdminTable;