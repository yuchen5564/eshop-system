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
  Tag,
  Statistic,
  Spin
} from 'antd';
import {
  MailOutlined,
  SettingOutlined,
  SendOutlined,
  EyeOutlined,
  SaveOutlined,
  FileTextOutlined,
  GoogleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  EditOutlined
} from '@ant-design/icons';
import { emailManagementService, emailTemplateService, emailLogService } from '../../services/emailManagementService';
import { emailService } from '../../services/emailService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const EmailManagement = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [templateForm] = Form.useForm();
  const [configForm] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailLogs, setEmailLogs] = useState([]);
  const [emailStats, setEmailStats] = useState({});
  const [emailTemplates, setEmailTemplates] = useState({});
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [pageSize, setPageSize] = useState(10); // 預設每頁10筆

  
  // 新增 - 編輯模板彈窗狀態
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState(null);

  useEffect(() => {
    loadEmailLogs();
    loadEmailSettings();
    loadEmailStats();
    loadEmailTemplates();
  }, []);

  // 載入郵件模板
  const loadEmailTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const result = await emailTemplateService.getAll();
      if (result.success && Array.isArray(result.data)) {
        // 將資料轉換為更易於使用的格式
        const templates = {};
        result.data.forEach(template => {
          templates[template.id] = {
            id: template.id,
            name: template.name,
            subject: template.subject,
            content: template.htmlContent || template.textContent,
            enabled: template.isActive,
            type: template.type,
            variables: template.variables || []
          };
        });
        setEmailTemplates(templates);
      } else {
        message.error('無法加載郵件模板');
      }
    } catch (error) {
      console.error('載入郵件模板失敗:', error);
      message.error('載入郵件模板失敗');
    } finally {
      setLoadingTemplates(false);
    }
  };

  const loadEmailSettings = async () => {
    try {
      const result = await emailManagementService.getEmailSettings();
      if (result.success && result.data) {
        const settings = result.data;
        // 轉換資料庫格式為表單格式
        const formData = {
          fromName: settings.sender?.name || '',
          fromEmail: settings.sender?.email || '',
          adminEmail: settings.adminEmail || '',
          enabled: settings.isActive || false
        };
        setEmailConfig(formData);
        configForm.setFieldsValue(formData);
      }
    } catch (error) {
      console.error('載入郵件設定失敗:', error);
    }
  };

  const loadEmailLogs = async () => {
    try {
      const result = await emailLogService.getRecentLogs(100);
      if (result.success) {
        setEmailLogs(result.data);
      }
    } catch (error) {
      console.error('載入郵件記錄失敗:', error);
    }
  };

  const loadEmailStats = async () => {
    try {
      const result = await emailLogService.getEmailStats(30);
      if (result.success) {
        setEmailStats(result.data);
      }
    } catch (error) {
      console.error('載入郵件統計失敗:', error);
    }
  };

  const [emailConfig, setEmailConfig] = useState({
    adminEmail: 'admin@example.com',
    fromEmail: 'noreply@example.com',
    fromName: '農鮮市集',
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
      render: (enabled, record) => (
        <Switch 
          checked={enabled} 
          size="small"
          checkedChildren="啟用"
          unCheckedChildren="停用"
          onChange={(checked) => toggleTemplateStatus(record.id, checked)}
        />
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record) => (
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
            icon={<EditOutlined />}
            onClick={() => editTemplate(record.id)}
          >
            編輯
          </Button>
        </Space>
      )
    }
  ];

  // 切換模板狀態
  const toggleTemplateStatus = async (templateId, enabled) => {
    try {
      const result = await emailTemplateService.update(templateId, { isActive: enabled });
      if (result.success) {
        setEmailTemplates(prevState => ({
          ...prevState,
          [templateId]: {
            ...prevState[templateId],
            enabled
          }
        }));
        message.success(`模板已${enabled ? '啟用' : '停用'}`);
      } else {
        message.error('狀態更新失敗');
      }
    } catch (error) {
      console.error('更新模板狀態失敗:', error);
      message.error('更新模板狀態失敗');
    }
  };

  // 修改 - 編輯模板函數，使用Modal而非標籤切換
  const editTemplate = (templateId) => {
    const template = emailTemplates[templateId];
    console.log('編輯模板:', templateId);
    templateForm.setFieldsValue({
      templateKey: templateId,
      name: template.name,
      subject: template.subject,
      content: template.content,
      enabled: template.enabled
    });
    setCurrentTemplateId(templateId);
    setEditModalVisible(true);
  };

  // 預覽模板
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

  // 修改 - 保存模板
  const handleSaveTemplate = async (values) => {
    setLoading(true);
    try {
      const templateId = values.templateKey;
      const originalTemplate = emailTemplates[templateId];
      
      const templateData = {
        name: values.name,
        subject: values.subject,
        htmlContent: values.content,
        isActive: values.enabled,
        // 保留原有字段
        type: originalTemplate.type,
        variables: originalTemplate.variables,
      };
      
      const result = await emailTemplateService.update(templateId, templateData);
      
      if (result.success) {
        // 更新本地狀態
        setEmailTemplates(prevState => ({
          ...prevState,
          [templateId]: {
            ...prevState[templateId],
            ...templateData,
            name: values.name,
            subject: values.subject,
            content: values.content,
            enabled: values.enabled
          }
        }));
        
        message.success('郵件模板已更新');
        setEditModalVisible(false); // 關閉Modal而非切換標籤
        templateForm.resetFields();
      } else {
        throw new Error(result.error || '更新失敗');
      }
    } catch (error) {
      message.error('更新失敗: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 保存配置
  const handleSaveConfig = async (values) => {
    setLoading(true);
    try {
      // 轉換表單數據為資料庫格式
      const settingsData = {
        sender: {
          name: values.fromName,
          email: values.fromEmail
        },
        adminEmail: values.adminEmail,
        googleAppScript: {
          enabled: true,
          description: 'Google App Script 郵件發送服務'
        },
        isActive: values.enabled
      };
      
      // 保存到資料庫
      const result = await emailManagementService.updateEmailSettings(settingsData);
      
      if (result.success) {
        setEmailConfig(values);
        message.success('郵件設定已更新');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      message.error('設定更新失敗: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 測試郵件發送
  const testEmailConnection = async () => {
    const testEmail = configForm.getFieldValue('adminEmail');
    if (!testEmail) {
      message.error('請先輸入管理員信箱');
      return;
    }

    setLoading(true);
    try {
      const result = await emailService.testEmailSending(testEmail);
      if (result.success) {
        message.success('測試郵件發送成功，請檢查信箱');
        // 重新載入記錄
        setTimeout(() => {
          loadEmailLogs();
          loadEmailStats();
        }, 1000);
      } else {
        message.error('測試郵件發送失敗: ' + result.message);
      }
    } catch (error) {
      message.error('測試郵件發送失敗: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 郵件記錄表格列定義
  const logColumns = [
    {
      title: '時間',
      dataIndex: 'sentAt',
      key: 'sentAt',
      width: 150,
      render: (sentAt) => {
        const date = sentAt.seconds ? new Date(sentAt.seconds * 1000) : new Date(sentAt);
        return date.toLocaleString('zh-TW');
      }
    },
    {
      title: '寄件人',
      dataIndex: 'from',
      key: 'from',
      width: 200,
      render: (from) => from || '系統'
    },
    {
      title: '收件人',
      dataIndex: 'to',
      key: 'to',
      width: 200
    },
    {
      title: '主旨',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true
    },
    {
      title: '類型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => {
        const typeMap = {
          'order_confirmation': { text: '訂單確認', color: 'blue' },
          'shipping_notification': { text: '出貨通知', color: 'green' },
          'new_order_admin': { text: '新訂單', color: 'orange' },
          'test': { text: '測試', color: 'purple' }
        };
        const info = typeMap[type] || { text: type || 'general', color: 'default' };
        return <Tag color={info.color}>{info.text}</Tag>;
      }
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => {
        const statusMap = {
          'sent': { text: '已送達', color: 'green', icon: <CheckCircleOutlined /> },
          'delivered': { text: '已送達', color: 'green', icon: <CheckCircleOutlined /> },
          'failed': { text: '失敗', color: 'red', icon: <ExclamationCircleOutlined /> },
          'error': { text: '錯誤', color: 'red', icon: <ExclamationCircleOutlined /> },
          'pending': { text: '發送中', color: 'orange' },
          'skipped': { text: '已跳過', color: 'gray' }
        };
        const info = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={info.color} icon={info.icon}>{info.text}</Tag>;
      }
    },
    {
      title: '訊息ID',
      dataIndex: 'messageId',
      key: 'messageId',
      width: 150,
      render: (messageId) => messageId ? <Text code>{messageId.substring(0, 10)}...</Text> : '-'
    },
    {
      title: '錯誤訊息',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      width: 200,
      render: (error) => error ? <Text type="danger" ellipsis>{error}</Text> : '-'
    }
  ];

  // 設置標籤項 - 移除編輯標籤頁
  const tabItems = [
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
          <Title level={4}>郵件系統設定</Title>
          <Paragraph type="secondary">
            系統使用 Google App Script 發送郵件，請確保已正確設定環境變數 VITE_GOOGLE_APP_SCRIPT_ID。
          </Paragraph>
          
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

            <Alert
              message="Google App Script 設定說明"
              description={
                <div>
                  <p>1. 請確保您的 Google App Script 已部署為 Web App</p>
                  <p>2. 設定執行身份為您的 Google 帳戶</p>
                  <p>3. 設定存取權限允許外部訪問</p>
                  <p>4. 在 .env 文件中設定 VITE_GOOGLE_APP_SCRIPT_ID 為您的 Script ID</p>
                  <p>5. 當前 Script ID: <Text code>{import.meta.env.VITE_GOOGLE_APP_SCRIPT_ID || '未設定'}</Text></p>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="enabled"
                  label="啟用郵件功能"
                  valuePropName="checked"
                >
                  <Switch 
                    checkedChildren="啟用" 
                    unCheckedChildren="停用"
                    size="default"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button
                    icon={<SendOutlined />}
                    loading={loading}
                    onClick={testEmailConnection}
                  >
                    測試郵件發送
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

          {loadingTemplates ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <p style={{ marginTop: '16px' }}>加載模板中...</p>
            </div>
          ) : (
            <Table
              columns={templateColumns}
              dataSource={Object.entries(emailTemplates).map(([key, template]) => ({
                ...template,
                key
              }))}
              pagination={false}
              size="middle"
              scroll={{ x: 1200 }}
            />
          )}
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
          {/* 郵件記錄部分保持原樣 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4}>郵件發送記錄</Title>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadEmailLogs}
              >
                刷新
              </Button>
            </div>
          </div>
          
          <Table
            columns={logColumns}
            dataSource={emailLogs}
            rowKey="id"
            pagination={{
              pageSize: pageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 筆記錄`,
              pageSizeOptions: ['5', '10', '20', '50', '100'],
              onShowSizeChange: (current, size) => {
                setPageSize(size);
              }
            }}
            size="middle"
            scroll={{ x: 1200 }}
          />
        </Card>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>郵件管理</Title>
        <Text type="secondary">使用 Google App Script 發送郵件</Text>
      </div>
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />

      {/* 模板預覽 Modal */}
      <Modal
        title="模板預覽"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            關閉
          </Button>
        ]}
        width={800}
      >
        <div style={{ 
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          padding: '16px',
          maxHeight: '60vh',
          overflow: 'auto'
        }}>
          <div dangerouslySetInnerHTML={{ __html: previewContent }} />
        </div>
      </Modal>

      {/* 新增 - 編輯模板 Modal */}
      <Modal
        title="編輯郵件模板"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={1200}
        maskClosable={false}
      >
        <Form
          form={templateForm}
          layout="vertical"
          onFinish={handleSaveTemplate}
          style={{ padding: '0' }}
        >
          <Form.Item name="templateKey" style={{ display: 'none' }}>
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={18}>
              <Form.Item
                name="name"
                label="模板名稱"
                rules={[{ required: true, message: '請輸入模板名稱' }]}
              >
                <Input placeholder="請輸入模板名稱" />
              </Form.Item>
            </Col>
            <Col span={6}>
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
              rows={14}
              placeholder="請輸入郵件內容"
              style={{ fontFamily: 'monospace', resize: 'none' }}
            />
          </Form.Item>

          <Alert
            message="可用變數"
            description={
              <div>
                {currentTemplateId && 
                emailTemplates[currentTemplateId]?.variables?.map(variable => (
                  <Text code key={variable} style={{ margin: '2px', display: 'inline-block', cursor: 'pointer' }}
                    onClick={() => {
                      // 點擊時將變數插入到游標位置
                      const textArea = document.querySelector('textarea[name="content"]');
                      if (textArea) {
                        const start = textArea.selectionStart;
                        const end = textArea.selectionEnd;
                        const content = textArea.value;
                        const newValue = content.substring(0, start) + `{{${variable}}}` + content.substring(end);
                        
                        // 更新表單值
                        templateForm.setFieldValue('content', newValue);
                        
                        // 重新設置游標位置
                        setTimeout(() => {
                          textArea.focus();
                          textArea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
                        }, 0);
                      }
                    }}
                  >
                    {`{{${variable}}}`}
                  </Text>
                ))}
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <Space>
              <Button onClick={() => setEditModalVisible(false)}>
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
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default EmailManagement;