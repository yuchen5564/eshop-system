import React, { useState } from 'react';
import { Card, Button, Typography, Space, Alert, Divider, message } from 'antd';
import { DatabaseOutlined, ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import UserDebugInfo from '../components/UserDebugInfo';

const { Title, Text, Paragraph } = Typography;

const SystemSettings = () => {

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3} style={{ marginBottom: '24px' }}>系統設定</Title>

      {/* 系統信息 */}
      <Card title="系統信息">
        <Space direction="vertical">
          <div>
            <Text strong>版本：</Text>
            <Text>1.0.0</Text>
          </div>
          <div>
            <Text strong>框架：</Text>
            <Text>React + Vite + Firebase</Text>
          </div>
          <div>
            <Text strong>UI庫：</Text>
            <Text>Ant Design</Text>
          </div>
          <div>
            <Text strong>數據庫：</Text>
            <Text>Firebase Firestore</Text>
          </div>
          <div>
            <Text strong>認證：</Text>
            <Text>Firebase Authentication</Text>
          </div>
          <div>
            <Text strong>信件服務：</Text>
            <Text>Google App Script</Text>
          </div>
        </Space>
      </Card>

      <div style={{ marginTop: '24px' }}>

      <UserDebugInfo />

      </div>

    </div>
  );
};

export default SystemSettings;