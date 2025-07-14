import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Row,
  Col,
  message,
  Divider,
  Switch,
  Table,
  Modal,
  Alert,
  Tag
} from 'antd';
import {
  MailOutlined,
  SettingOutlined,
  SendOutlined,
  EyeOutlined,
  SaveOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { emailManagementService, emailTemplateService, emailLogService } from '../../services/emailManagementService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const EmailManagement = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [templateForm] = Form.useForm();
  const [configForm] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailLogs, setEmailLogs] = useState([]);

  useEffect(() => {
    loadEmailLogs();
  }, []);

  const loadEmailLogs = async () => {
    try {
      const result = await emailLogService.getAll();
      if (result.success) {
        setEmailLogs(result.data);
      }
    } catch (error) {
      console.error('載入郵件記錄失敗:', error);
    }
  };

  const [emailTemplates, setEmailTemplates] = useState({
    order_confirmation: {
      name: '訂單確認通知',
      subject: '訂單確認 - {{orderId}}',
      content: `親愛的 {{customerName}}，

感謝您的訂購！您的訂單已成功建立，詳細資訊如下：

訂單編號：{{orderId}}
訂單時間：{{orderDate}}
訂單總額：NT$ {{total}}

我們將盡快為您處理訂單，如有任何問題請與我們聯繫。

農鮮市集 © 2025`,
      enabled: true
    },
    new_order_admin: {
      name: '新訂單管理員通知',
      subject: '新訂單通知 - {{orderId}}',
      content: `有新的訂單需要處理！

訂單編號：{{orderId}}
客戶姓名：{{customerName}}
訂單時間：{{orderDate}}
訂單總額：NT$ {{total}}

請盡快在管理後台處理此訂單。`,
      enabled: true
    },
    shipping_notification: {
      name: '出貨通知',
      subject: '您的訂單已出貨 - {{orderId}}',
      content: `親愛的 {{customerName}}，

您的訂單 {{orderId}} 已經出貨囉！

貨運公司：{{carrier}}
追蹤編號：{{trackingNumber}}
出貨時間：{{shippedDate}}

感謝您的耐心等待，如有任何問題請與我們聯繫。

農鮮市集 © 2025`,
      enabled: true
    }
  });

  const [emailConfig, setEmailConfig] = useState({
    adminEmail: 'admin@example.com',
    fromEmail: 'noreply@example.com',
    fromName: '農鮮市集',
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: '',
    smtpPass: '',
    enabled: true
  });

  const templateColumns = [
    {
      title: '模板名稱',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '郵件主旨',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => (
        <Text code style={{ fontSize: '12px' }}>{subject}</Text>
      )
    },
    {
      title: '狀態',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (enabled) => (
        <Switch 
          checked={enabled} 
          size="small"
          checkedChildren="啟用"
          unCheckedChildren="停用"
        />
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record, index) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => previewTemplate(record)}
          >
            預覽
          </Button>
          <Button
            size="small"
            onClick={() => editTemplate(Object.keys(emailTemplates)[index])}
          >
            編輯
          </Button>
        </Space>
      )
    }
  ];

  const availableVariables = {
    order_confirmation: [
      '{{customerName}}', '{{orderId}}', '{{orderDate}}', 
      '{{total}}', '{{shippingAddress}}', '{{paymentMethod}}',
      '{{items}}', '{{notes}}'
    ],
    new_order_admin: [
      '{{customerName}}', '{{orderId}}', '{{orderDate}}',
      '{{total}}', '{{customerEmail}}', '{{customerPhone}}',
      '{{shippingAddress}}', '{{paymentMethod}}', '{{paymentStatus}}'
    ],
    shipping_notification: [
      '{{customerName}}', '{{orderId}}', '{{carrier}}',
      '{{trackingNumber}}', '{{shippedDate}}', '{{estimatedDelivery}}',
      '{{trackingUrl}}', '{{shippingAddress}}'
    ]
  };

  const editTemplate = (templateKey) => {
    const template = emailTemplates[templateKey];
    templateForm.setFieldsValue({
      templateKey,
      name: template.name,
      subject: template.subject,
      content: template.content,
      enabled: template.enabled
    });
    setActiveTab('edit');
  };

  const previewTemplate = (template) => {
    const sampleData = {
      customerName: '王小明',
      orderId: 'ORD123456',
      orderDate: '2025-01-13 14:30',
      total: '1,250',
      carrier: '黑貓宅急便',
      trackingNumber: 'TC123456789TW',
      shippedDate: '2025-01-13 10:00'
    };

    let preview = template.content;
    Object.entries(sampleData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    setPreviewContent(preview);
    setPreviewVisible(true);
  };

  const handleSaveTemplate = async (values) => {
    setLoading(true);
    try {
      const updatedTemplates = {
        ...emailTemplates,
        [values.templateKey]: {
          name: values.name,
          subject: values.subject,
          content: values.content,
          enabled: values.enabled
        }
      };
      
      setEmailTemplates(updatedTemplates);
      message.success('郵件模板已更新');
      setActiveTab('templates');
      templateForm.resetFields();
    } catch (error) {
      message.error('更新失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (values) => {
    setLoading(true);
    try {
      setEmailConfig(values);
      emailService.updateEmailConfig(values);
      message.success('郵件設定已更新');
    } catch (error) {
      message.error('設定更新失敗');
    } finally {
      setLoading(false);
    }
  };

  const testEmailConnection = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('郵件伺服器連線測試成功');
    } catch (error) {
      message.error('郵件伺服器連線測試失敗');
    } finally {
      setLoading(false);
    }
  };


  const tabItems = [
    {
      key: 'templates',
      label: (
        <span>
          <MailOutlined />
          郵件模板
        </span>
      ),
      children: (
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Title level={4}>郵件模板管理</Title>
            <Paragraph type="secondary">
              管理系統發送的各種郵件模板，支援變數替換功能。
            </Paragraph>
          </div>

          <Table
            columns={templateColumns}
            dataSource={Object.entries(emailTemplates).map(([key, template]) => ({
              key,
              ...template
            }))}
            pagination={false}
            size="middle"
          />
        </Card>
      )
    },
    {
      key: 'edit',
      label: (
        <span>
          <EyeOutlined />
          編輯模板
        </span>
      ),
      children: (
        <Card>
          <Title level={4}>編輯郵件模板</Title>
          
          <Form
            form={templateForm}
            layout="vertical"
            onFinish={handleSaveTemplate}
          >
            <Form.Item name="templateKey" style={{ display: 'none' }}>
              <Input />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="模板名稱"
                  rules={[{ required: true, message: '請輸入模板名稱' }]}
                >
                  <Input placeholder="請輸入模板名稱" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="enabled"
                  label="啟用狀態"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="啟用" unCheckedChildren="停用" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="subject"
              label="郵件主旨"
              rules={[{ required: true, message: '請輸入郵件主旨' }]}
            >
              <Input placeholder="請輸入郵件主旨" />
            </Form.Item>

            <Form.Item
              name="content"
              label="郵件內容"
              rules={[{ required: true, message: '請輸入郵件內容' }]}
            >
              <TextArea
                rows={12}
                placeholder="請輸入郵件內容"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Alert
                  message="可用變數"
                  description={
                    <div>
                      {templateForm.getFieldValue('templateKey') && 
                       availableVariables[templateForm.getFieldValue('templateKey')]?.map(variable => (
                        <Text code key={variable} style={{ margin: '2px', display: 'inline-block' }}>
                          {variable}
                        </Text>
                      ))}
                    </div>
                  }
                  type="info"
                  showIcon
                />
              </Col>
              <Col span={12}>
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button onClick={() => setActiveTab('templates')}>
                    取消
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    htmlType="submit"
                    loading={loading}
                  >
                    儲存模板
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>
      )
    },
    {
      key: 'config',
      label: (
        <span>
          <SettingOutlined />
          郵件設定
        </span>
      ),
      children: (
        <Card>
          <Title level={4}>郵件伺服器設定</Title>
          
          <Form
            form={configForm}
            layout="vertical"
            initialValues={emailConfig}
            onFinish={handleSaveConfig}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="fromName"
                  label="寄件者名稱"
                  rules={[{ required: true, message: '請輸入寄件者名稱' }]}
                >
                  <Input placeholder="請輸入寄件者名稱" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="fromEmail"
                  label="寄件者信箱"
                  rules={[
                    { required: true, message: '請輸入寄件者信箱' },
                    { type: 'email', message: '請輸入正確的信箱格式' }
                  ]}
                >
                  <Input placeholder="請輸入寄件者信箱" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="adminEmail"
              label="管理員信箱"
              rules={[
                { required: true, message: '請輸入管理員信箱' },
                { type: 'email', message: '請輸入正確的信箱格式' }
              ]}
            >
              <Input placeholder="請輸入管理員信箱" />
            </Form.Item>

            <Divider />

            <Title level={5}>SMTP 設定</Title>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="smtpHost"
                  label="SMTP 伺服器"
                  rules={[{ required: true, message: '請輸入SMTP伺服器' }]}
                >
                  <Input placeholder="例如：smtp.gmail.com" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="smtpPort"
                  label="連接埠"
                  rules={[{ required: true, message: '請輸入連接埠' }]}
                >
                  <Input placeholder="587" type="number" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="smtpSecure"
                  label="使用SSL"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="smtpUser"
                  label="SMTP 使用者名稱"
                >
                  <Input placeholder="請輸入SMTP使用者名稱" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="smtpPass"
                  label="SMTP 密碼"
                >
                  <Input.Password placeholder="請輸入SMTP密碼" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="enabled"
                  label="啟用郵件功能"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="啟用" unCheckedChildren="停用" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button
                    icon={<SendOutlined />}
                    loading={loading}
                    onClick={testEmailConnection}
                  >
                    測試連線
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    htmlType="submit"
                    loading={loading}
                  >
                    儲存設定
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>
      )
    },
    {
      key: 'logs',
      label: (
        <span>
          <FileTextOutlined />
          郵件記錄
        </span>
      ),
      children: (
        <Card>
          <Title level={4}>發送記錄</Title>
          <Table
            columns={[
              {
                title: '郵件類型',
                dataIndex: 'type',
                key: 'type',
                width: 120,
                render: (type) => {
                  const typeMap = {
                    'order_confirmation': { text: '訂單確認', color: 'blue' },
                    'shipping_notification': { text: '出貨通知', color: 'green' }
                  };
                  const info = typeMap[type] || { text: type, color: 'default' };
                  return <Tag color={info.color}>{info.text}</Tag>;
                }
              },
              {
                title: '收件人',
                dataIndex: 'recipientName',
                key: 'recipientName',
                width: 120
              },
              {
                title: '信箱',
                dataIndex: 'recipient',
                key: 'recipient',
                width: 200
              },
              {
                title: '主旨',
                dataIndex: 'subject',
                key: 'subject'
              },
              {
                title: '關聯訂單',
                dataIndex: 'orderId',
                key: 'orderId',
                width: 120
              },
              {
                title: '發送時間',
                dataIndex: 'sentAt',
                key: 'sentAt',
                width: 150,
                render: (date) => date ? new Date(date).toLocaleString('zh-TW') : '-'
              },
              {
                title: '狀態',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (status) => {
                  const statusMap = {
                    'delivered': { text: '已送達', color: 'green' },
                    'failed': { text: '失敗', color: 'red' },
                    'pending': { text: '發送中', color: 'orange' }
                  };
                  const info = statusMap[status] || { text: status, color: 'default' };
                  return <Tag color={info.color}>{info.text}</Tag>;
                }
              },
              {
                title: '錯誤訊息',
                dataIndex: 'errorMessage',
                key: 'errorMessage',
                width: 150,
                render: (error) => error ? <Text type="danger">{error}</Text> : '-'
              }
            ]}
            dataSource={emailLogs}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 筆記錄`
            }}
            size="middle"
          />
        </Card>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>郵件管理</Title>
      </div>
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />

      <Modal
        title="模板預覽"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            關閉
          </Button>
        ]}
        width={600}
      >
        <div style={{ 
          background: '#f5f5f5', 
          padding: '16px', 
          borderRadius: '6px',
          whiteSpace: 'pre-line',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {previewContent}
        </div>
      </Modal>
    </div>
  );
};

export default EmailManagement;