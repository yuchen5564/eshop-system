import React, { useState, useEffect } from 'react';
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
  Modal,
  Tag,
  Alert
} from 'antd';
import {
  UserOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ShoppingOutlined,
  GiftOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import emailService from '../services/emailService';
import couponService from '../services/couponService';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CheckoutPage = ({ 
  cart, 
  getTotalPrice, 
  onPageChange, 
  onOrderComplete,
  appliedCoupon,
  discountAmount = 0
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderData, setOrderData] = useState({});
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orderSuccessModalVisible, setOrderSuccessModalVisible] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const shippingFee = 100;
  const subtotal = getTotalPrice();
  const totalAmount = subtotal + shippingFee - discountAmount;

  // 載入啟用的付款方式
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const result = await paymentService.getActivePaymentMethods();
        if (result.success) {
          // 轉換格式為結帳頁面所需格式
          const formattedMethods = result.data.map(method => ({
            value: method.id,
            label: method.name,
            icon: method.icon,
            type: method.type,
            description: method.description,
            settings: method.settings
          }));
          setPaymentMethods(formattedMethods);
        }
      } catch (error) {
        console.error('載入付款方式失敗:', error);
        // 如果載入失敗，使用預設方式
        setPaymentMethods([
          { value: 'credit_card', label: '信用卡付款', icon: '💳' },
          { value: 'bank_transfer', label: '銀行轉帳', icon: '🏦' },
          { value: 'cash_on_delivery', label: '貨到付款', icon: '💰' }
        ]);
      }
    };

    loadPaymentMethods();
  }, []);

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
    
    try {
      const orderId = `ORD${Date.now()}`;
      const orderData = {
        id: orderId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        orderDate: new Date().toISOString(),
        status: 'pending',
        subtotal: subtotal,
        discountAmount: discountAmount,
        appliedCoupon: appliedCoupon,
        couponInfo: appliedCoupon ? {
          code: appliedCoupon.code,
          name: appliedCoupon.name,
          type: appliedCoupon.type,
          description: appliedCoupon.description
        } : null,
        total: totalAmount,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          farm: item.farm || '',
          location: item.location || ''
        })),
        shippingAddress: `${data.city} ${data.address}`,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === 'credit_card' ? 'paid' : 'pending',
        notes: data.notes || '',
        shippingInfo: null,
        emailNotifications: {
          orderConfirmation: { 
            sent: false, 
            sentAt: null, 
            status: 'pending' 
          }
        }
      };

      // 儲存訂單到 Firestore
      const saveResult = await orderService.addWithId(orderId, orderData);
      if (!saveResult.success) {
        throw new Error('訂單儲存失敗');
      }

      // 使用優惠券
      if (appliedCoupon) {
        const useCouponResult = await couponService.useCoupon(appliedCoupon.code, 'guest', orderId);
        if (!useCouponResult.success) {
          console.warn('Failed to update coupon usage:', useCouponResult.error);
        }
      }

      // 發送訂單確認郵件（不影響訂單成功與否）
      let emailResult = { success: false };
      try {
        emailResult = await emailService.sendOrderConfirmationEmail(orderData);
      } catch (emailError) {
        console.warn('Email service error:', emailError);
      }
      
      // 更新郵件發送狀態（不影響訂單成功與否）
      try {
        if (emailResult.success) {
          await orderService.update(saveResult.id, {
            emailNotifications: {
              orderConfirmation: {
                sent: true,
                sentAt: new Date().toISOString(),
                status: 'delivered'
              }
            }
          });
        } else {
          await orderService.update(saveResult.id, {
            emailNotifications: {
              orderConfirmation: {
                sent: false,
                sentAt: new Date().toISOString(),
                status: 'failed'
              }
            }
          });
        }
      } catch (updateError) {
        console.warn('Failed to update email status:', updateError);
      }
      
      // 設置訂單結果並顯示成功 Modal
      setOrderResult({
        orderId,
        emailSuccess: emailResult.success
      });
      setOrderSuccessModalVisible(true);
      
      message.success('訂單已成功提交！');
    } catch (error) {
      console.error('訂單提交失敗:', error);
      message.error('訂單提交失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
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
                        {method.description && (
                          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                            {method.description}
                          </div>
                        )}
                        {method.settings && (
                          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                            {method.settings.processingTime && (
                              <span>處理時間: {method.settings.processingTime}</span>
                            )}
                            {method.settings.extraFee && (
                              <span> • 手續費: NT$ {method.settings.extraFee}</span>
                            )}
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

            {/* 優惠券資訊 */}
            {appliedCoupon && (
              <Card title="優惠券資訊" style={{ marginBottom: '16px' }}>
                <Alert
                  message={
                    <Space>
                      <Tag 
                        icon={appliedCoupon.type === 'fixed' ? <GiftOutlined /> : <PercentageOutlined />}
                        color={appliedCoupon.type === 'fixed' ? 'blue' : 'orange'}
                      >
                        {appliedCoupon.code}
                      </Tag>
                      <Text strong>{appliedCoupon.name}</Text>
                    </Space>
                  }
                  description={
                    <div>
                      <div>{appliedCoupon.description}</div>
                      <div style={{ color: '#52c41a', fontWeight: 'bold', marginTop: '4px' }}>
                        折扣金額：NT$ {discountAmount}
                      </div>
                    </div>
                  }
                  type="success"
                  showIcon
                />
              </Card>
            )}
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
                  <Text strong>NT$ {subtotal}</Text>
                </Row>
                <Row justify="space-between">
                  <Text>運費</Text>
                  <Text strong>NT$ {shippingFee}</Text>
                </Row>
                {appliedCoupon && discountAmount > 0 && (
                  <Row justify="space-between">
                    <Text>優惠折扣</Text>
                    <Text strong style={{ color: '#52c41a' }}>-NT$ {discountAmount}</Text>
                  </Row>
                )}
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
      
      {/* 訂單成功 Modal */}
      <Modal
        title={
          <div style={{ textAlign: 'center' }}>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '48px', marginBottom: '16px' }} />
            <div>訂單提交成功！</div>
          </div>
        }
        open={orderSuccessModalVisible}
        onOk={() => {
          setOrderSuccessModalVisible(false);
          onOrderComplete?.();
          onPageChange('home');
        }}
        onCancel={() => {
          setOrderSuccessModalVisible(false);
          onOrderComplete?.();
          onPageChange('home');
        }}
        okText="返回首頁"
        cancelText="繼續購物"
        centered
        width={500}
      >
        {orderResult && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '16px', marginBottom: '16px' }}>
              您的訂單編號：<Text strong style={{ color: '#1890ff' }}>{orderResult.orderId}</Text>
            </p>
            <p style={{ marginBottom: '16px' }}>
              我們將盡快為您處理訂單，感謝您的購買！
            </p>
            {orderResult.emailSuccess ? (
              <p style={{ color: '#52c41a', marginBottom: '8px' }}>
                ✅ 訂單確認郵件已發送至您的信箱
              </p>
            ) : (
              <p style={{ color: '#faad14', marginBottom: '8px' }}>
                ⚠️ 訂單已建立，但郵件發送可能有延遲
              </p>
            )}
            <div style={{ 
              background: '#f6ffed', 
              border: '1px solid #b7eb8f', 
              borderRadius: '6px', 
              padding: '12px', 
              marginTop: '16px',
              fontSize: '14px',
              color: '#389e0d'
            }}>
              💡 您可以隨時聯繫我們查詢訂單狀態
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CheckoutPage;