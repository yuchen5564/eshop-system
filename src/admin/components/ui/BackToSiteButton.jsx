import React from 'react';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const BackToSiteButton = ({ onBackToSite, style = {} }) => {
  return (
    <Button
      color="default" 
      variant="filled"
      icon={<HomeOutlined />}
      onClick={onBackToSite}
      style={{ marginRight: '8px', ...style }}
    >
      返回網站
    </Button>
  );
};

export default BackToSiteButton;