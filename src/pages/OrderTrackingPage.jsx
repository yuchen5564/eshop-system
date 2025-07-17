import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Space, Typography, Alert, Divider, Tag, Descriptions, List, message } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, PhoneOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useResponsive } from '../hooks/useBreakpoint';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';
import { logisticsService } from '../services/logisticsService';

const { Title, Text } = Typography;

const OrderTrackingPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingCarriers, setShippingCarriers] = useState([]);
  const { isMobile } = useResponsive();

  // 載入付款方式選項和貨運公司選項
  useEffect(() => {
    loadPaymentMethods();
    loadShippingCarriers();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const result = await paymentService.getAll();
      if (result.success && result.data.length > 0) {
        const formattedMethods = result.data.map(method => ({
          value: method.id,
          label: method.name,
          icon: method.icon || '💳'
        }));
        setPaymentMethods(formattedMethods);
      } else {
        // 使用預設選項
        const defaultMethods = [
          { value: 'credit_card', label: '信用卡付款', icon: '💳' },
          { value: 'bank_transfer', label: '銀行轉帳', icon: '🏦' },
          { value: 'cash_on_delivery', label: '貨到付款', icon: '💰' }
        ];
        setPaymentMethods(defaultMethods);
      }
    } catch (error) {
      console.error('載入付款方式失敗:', error);
      // 使用預設選項
      const defaultMethods = [
        { value: 'credit_card', label: '信用卡付款', icon: '💳' },
        { value: 'bank_transfer', label: '銀行轉帳', icon: '🏦' },
        { value: 'cash_on_delivery', label: '貨到付款', icon: '💰' }
      ];
      setPaymentMethods(defaultMethods);
    }
  };

  // 獲取付款方式顯示標籤的輔助函數
  const getPaymentMethodLabel = (paymentMethodId) => {
    const method = paymentMethods.find(method => method.value === paymentMethodId);
    return method ? method.label : paymentMethodId; // 找不到時顯示原始ID
  };

  // 獲取貨運公司顯示標籤的輔助函數
  const getShippingCarrierLabel = (carrierId) => {
    const carrier = shippingCarriers.find(carrier => carrier.value === carrierId);
    return carrier ? carrier.label : carrierId;
  };

  const loadShippingCarriers = async () => {
    try {
      const result = await logisticsService.getShippingCarriers();
      if (result.success && result.data.length > 0) {
        setShippingCarriers(result.data);
      } else {
        // 使用預設選項
        const defaultCarriers = [
          { value: 'post_office', label: '中華郵政', trackingUrlTemplate: 'https://trackings.post.gov.tw/?id={trackingNumber}' },
          { value: 'fedex', label: 'FedEx', trackingUrlTemplate: 'https://www.fedex.com/fedextrack/?tracknumbers={trackingNumber}' },
          { value: 'black_cat', label: '黑貓宅急便', trackingUrlTemplate: 'https://www.t-cat.com.tw/inquire/trace.aspx?no={trackingNumber}' },
          { value: 'hct', label: '新竹物流', trackingUrlTemplate: 'https://www.hct.com.tw/business/service/query_cargo?no={trackingNumber}' }
        ];
        setShippingCarriers(defaultCarriers);
      }
    } catch (error) {
      console.error('載入貨運公司失敗:', error);
      const defaultCarriers = [
        { value: 'post_office', label: '中華郵政', trackingUrlTemplate: 'https://trackings.post.gov.tw/?id={trackingNumber}' },
        { value: 'fedex', label: 'FedEx', trackingUrlTemplate: 'https://www.fedex.com/fedextrack/?tracknumbers={trackingNumber}' },
        { value: 'black_cat', label: '黑貓宅急便', trackingUrlTemplate: 'https://www.t-cat.com.tw/inquire/trace.aspx?no={trackingNumber}' },
        { value: 'hct', label: '新竹物流', trackingUrlTemplate: 'https://www.hct.com.tw/business/service/query_cargo?no={trackingNumber}' }
      ];
      setShippingCarriers(defaultCarriers);
    }
  };

  const handleSearch = async (values) => {
    setLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const result = await orderService.trackOrder(values.orderNumber, values.phone);
      console.log('查詢結果:', result);
      
      if (result.success) {
        setOrderData(result.data);
        message.success('訂單查詢成功！');
      } else {
        setError(result.error || '查詢失敗，請檢查訂單編號和電話號碼是否正確');
        console.error('查詢失敗:', result.error);
        message.error('查詢失敗');
      }
    } catch (err) {
      setError('系統錯誤，請稍後再試');
      message.error('系統錯誤');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'orange',
      'confirmed': 'blue',
      'processing': 'purple',
      'shipped': 'cyan',
      'delivered': 'green',
      'cancelled': 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      'pending': '待確認',
      'confirmed': '已確認',
      'processing': '處理中',
      'shipped': '已出貨',
      'delivered': '已送達',
      'cancelled': '已取消'
    };
    return texts[status] || '未知狀態';
  };

  const paymentStatusOptions = [
    { value: 'pending', label: '待付款', color: 'orange' },
    { value: 'paid', label: '已付款', color: 'green' },
    { value: 'failed', label: '付款失敗', color: 'red' },
    { value: 'refunded', label: '已退款', color: 'purple' }
  ];

  return (
    <div style={{ 
      padding: isMobile ? '16px' : '24px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <Title 
        level={isMobile ? 3 : 2} 
        style={{ 
          textAlign: 'center', 
          marginBottom: isMobile ? '24px' : '40px' 
        }}
      >
        <ShoppingCartOutlined style={{ marginRight: '8px' }} />
        訂單查詢
      </Title>

      {/* 查詢表單 */}
      <Card style={{ marginBottom: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
          size={isMobile ? 'middle' : 'large'}
        >
          <Form.Item
            label="訂單編號"
            name="orderNumber"
            rules={[
              { required: true, message: '請輸入訂單編號' },
              { min: 8, message: '訂單編號至少8位數' }
            ]}
          >
            <Input
              prefix={<SearchOutlined />}
              placeholder="請輸入您的訂單編號"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="電話號碼"
            name="phone"
            rules={[
              { required: true, message: '請輸入電話號碼' },
              { pattern: /^09\d{8}$/, message: '請輸入正確的手機號碼格式' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="請輸入訂購時的電話號碼"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size={isMobile ? 'middle' : 'large'}
              style={{ 
                width: '100%',
                borderRadius: '8px',
                height: isMobile ? '40px' : '48px'
              }}
            >
              查詢訂單
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 錯誤提示 */}
      {error && (
        <Alert
          type="error"
          message="查詢失敗"
          description={error}
          style={{ marginBottom: '24px' }}
          closable
          onClose={() => setError(null)}
        />
      )}

      {/* 訂單資訊 */}
      {orderData && (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 訂單狀態 */}
          <Card>          
            <Descriptions 
              title={`訂單資訊 ${orderData.id}`}
              column={isMobile ? 1 : 2}
              bordered
              size="small"
            >
              <Descriptions.Item label="訂單日期">
                {orderData.createdAt ? new Date(orderData.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="訂單金額">NT$ {(orderData.total || 0).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="付款方式">
                {getPaymentMethodLabel(orderData.paymentMethod) || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="運費">
                NT$ {orderData.shippingFee ? orderData.shippingFee : '100'}
              </Descriptions.Item>
              <Descriptions.Item label="訂單狀態">
                <Tag color={getStatusColor(orderData.status)}>
                  {getStatusText(orderData.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="付款狀態">
                <Tag color={paymentStatusOptions.find(option => option.value === orderData.paymentStatus)?.color || 'default'}>
                  {paymentStatusOptions.find(option => option.value === orderData.paymentStatus)?.label || orderData.paymentStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="訂單備註" span={isMobile ? 1 : 2}>
                {orderData.notes || '無'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 客戶資訊 */}
          <Card title="客戶資訊">
            <Descriptions column={isMobile ? 1 : 2} size="small">
              <Descriptions.Item label={<><UserOutlined />　姓名</>}>
                {orderData.customerName || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label={<><PhoneOutlined />　電話</>}>
                {orderData.customerPhone || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label={<><MailOutlined />　信箱</>}>
                {orderData.customerEmail || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="配送地址" span={isMobile ? 1 : 2}>
                {orderData. shippingAddress || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 訂單商品 */}
          <Card title="訂單商品">
            <List
              itemLayout="horizontal"
              dataSource={orderData.items || []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '24px',
                        background: '#f0f0f0',
                        borderRadius: '8px'
                      }}>
                        {item.image || '📦'}
                      </div>
                    }
                    title={item.name}
                    description={`${item.quantity} ${item.unit || '個'} × NT$ ${item.price}`}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <Text strong>NT$ {(item.quantity * item.price).toLocaleString()}</Text>
                  </div>
                </List.Item>
              )}
            />
            
            <Divider />
            <div style={{ textAlign: 'right' }}>
              <Text strong style={{ fontSize: '18px' }}>
                總計：NT$ {(orderData.total || 0).toLocaleString()}
              </Text>
            </div>
          </Card>

          {/* 貨運資訊 */}
          <Card title="貨運資訊">
            {orderData.shippingInfo ? (
              <div>
                <Descriptions column={isMobile ? 1 : 2} size="small" bordered>
                  <Descriptions.Item label="貨運公司">
                    {getShippingCarrierLabel(orderData.shippingInfo.carrier)}
                  </Descriptions.Item>
                  <Descriptions.Item label="追蹤編號">
                    {orderData.shippingInfo.trackingNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="出貨時間">
                    {orderData.shippingInfo.shippedDate ? 
                      new Date(orderData.shippingInfo.shippedDate).toLocaleString('zh-TW') : 
                      'N/A'
                    }
                  </Descriptions.Item>
                  <Descriptions.Item label="預計送達">
                    {orderData.shippingInfo.estimatedDelivery || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="出貨備註" span={isMobile ? 1 : 2}>
                    {orderData.shippingInfo.notes}
                  </Descriptions.Item>
                </Descriptions>
                
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  {orderData.status === 'pending' || orderData.status === 'processing' 
                    ? '訂單正在處理中，尚未出貨' 
                    : '暫無出貨資訊'
                  }
                </Text>
              </div>
            )}
          </Card>
        </Space>
      )}
    </div>
  );
};

export default OrderTrackingPage;