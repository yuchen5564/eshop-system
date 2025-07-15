import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Form, 
  Input, 
  Steps, 
  Alert, 
  Typography, 
  Progress,
  Space,
  Result,
  Divider,
  message
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  DatabaseOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  SettingOutlined,
  ShopOutlined,
  GiftOutlined,
  AppstoreOutlined,
  CreditCardOutlined,
  MailOutlined,
  TruckOutlined
} from '@ant-design/icons';
import systemService from '../services/systemService';

const { Title, Paragraph, Text } = Typography;

const SystemInitPage = ({ onInitComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [initStatus, setInitStatus] = useState('');
  const [adminData, setAdminData] = useState(null);
  const [initResults, setInitResults] = useState(null);
  const [form] = Form.useForm();

  const steps = [
    {
      title: 'Firebase 設定',
      icon: <SettingOutlined />,
      content: <FirebaseSetupStep />
    },
    {
      title: '管理員帳戶',
      icon: <UserOutlined />,
      content: <AdminSetupStep />
    },
    {
      title: '系統初始化',
      icon: <DatabaseOutlined />,
      content: <SystemInitStep />
    },
    {
      title: '完成設定',
      icon: <CheckCircleOutlined />,
      content: <CompletionStep />
    }
  ];

  function FirebaseSetupStep() {
    const checkFirebaseConfig = () => {
      const requiredEnvVars = [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_STORAGE_BUCKET',
        'VITE_FIREBASE_MESSAGING_SENDER_ID',
        'VITE_FIREBASE_APP_ID'
      ];

      const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
      
      if (missingVars.length > 0) {
        return {
          configured: false,
          missing: missingVars
        };
      }

      return { configured: true };
    };

    const firebaseConfig = checkFirebaseConfig();

    return (
      <div>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '32px' }}>
          <SettingOutlined style={{ marginRight: '8px' }} />
          Firebase 設定檢查
        </Title>
        
        {firebaseConfig.configured ? (
          <div>
            <Alert
              message="Firebase 設定已完成"
              description="系統已檢測到完整的 Firebase 設定，可以繼續下一步。"
              type="success"
              showIcon
              style={{ marginBottom: '24px' }}
            />
            
            <div style={{ textAlign: 'center' }}>
              <Button type="primary" size="large" onClick={() => setCurrentStep(1)}>
                繼續設定管理員帳戶
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Alert
              message="Firebase 設定未完成"
              description={
                <div>
                  <p>請先完成 Firebase 設定：</p>
                  <ol>
                    <li>在 Firebase Console 創建專案</li>
                    <li>啟用 Authentication 和 Firestore</li>
                    <li>設定環境變數 (.env 文件)</li>
                  </ol>
                  <p>缺少的環境變數：</p>
                  <ul>
                    {firebaseConfig.missing.map(varName => (
                      <li key={varName}><Text code>{varName}</Text></li>
                    ))}
                  </ul>
                </div>
              }
              type="error"
              showIcon
              style={{ marginBottom: '24px' }}
            />
            
            <Card title="環境變數設定範例" type="inner">
              <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '6px', fontFamily: 'monospace' }}>
                <div>VITE_FIREBASE_API_KEY=your-api-key</div>
                <div>VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com</div>
                <div>VITE_FIREBASE_PROJECT_ID=your-project-id</div>
                <div>VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com</div>
                <div>VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id</div>
                <div>VITE_FIREBASE_APP_ID=your-app-id</div>
              </div>
            </Card>
            
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button onClick={() => window.location.reload()}>
                重新檢查設定
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function AdminSetupStep() {
    const handleAdminSetup = async (values) => {
      setLoading(true);
      try {
        // 驗證密碼
        if (values.password !== values.confirmPassword) {
          message.error('兩次輸入的密碼不一致');
          return;
        }

        setAdminData(values);
        setCurrentStep(2);
      } catch (error) {
        message.error('設定失敗');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '32px' }}>
          <UserOutlined style={{ marginRight: '8px' }} />
          創建管理員帳戶
        </Title>
        
        <Alert
          message="管理員帳戶設定"
          description="請設定系統管理員帳戶，此帳戶將用於登入管理後台。"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdminSetup}
          size="large"
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
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button onClick={() => setCurrentStep(0)}>
                上一步
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                開始初始化系統
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    );
  }

  function SystemInitStep() {
    const [initStarted, setInitStarted] = useState(false);
    const [currentInitStep, setCurrentInitStep] = useState(0);
    const [initSteps, setInitSteps] = useState([]);

    const initializationSteps = [
      { title: '創建管理員帳戶', icon: '👤', status: 'pending' },
      { title: '初始化商品分類', icon: '📂', status: 'pending' },
      { title: '載入示例商品', icon: '🛍️', status: 'pending' },
      { title: '設定優惠券', icon: '🎫', status: 'pending' },
      { title: '配置付款方式', icon: '💳', status: 'pending' },
      { title: '設定郵件系統', icon: '📧', status: 'pending' },
      { title: '建立郵件模板', icon: '📝', status: 'pending' },
      { title: '配置物流設定', icon: '🚚', status: 'pending' }
    ];

    const startInitialization = async () => {
      setInitStarted(true);
      setLoading(true);
      setInitProgress(0);
      setCurrentInitStep(0);
      setInitSteps([...initializationSteps]);
      
      try {
        setInitStatus('準備開始初始化...');
        
        // 使用進度回調來即時更新進度
        const progressCallback = (progressInfo) => {
          setInitProgress(progressInfo.progress);
          setInitStatus(progressInfo.message);
          setCurrentInitStep(progressInfo.step);
          
          // 更新步驟狀態
          setInitSteps(prevSteps => 
            prevSteps.map((step, index) => {
              if (index < progressInfo.step - 1) {
                return { ...step, status: 'completed' };
              } else if (index === progressInfo.step - 1) {
                return { 
                  ...step, 
                  status: progressInfo.status === 'error' ? 'error' : 
                          progressInfo.status === 'completed' ? 'completed' : 'processing'
                };
              }
              return step;
            })
          );
          
          // 如果有錯誤，顯示錯誤狀態
          if (progressInfo.status === 'error') {
            message.error(progressInfo.message);
          }
        };
        
        const result = await systemService.initializeSystem(adminData, progressCallback);
        
        if (result.success) {
          setInitProgress(100);
          setInitStatus('系統初始化完成！所有組件已成功配置');
          setInitResults(result.results);
          
          // 標記所有步驟為完成
          setInitSteps(prevSteps => 
            prevSteps.map(step => ({ ...step, status: 'completed' }))
          );
          
          message.success('系統初始化完成！');
          
          // 延遲一下再進入下一步
          setTimeout(() => {
            setCurrentStep(3);
          }, 2000);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        setInitStatus(`初始化失敗: ${error.message}`);
        message.error('系統初始化失敗');
        console.error('System initialization error:', error);
        
        // 標記當前步驟為錯誤
        setInitSteps(prevSteps => 
          prevSteps.map((step, index) => {
            if (index === currentInitStep - 1) {
              return { ...step, status: 'error' };
            }
            return step;
          })
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <div>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '32px' }}>
          <DatabaseOutlined style={{ marginRight: '8px' }} />
          系統初始化
        </Title>
        
        {!initStarted ? (
          <div>
            <Alert
              message="準備初始化系統"
              description={
                <div>
                  <p>系統將為您初始化以下內容：</p>
                  <ul>
                    <li><AppstoreOutlined /> 商品分類 (蔬菜、水果、穀物等)</li>
                    <li><ShopOutlined /> 示例商品資料</li>
                    <li><GiftOutlined /> 優惠券模板</li>
                    <li><CreditCardOutlined /> 付款方式設定</li>
                    <li><MailOutlined /> 郵件系統設定</li>
                    <li><TruckOutlined /> 物流配送設定</li>
                    <li><UserOutlined /> 管理員帳戶</li>
                  </ul>
                  <p>此過程可能需要幾分鐘時間。</p>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />
            
            <div style={{ textAlign: 'center' }}>
              <Space>
                <Button onClick={() => setCurrentStep(1)}>
                  上一步
                </Button>
                <Button type="primary" size="large" onClick={startInitialization}>
                  開始初始化
                </Button>
              </Space>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              {loading ? (
                <LoadingOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              ) : (
                <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
              )}
            </div>
            
            {/* 總體進度條 */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Text strong>初始化進度</Text>
                <Text>{initProgress}%</Text>
              </div>
              <Progress 
                percent={initProgress} 
                status={loading ? 'active' : 'success'}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                style={{ marginBottom: '8px' }}
              />
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">{initStatus}</Text>
              </div>
            </div>
            
            {/* 詳細步驟列表 */}
            <div style={{ 
              background: '#fafafa', 
              border: '1px solid #d9d9d9', 
              borderRadius: '6px', 
              padding: '16px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              <Title level={5} style={{ margin: '0 0 16px 0', textAlign: 'center' }}>
                初始化步驟
              </Title>
              {initSteps.map((step, index) => (
                <div 
                  key={index}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '8px 12px',
                    margin: '4px 0',
                    borderRadius: '4px',
                    backgroundColor: step.status === 'processing' ? '#e6f7ff' : 
                                   step.status === 'completed' ? '#f6ffed' :
                                   step.status === 'error' ? '#fff2f0' : '#fff',
                    border: step.status === 'processing' ? '1px solid #91d5ff' :
                           step.status === 'completed' ? '1px solid #b7eb8f' :
                           step.status === 'error' ? '1px solid #ffccc7' : '1px solid #f0f0f0'
                  }}
                >
                  <div style={{ fontSize: '20px', marginRight: '12px' }}>
                    {step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text 
                      style={{ 
                        fontWeight: step.status === 'processing' ? 'bold' : 'normal',
                        color: step.status === 'error' ? '#ff4d4f' : 
                               step.status === 'completed' ? '#52c41a' :
                               step.status === 'processing' ? '#1890ff' : '#666'
                      }}
                    >
                      {step.title}
                    </Text>
                  </div>
                  <div>
                    {step.status === 'completed' && (
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                    )}
                    {step.status === 'processing' && (
                      <LoadingOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                    )}
                    {step.status === 'error' && (
                      <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
                    )}
                    {step.status === 'pending' && (
                      <div style={{ 
                        width: '16px', 
                        height: '16px', 
                        borderRadius: '50%', 
                        backgroundColor: '#d9d9d9' 
                      }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function CompletionStep() {
    return (
      <div>
        <Result
          status="success"
          title="系統初始化完成！"
          subTitle="農鮮市集系統已成功初始化，您現在可以開始使用管理功能。"
          extra={[
            <div key="info" style={{ marginBottom: '24px' }}>
              <Card title="管理員帳戶資訊" type="inner">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>管理員信箱：</Text>
                    <Text code>{adminData?.email}</Text>
                  </div>
                  <div>
                    <Text strong>管理員姓名：</Text>
                    <Text>{adminData?.displayName}</Text>
                  </div>
                </Space>
              </Card>
            </div>,
            <div key="stats" style={{ marginBottom: '24px' }}>
              <Card title="初始化統計" type="inner">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <AppstoreOutlined style={{ marginRight: '8px' }} />
                    商品分類：{initResults?.categories?.count || 0} 個
                  </div>
                  <div>
                    <ShopOutlined style={{ marginRight: '8px' }} />
                    示例商品：{initResults?.products?.count || 0} 個
                  </div>
                  <div>
                    <GiftOutlined style={{ marginRight: '8px' }} />
                    優惠券：{initResults?.coupons?.count || 0} 個
                  </div>
                  <div>
                    <CreditCardOutlined style={{ marginRight: '8px' }} />
                    付款方式：{initResults?.paymentMethods?.count || 0} 個
                  </div>
                  <div>
                    <MailOutlined style={{ marginRight: '8px' }} />
                    郵件模板：{initResults?.emailTemplates?.count || 0} 個
                  </div>
                  <div>
                    <TruckOutlined style={{ marginRight: '8px' }} />
                    物流設定：{initResults?.logisticsSettings?.success ? '1' : '0'} 個
                  </div>
                </Space>
              </Card>
            </div>,
            <Button 
              key="start" 
              type="primary" 
              size="large" 
              onClick={onInitComplete}
            >
              開始使用系統
            </Button>
          ]}
        />
        
        <Alert
          message="重要提醒"
          description="請妥善保管管理員帳戶資訊。您可以隨時在系統設定中管理這些資料。"
          type="warning"
          showIcon
          style={{ marginTop: '24px' }}
        />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5', 
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={1}>🌱 農鮮市集系統初始化</Title>
          <Paragraph>
            歡迎使用農鮮市集！首次使用需要進行系統初始化設定。
          </Paragraph>
        </div>

        <Card>
          <Steps 
            current={currentStep} 
            style={{ marginBottom: '40px' }}
            items={steps.map(step => ({
              title: step.title,
              icon: step.icon
            }))}
          />

          <div style={{ minHeight: '400px' }}>
            {steps[currentStep].content}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemInitPage;