import React from 'react';
import { Modal } from 'antd';

const AdminModal = ({
  title,
  children,
  visible,
  onOk,
  onCancel,
  loading = false,
  okText = '確定',
  cancelText = '取消',
  width = 600,
  centered = true,
  destroyOnClose = true,
  ...props
}) => {
  return (
    <Modal
      title={title}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText={okText}
      cancelText={cancelText}
      width={width}
      centered={centered}
      destroyOnClose={destroyOnClose}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default AdminModal;