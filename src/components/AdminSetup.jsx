import React, { useState } from 'react';
import { Card, Button, Form, Input, Steps, Alert, Typography, Space, message } from 'antd';
import { UserOutlined, LockOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { signUp, signIn } from '../services/authService';

const { Title, Paragraph, Text } = Typography;

const AdminSetup = ({ onSetupComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState(null);
  const [form] = Form.useForm();

  const steps = [
    {
      title: '創建管理員帳戶',
      content: <CreateAdminForm />
    },
    {
      title: '設置完成',
      content: <SetupComplete />
    }
  ];

  function CreateAdminForm() {
    const handleCreateAdmin = async (values) => {
      setLoading(true);
      try {
        // 創建管理員帳戶
        const result = await signUp(values.email, values.password, values.displayName);
        
        if (result.success) {
          setAdminCredentials(values);
          message.success('管理員帳戶創建成功！');
          setCurrentStep(1);
        } else {
          message.error(`創建失敗: ${result.error}`);
        }
      } catch (error) {
        message.error('創建管理員帳戶時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    const handleUseExisting = async (values) => {
      setLoading(true);
      try {
        // 使用現有帳戶登入
        const result = await signIn(values.email, values.password);
        
        if (result.success) {
          setAdminCredentials(values);
          message.success('登入成功！');
          onSetupComplete?.();
        } else {
          message.error(`登入失敗: ${result.error}`);
        }
      } catch (error) {
        message.error('登入時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div>
        <Alert
          message="管理員設定"
          description={
            <div>
              <p>請選擇以下方式之一來設定管理員權限：</p>
              <ul>
                <li><strong>創建新的管理員帳戶</strong>：系統會自動創建一個新的管理員帳戶</li>
                <li><strong>使用現有帳戶</strong>：如果您已有Firebase帳戶，可以直接使用</li>
              </ul>
            </div>
          }
          type="info"
          style={{ marginBottom: 24 }}
        />

        <Card title="創建新的管理員帳戶" style={{ marginBottom: 16 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateAdmin}
          >
            <Form.Item
              name="displayName"
              label="管理員姓名"
              rules={[{ required: true, message: '請輸入管理員姓名' }]}
            >
              <Input 
                prefix={<UserOutlined />}
                placeholder="請輸入管理員姓名"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="管理員信箱"
              rules={[
                { required: true, message: '請輸入管理員信箱' },
                { type: 'email', message: '請輸入有效的信箱格式' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />}
                placeholder="admin@example.com"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密碼"
              rules={[
                { required: true, message: '請輸入密碼' },
                { min: 6, message: '密碼至少需要6個字符' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="請輸入密碼"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="確認密碼"
              dependencies={['password']}
              rules={[
                { required: true, message: '請確認密碼' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('兩次輸入的密碼不一致'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="請再次輸入密碼"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
              >
                創建管理員帳戶
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="使用現有帳戶">
          <Form
            layout="vertical"
            onFinish={handleUseExisting}
          >
            <Form.Item
              name="email"
              label="現有帳戶信箱"
              rules={[
                { required: true, message: '請輸入信箱' },
                { type: 'email', message: '請輸入有效的信箱格式' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />}
                placeholder="your@email.com"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密碼"
              rules={[{ required: true, message: '請輸入密碼' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="請輸入密碼"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
              >
                使用現有帳戶
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }

  function SetupComplete() {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '24px' }} />
        <Title level={2}>管理員設定完成！</Title>
        <Paragraph>
          恭喜！您已成功設定管理員帳戶。現在可以使用以下帳戶進入管理後台：
        </Paragraph>
        
        {adminCredentials && (
          <Card style={{ textAlign: 'left', maxWidth: '400px', margin: '24px auto' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>管理員信箱：</Text>
                <Text code>{adminCredentials.email}</Text>
              </div>
              {adminCredentials.displayName && (
                <div>
                  <Text strong>管理員姓名：</Text>
                  <Text>{adminCredentials.displayName}</Text>
                </div>
              )}
            </Space>
          </Card>
        )}

        <Alert
          message="重要提醒"
          description="請妥善保管管理員帳戶資訊，建議您將密碼儲存在安全的地方。"
          type="warning"
          style={{ marginTop: '24px' }}
        />

        <Button 
          type="primary" 
          size="large" 
          style={{ marginTop: '24px' }}
          onClick={onSetupComplete}
        >
          進入管理後台
        </Button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={1}>管理員設定</Title>
          <Paragraph>
            歡迎使用農鮮市集管理系統！請完成以下設定以開始使用管理功能。
          </Paragraph>
        </div>

        <Card>
          <Steps current={currentStep} style={{ marginBottom: '32px' }}>
            {steps.map(item => (
              <Steps.Step key={item.title} title={item.title} />
            ))}
          </Steps>

          {steps[currentStep].content}
        </Card>
      </div>
    </div>
  );
};

export default AdminSetup;