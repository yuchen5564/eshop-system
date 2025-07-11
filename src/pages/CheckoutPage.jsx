import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Divider,
  Steps,
  Radio,
  Space,
  List,
  message,
  Modal
} from 'antd';
import {
  UserOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ShoppingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CheckoutPage = ({ cart, getTotalPrice, onPageChange, onOrderComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderData, setOrderData] = useState({});
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const shippingFee = 100;
  const totalAmount = getTotalPrice() + shippingFee;

  const paymentMethods = [
    { value: 'credit_card', label: '信用卡付款', icon: '💳' },
    { value: 'bank_transfer', label: '銀行轉帳', icon: '🏦' },
    { value: 'cash_on_delivery', label: '貨到付款', icon: '💰' }
  ];

  const cities = [
    '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
    '基隆市', '新竹市', '嘉義市', '新竹縣', '苗栗縣', '彰化縣',
    '南投縣', '雲林縣', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
    '台東縣', '澎湖縣', '金門縣', '連江縣'
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setOrderData({ ...orderData, ...values });
      
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        // 提交訂單
        handleSubmitOrder({ ...orderData, ...values });
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmitOrder = async (data) => {
    setLoading(true);
    
    // 模擬API調用
    setTimeout(() => {
      const orderId = `ORD${Date.now()}`;
      
      Modal.success({
        title: '訂單提交成功！',
        content: (
          <div>
            <p>您的訂單編號：<Text strong>{orderId}</Text></p>
            <p>我們將盡快為您處理訂單，感謝您的購買！</p>
          </div>
        ),
        onOk: () => {
          onOrderComplete?.();
          onPageChange('home');
        }
      });
      
      setLoading(false);
      message.success('訂單已成功提交！');
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form form={form} layout="vertical">
            <Title level={4}>配送資訊</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="customerName"
                  label="收件人姓名"
                  rules={[{ required: true, message: '請輸入收件人姓名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="請輸入收件人姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="customerPhone"
                  label="聯絡電話"
                  rules={[
                    { required: true, message: '請輸入聯絡電話' },
                    { pattern: /^09\d{8}$/, message: '請輸入正確的手機號碼格式' }
                  ]}
                >
                  <Input placeholder="請輸入聯絡電話" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="customerEmail"
              label="電子郵件"
              rules={[
                { required: true, message: '請輸入電子郵件' },
                { type: 'email', message: '請輸入正確的郵件格式' }
              ]}
            >
              <Input placeholder="請輸入電子郵件" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="city"
                  label="縣市"
                  rules={[{ required: true, message: '請選擇縣市' }]}
                >
                  <Select placeholder="請選擇縣市">
                    {cities.map(city => (
                      <Select.Option key={city} value={city}>{city}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="address"
                  label="詳細地址"
                  rules={[{ required: true, message: '請輸入詳細地址' }]}
                >
                  <Input prefix={<EnvironmentOutlined />} placeholder="請輸入詳細地址" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="notes" label="備註">
              <TextArea rows={3} placeholder="配送備註（選填）" />
            </Form.Item>
          </Form>
        );

      case 1:
        return (
          <Form form={form} layout="vertical">
            <Title level={4}>付款方式</Title>
            <Form.Item
              name="paymentMethod"
              rules={[{ required: true, message: '請選擇付款方式' }]}
            >
              <Radio.Group style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {paymentMethods.map(method => (
                    <Radio key={method.value} value={method.value}>
                      <Card 
                        size="small" 
                        style={{ marginLeft: '24px', width: 'calc(100% - 24px)' }}
                        bodyStyle={{ padding: '12px 16px' }}
                      >
                        <Space>
                          <span style={{ fontSize: '20px' }}>{method.icon}</span>
                          <Text strong>{method.label}</Text>
                        </Space>
                        {method.value === 'bank_transfer' && (
                          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                            請於訂單成立後3天內完成轉帳
                          </div>
                        )}
                        {method.value === 'cash_on_delivery' && (
                          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                            收貨時以現金付款（限特定地區）
                          </div>
                        )}
                      </Card>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Form.Item>
          </Form>
        );

      case 2:
        return (
          <div>
            <Title level={4}>訂單確認</Title>
            
            {/* 商品清單 */}
            <Card title="訂購商品" style={{ marginBottom: '16px' }}>
              <List
                dataSource={cart}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<div style={{ fontSize: '32px' }}>{item.image}</div>}
                      title={item.name}
                      description={`${item.farm} • ${item.location}`}
                    />
                    <div style={{ textAlign: 'right' }}>
                      <div>NT$ {item.price} × {item.quantity}</div>
                      <Text strong style={{ color: '#52c41a' }}>
                        NT$ {item.price * item.quantity}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* 配送資訊 */}
            <Card title="配送資訊" style={{ marginBottom: '16px' }}>
              <Row gutter={[16, 8]}>
                <Col span={6}><Text strong>收件人：</Text></Col>
                <Col span={18}><Text>{orderData.customerName}</Text></Col>
                <Col span={6}><Text strong>聯絡電話：</Text></Col>
                <Col span={18}><Text>{orderData.customerPhone}</Text></Col>
                <Col span={6}><Text strong>電子郵件：</Text></Col>
                <Col span={18}><Text>{orderData.customerEmail}</Text></Col>
                <Col span={6}><Text strong>配送地址：</Text></Col>
                <Col span={18}><Text>{orderData.city} {orderData.address}</Text></Col>
                {orderData.notes && (
                  <>
                    <Col span={6}><Text strong>備註：</Text></Col>
                    <Col span={18}><Text>{orderData.notes}</Text></Col>
                  </>
                )}
              </Row>
            </Card>

            {/* 付款資訊 */}
            <Card title="付款資訊" style={{ marginBottom: '16px' }}>
              <Text strong>
                付款方式：{paymentMethods.find(m => m.value === orderData.paymentMethod)?.label}
              </Text>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '40px 0', width: '100%', minHeight: 'calc(100vh - 200px)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
          結帳
        </Title>

        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card>
              <Steps 
                current={currentStep} 
                style={{ marginBottom: '32px' }}
                items={[
                  {
                    title: '配送資訊',
                    icon: <EnvironmentOutlined />
                  },
                  {
                    title: '付款方式',
                    icon: <CreditCardOutlined />
                  },
                  {
                    title: '訂單確認',
                    icon: <CheckCircleOutlined />
                  }
                ]}
              />

              {renderStepContent()}

              <Divider />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  {currentStep > 0 && (
                    <Button onClick={handlePrev}>
                      上一步
                    </Button>
                  )}
                </div>
                <div>
                  <Button style={{ marginRight: '8px' }} onClick={() => onPageChange('cart')}>
                    返回購物車
                  </Button>
                  <Button 
                    type="primary" 
                    onClick={handleNext}
                    loading={loading}
                  >
                    {currentStep < 2 ? '下一步' : '提交訂單'}
                  </Button>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="訂單摘要" style={{ position: 'sticky', top: '24px' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Row justify="space-between">
                  <Text>商品總計</Text>
                  <Text strong>NT$ {getTotalPrice()}</Text>
                </Row>
                <Row justify="space-between">
                  <Text>運費</Text>
                  <Text strong>NT$ {shippingFee}</Text>
                </Row>
                <Divider style={{ margin: '8px 0' }} />
                <Row justify="space-between">
                  <Title level={4}>總計</Title>
                  <Title level={4} style={{ color: '#52c41a' }}>
                    NT$ {totalAmount}
                  </Title>
                </Row>
                
                <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
                  點擊「提交訂單」即表示您同意我們的服務條款
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CheckoutPage;