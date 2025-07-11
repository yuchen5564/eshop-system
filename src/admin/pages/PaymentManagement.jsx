import React, { useState } from 'react';
import {
  Card,
  Switch,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Tag,
  message,
  Alert
} from 'antd';
import {
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined,
  SettingOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { mockPaymentMethods } from '../data/mockAdminData';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PaymentManagement = () => {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [form] = Form.useForm();

  const getPaymentIcon = (type) => {
    switch (type) {
      case 'online':
        return <CreditCardOutlined style={{ fontSize: '24px', color: '#1890ff' }} />;
      case 'offline':
        return <BankOutlined style={{ fontSize: '24px', color: '#52c41a' }} />;
      case 'cash':
        return <WalletOutlined style={{ fontSize: '24px', color: '#faad14' }} />;
      default:
        return <CreditCardOutlined style={{ fontSize: '24px', color: '#666' }} />;
    }
  };

  const getPaymentTypeTag = (type) => {
    const typeMap = {
      online: { color: 'blue', text: '線上支付' },
      offline: { color: 'green', text: '線下支付' },
      cash: { color: 'orange', text: '現金支付' }
    };
    const typeInfo = typeMap[type] || { color: 'default', text: type };
    return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
  };

  const handleToggleEnabled = (methodId) => {
    setPaymentMethods(methods =>
      methods.map(method =>
        method.id === methodId
          ? { ...method, enabled: !method.enabled }
          : method
      )
    );
    const method = paymentMethods.find(m => m.id === methodId);
    message.success(`${method.name} 已${method.enabled ? '停用' : '啟用'}`);
  };

  const handleEditMethod = (method) => {
    setEditingMethod(method);
    form.setFieldsValue({
      ...method,
      fixedFee: method.fees.fixed,
      percentageFee: method.fees.percentage
    });
    setIsModalVisible(true);
  };

  const handleAddMethod = () => {
    setEditingMethod(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSaveMethod = async () => {
    try {
      const values = await form.validateFields();
      
      const methodData = {
        ...values,
        fees: {
          fixed: values.fixedFee || 0,
          percentage: values.percentageFee || 0
        }
      };

      if (editingMethod) {
        setPaymentMethods(methods =>
          methods.map(method =>
            method.id === editingMethod.id
              ? { ...method, ...methodData }
              : method
          )
        );
        message.success('付款方式已更新');
      } else {
        const newMethod = {
          id: `payment_${Date.now()}`,
          ...methodData,
          enabled: true,
          config: {}
        };
        setPaymentMethods([...paymentMethods, newMethod]);
        message.success('付款方式已添加');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>付款方式管理</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMethod}>
            新增付款方式
          </Button>
        </div>

        <Alert
          message="付款方式設定"
          description="您可以啟用或停用不同的付款方式，並設定相關的手續費和配置參數。"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Row gutter={[24, 24]}>
          {paymentMethods.map(method => (
            <Col xs={24} lg={12} key={method.id}>
              <Card
                style={{
                  opacity: method.enabled ? 1 : 0.6,
                  border: method.enabled ? '1px solid #52c41a' : '1px solid #d9d9d9'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {getPaymentIcon(method.type)}
                    <div>
                      <Title level={4} style={{ margin: 0 }}>{method.name}</Title>
                      {getPaymentTypeTag(method.type)}
                    </div>
                  </div>
                  <Switch
                    checked={method.enabled}
                    onChange={() => handleToggleEnabled(method.id)}
                    checkedChildren="啟用"
                    unCheckedChildren="停用"
                  />
                </div>

                <Paragraph style={{ color: '#666', marginBottom: '16px' }}>
                  {method.description}
                </Paragraph>

                <div style={{ marginBottom: '16px' }}>
                  <Text strong>手續費設定：</Text>
                  <div style={{ marginTop: '8px' }}>
                    {method.fees.fixed > 0 && (
                      <Tag color="blue">固定費用: NT$ {method.fees.fixed}</Tag>
                    )}
                    {method.fees.percentage > 0 && (
                      <Tag color="green">百分比: {method.fees.percentage}%</Tag>
                    )}
                    {method.fees.fixed === 0 && method.fees.percentage === 0 && (
                      <Tag color="gold">免手續費</Tag>
                    )}
                  </div>
                </div>

                {/* 配置信息 */}
                {method.config && Object.keys(method.config).length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <Text strong>配置信息：</Text>
                    <div style={{ marginTop: '8px', background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                      {method.type === 'online' && method.config.supportedCards && (
                        <div>支援卡片: {method.config.supportedCards.join(', ')}</div>
                      )}
                      {method.type === 'offline' && method.config.bankName && (
                        <div>
                          <div>銀行: {method.config.bankName}</div>
                          <div>帳號: {method.config.accountNumber}</div>
                          <div>戶名: {method.config.accountName}</div>
                        </div>
                      )}
                      {method.type === 'cash' && method.config.availableAreas && (
                        <div>服務區域: {method.config.availableAreas.join(', ')}</div>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEditMethod(method)}
                  >
                    編輯設定
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Add/Edit Payment Method Modal */}
      <Modal
        title={editingMethod ? '編輯付款方式' : '新增付款方式'}
        open={isModalVisible}
        onOk={handleSaveMethod}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: 'online',
            enabled: true,
            fixedFee: 0,
            percentageFee: 0
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="付款方式名稱"
                rules={[{ required: true, message: '請輸入付款方式名稱' }]}
              >
                <Input placeholder="請輸入付款方式名稱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="付款類型"
                rules={[{ required: true, message: '請選擇付款類型' }]}
              >
                <Select placeholder="請選擇付款類型">
                  <Select.Option value="online">線上支付</Select.Option>
                  <Select.Option value="offline">線下支付</Select.Option>
                  <Select.Option value="cash">現金支付</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '請輸入描述' }]}
          >
            <TextArea rows={3} placeholder="請輸入付款方式描述" />
          </Form.Item>

          <Divider>手續費設定</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fixedFee"
                label="固定手續費 (NT$)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="請輸入固定手續費"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="percentageFee"
                label="百分比手續費 (%)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  step={0.1}
                  placeholder="請輸入百分比手續費"
                />
              </Form.Item>
            </Col>
          </Row>

          <Alert
            message="手續費計算說明"
            description="最終手續費 = 固定手續費 + (訂單金額 × 百分比手續費 / 100)"
            type="info"
            showIcon
            style={{ marginTop: '16px' }}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentManagement;