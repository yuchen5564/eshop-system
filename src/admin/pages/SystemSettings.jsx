import React, { useState } from 'react';
import { Card, Button, Typography, Space, Alert, Divider, message } from 'antd';
import { DatabaseOutlined, ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import initializationService from '../../services/initializationService';

const { Title, Text, Paragraph } = Typography;

const SystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleInitializeData = async () => {
    setLoading(true);
    try {
      const result = await initializationService.initializeAll();
      if (result.success) {
        message.success(result.message);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('初始化失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleResetData = async () => {
    setResetLoading(true);
    try {
      const result = await initializationService.resetAll();
      if (result.success) {
        message.success(result.message);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('重置失敗');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3} style={{ marginBottom: '24px' }}>系統設定</Title>
      
      {/* Firebase配置說明 */}
      <Card title="Firebase配置" style={{ marginBottom: '24px' }}>
        <Alert
          message="Firebase配置說明"
          description={
            <div>
              <p>在使用系統前，請確保已經正確配置Firebase設置：</p>
              <ol>
                <li>在Firebase控制台創建新項目</li>
                <li>啟用Authentication和Firestore服務</li>
                <li>將配置信息填入.env文件</li>
                <li>點擊下方按鈕初始化數據</li>
              </ol>
            </div>
          }
          type="info"
          showIcon
        />
        
        <Divider />
        
        <Paragraph>
          <Text strong>環境變量配置：</Text>
        </Paragraph>
        <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '6px', fontFamily: 'monospace' }}>
          <div>VITE_FIREBASE_API_KEY=your-api-key</div>
          <div>VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com</div>
          <div>VITE_FIREBASE_PROJECT_ID=your-project-id</div>
          <div>VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com</div>
          <div>VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id</div>
          <div>VITE_FIREBASE_APP_ID=your-app-id</div>
        </div>
      </Card>

      {/* 數據初始化 */}
      <Card title="數據管理" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Title level={4}>
              <DatabaseOutlined style={{ marginRight: '8px' }} />
              數據初始化
            </Title>
            <Paragraph>
              首次使用系統時，需要初始化基礎數據，包括商品分類、示例商品和優惠券等。
            </Paragraph>
            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={handleInitializeData}
              icon={<DatabaseOutlined />}
            >
              初始化基礎數據
            </Button>
          </div>

          <Divider />

          <div>
            <Title level={4}>
              <ReloadOutlined style={{ marginRight: '8px' }} />
              重置數據
            </Title>
            <Alert
              message="危險操作"
              description="此操作將刪除所有現有數據，包括商品、分類、優惠券等。請謹慎操作！"
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Button
              danger
              size="large"
              loading={resetLoading}
              onClick={handleResetData}
              icon={<WarningOutlined />}
            >
              重置所有數據
            </Button>
          </div>
        </Space>
      </Card>

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
        </Space>
      </Card>
    </div>
  );
};

export default SystemSettings;