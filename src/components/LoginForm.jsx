import React, { useState } from 'react';
import { Form, Input, Button, Alert, Card, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { signIn } from '../services/authService';

const { Title } = Typography;

const LoginForm = ({ onLoginSuccess, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');

    try {
      const result = await signIn(values.email, values.password);
      
      if (result.success) {
        onLoginSuccess?.(result.user);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('登入過程中發生錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>管理後台登入</Title>
          <p>請使用管理員帳戶登入</p>
        </div>
        
        {error && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '請輸入電子郵件！' },
              { type: 'email', message: '請輸入有效的電子郵件格式！' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="電子郵件" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '請輸入密碼！' },
              { min: 6, message: '密碼至少需要6個字符！' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密碼" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
            >
              登入
            </Button>
          </Form.Item>
          
          {onBack && (
            <Form.Item>
              <Button 
                icon={<ArrowLeftOutlined />}
                onClick={onBack}
                block
              >
                返回首頁
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;