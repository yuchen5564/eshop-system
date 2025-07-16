import React from 'react';
import { Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';

const CollapseButton = ({ collapsed, onToggle }) => {
  return (
    <Button
      type="text"
      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      onClick={onToggle}
      style={{ fontSize: '16px', width: 40, height: 40 }}
    />
  );
};

export default CollapseButton;