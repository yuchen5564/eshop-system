import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Form,
  Input,
  Modal,
  message,
  Popconfirm,
  Tabs,
  Switch,
  InputNumber,
  Select
} from 'antd';
import {
  TruckOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SettingOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { logisticsService } from '../../services/logisticsService';

const { Title, Text } = Typography;

const LogisticsManagement = () => {
  const [logisticsMethods, setLogisticsMethods] = useState([]);
  const [methodModalVisible, setMethodModalVisible] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    loadLogisticsMethods();
  }, []);

  const loadLogisticsMethods = async () => {
    setLoading(true);
    try {
      const result = await logisticsService.getLogisticsMethods();
      if (result.success) {
        setLogisticsMethods(result.data.sort((a, b) => a.sortOrder - b.sortOrder));
      } else {
        message.error('載入物流方法失敗');
      }
    } catch (error) {
      message.error('載入物流方法失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMethod = () => {
    setEditingMethod(null);
    form.resetFields();
    setMethodModalVisible(true);
  };

  const handleEditMethod = (method) => {
    setEditingMethod(method);
    // 確保所有必要的欄位都有值
    const formData = {
      ...method,
      carrier: method.carrier || '', // 如果沒有carrier，設為空字串
      carrierName: method.carrierName || method.name || '', // 後備值
      deliveryTime: method.deliveryTime || '',
      trackingUrl: method.trackingUrl || ''
    };
    form.setFieldsValue(formData);
    setMethodModalVisible(true);
  };

  const handleMethodSubmit = async (values) => {
    try {
      // 清理 undefined 或 null 為空字串，特別是 trackingUrl
      const sanitizedValues = {
        ...values,
        trackingUrl: values.trackingUrl?.trim() || ''  // 如果是 undefined/null/空白字串 → ''
      };

      if (editingMethod) {
        const result = await logisticsService.updateLogisticsMethod(editingMethod.id, sanitizedValues);
        if (result.success) {
          message.success('物流方法已更新');
          loadLogisticsMethods();
        } else {
          message.error('更新失敗');
          return;
        }
      } else {
        const newMethod = {
          ...sanitizedValues,
          isActive: true,
          sortOrder: logisticsMethods.length + 1
        };
        const result = await logisticsService.addLogisticsMethod(newMethod);
        if (result.success) {
          message.success('物流方法已新增');
          loadLogisticsMethods();
        } else {
          message.error('新增失敗');
          return;
        }
      }

      setMethodModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('操作失敗：' + error.message);
    }
  };
  const handleDeleteMethod = async (methodId) => {
    try {
      const result = await logisticsService.deleteLogisticsMethod(methodId);
      if (result.success) {
        message.success('物流方法已刪除');
        loadLogisticsMethods();
      } else {
        message.error('刪除失敗');
      }
    } catch (error) {
      message.error('刪除失敗：' + error.message);
    }
  };

  const handleToggleStatus = async (methodId, isActive) => {
    try {
      const result = await logisticsService.toggleLogisticsMethodStatus(methodId, isActive);
      if (result.success) {
        message.success(`物流方法已${isActive ? '啟用' : '停用'}`);
        loadLogisticsMethods();
      } else {
        message.error('狀態更新失敗');
      }
    } catch (error) {
      message.error('狀態更新失敗：' + error.message);
    }
  };

  const columns = [
    {
      title: '物流方法',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </div>
      )
    },
    {
      title: '貨運公司',
      key: 'carrier',
      width: 150,
      render: (_, record) => (
        <div>
          <Text strong>{record.carrierName || '未設定'}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.carrier || '無代碼'}
          </Text>
        </div>
      )
    },
    {
      title: '配送時間',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
      width: 120
    },
    {
      title: '狀態',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
          checkedChildren="啟用"
          unCheckedChildren="停用"
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
            icon={<EditOutlined />}
            onClick={() => handleEditMethod(record)}
          >
            編輯
          </Button>
          <Popconfirm
            title="確定要刪除此物流方法嗎？"
            onConfirm={() => handleDeleteMethod(record.id)}
            okText="確定"
            cancelText="取消"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              刪除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>物流設定</Title>
        <Space>
          {/* <Button
            onClick={async () => {
              try {
                const result = await logisticsService.initializeDefaultLogisticsMethods();
                if (result.success) {
                  message.success('預設物流方法已初始化');
                  loadLogisticsMethods();
                } else {
                  message.error('初始化失敗');
                }
              } catch (error) {
                message.error('初始化失敗：' + error.message);
              }
            }}
          >
            初始化預設物流方法
          </Button>
          <Button
            onClick={async () => {
              try {
                // 修復缺少 carrier 欄位的物流方法
                const methods = await logisticsService.getLogisticsMethods();
                if (methods.success) {
                  let fixedCount = 0;
                  for (const method of methods.data) {
                    if (!method.carrier && method.carrierName) {
                      // 生成 carrier 代碼
                      const carrier = method.carrierName.toLowerCase()
                        .replace(/\s+/g, '_')
                        .replace(/[^a-z0-9_]/g, '');
                      
                      await logisticsService.updateLogisticsMethod(method.id, {
                        ...method,
                        carrier: carrier
                      });
                      fixedCount++;
                    }
                  }
                  if (fixedCount > 0) {
                    message.success(`已修復 ${fixedCount} 個物流方法`);
                    loadLogisticsMethods();
                  } else {
                    message.info('沒有需要修復的物流方法');
                  }
                }
              } catch (error) {
                message.error('修復失敗：' + error.message);
              }
            }}
          >
            修復物流方法
          </Button> */}
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              loadLogisticsMethods();
            }}
          >
            刷新
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddMethod}
          >
            新增物流方法
          </Button>
        </Space>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={logisticsMethods}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 個物流方法`
          }}
          size="middle"
        />
      </Card>

      {/* 物流方法編輯 Modal */}
      <Modal
        title={editingMethod ? '編輯物流方法' : '新增物流方法'}
        open={methodModalVisible}
        onCancel={() => setMethodModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setMethodModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
          >
            {editingMethod ? '更新' : '新增'}
          </Button>
        ]}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleMethodSubmit}
        >
          <Form.Item
            name="name"
            label="物流方法名稱"
            rules={[{ required: true, message: '請輸入物流方法名稱' }]}
          >
            <Input placeholder="例如：標準配送" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '請輸入描述' }]}
          >
            <Input placeholder="例如：3-5個工作天送達" />
          </Form.Item>
          
          <Form.Item
            name="carrier"
            label="貨運公司代碼"
            rules={[{ required: true, message: '請輸入貨運公司代碼' }]}
            extra="唯一識別碼，用於系統內部識別，建議使用英文和底線"
          >
            <Input placeholder="例如：post_office, fedex, black_cat" />
          </Form.Item>
          
          <Form.Item
            name="carrierName"
            label="貨運公司名稱"
            rules={[{ required: true, message: '請輸入貨運公司名稱' }]}
          >
            <Input placeholder="例如：中華郵政" />
          </Form.Item>
          
          <Form.Item
            name="deliveryTime"
            label="配送時間"
            rules={[{ required: true, message: '請輸入配送時間' }]}
          >
            <Input placeholder="例如：3-5個工作天" />
          </Form.Item>
          
          <Form.Item
            name="trackingUrl"
            label="追蹤網址模板"
            extra="使用 {trackingNumber} 代表追蹤編號的位置"
          >
            <Input placeholder="https://example.com/track?no={trackingNumber}" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LogisticsManagement;