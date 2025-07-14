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
  SettingOutlined
} from '@ant-design/icons';
import { logisticsService } from '../../services/logisticsService';

const { Title, Text } = Typography;

const LogisticsManagement = () => {
  const [carriers, setCarriers] = useState([]);
  const [carrierModalVisible, setCarrierModalVisible] = useState(false);
  const [editingCarrier, setEditingCarrier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCarriers();
  }, []);

  const loadCarriers = async () => {
    setLoading(true);
    try {
      const result = await logisticsService.getShippingCarriers();
      if (result.success) {
        setCarriers(result.data);
      } else {
        message.error('載入貨運公司失敗');
      }
    } catch (error) {
      message.error('載入貨運公司失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCarrier = () => {
    setEditingCarrier(null);
    form.resetFields();
    setCarrierModalVisible(true);
  };

  const handleEditCarrier = (carrier) => {
    setEditingCarrier(carrier);
    form.setFieldsValue(carrier);
    setCarrierModalVisible(true);
  };

  const handleCarrierSubmit = async (values) => {
    try {
      if (editingCarrier) {
        const result = await logisticsService.updateShippingCarrier(editingCarrier.value, values);
        if (result.success) {
          message.success('貨運公司資訊已更新');
          loadCarriers();
        } else {
          message.error('更新失敗');
          return;
        }
      } else {
        const newCarrier = {
          value: values.value,
          label: values.label,
          trackingUrlTemplate: values.trackingUrlTemplate
        };
        const result = await logisticsService.addShippingCarrier(newCarrier);
        if (result.success) {
          message.success('貨運公司已新增');
          loadCarriers();
        } else {
          message.error('新增失敗');
          return;
        }
      }
      setCarrierModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('操作失敗：' + error.message);
    }
  };

  const handleDeleteCarrier = async (carrierValue) => {
    try {
      const result = await logisticsService.deleteShippingCarrier(carrierValue);
      if (result.success) {
        message.success('貨運公司已刪除');
        loadCarriers();
      } else {
        message.error('刪除失敗');
      }
    } catch (error) {
      message.error('刪除失敗：' + error.message);
    }
  };

  const columns = [
    {
      title: '公司名稱',
      dataIndex: 'label',
      key: 'label'
    },
    {
      title: '代碼',
      dataIndex: 'value',
      key: 'value',
      width: 150
    },
    {
      title: '追蹤網址模板',
      dataIndex: 'trackingUrlTemplate',
      key: 'trackingUrlTemplate',
      render: (url) => (
        <Text code style={{ fontSize: '12px' }}>
          {url}
        </Text>
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
            onClick={() => handleEditCarrier(record)}
          >
            編輯
          </Button>
          <Popconfirm
            title="確定要刪除此貨運公司嗎？"
            onConfirm={() => handleDeleteCarrier(record.value)}
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCarrier}
        >
          新增貨運公司
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={carriers}
          rowKey="value"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 家貨運公司`
          }}
          size="middle"
        />
      </Card>

      {/* 貨運公司編輯 Modal */}
      <Modal
        title={editingCarrier ? '編輯貨運公司' : '新增貨運公司'}
        open={carrierModalVisible}
        onCancel={() => setCarrierModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setCarrierModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
          >
            {editingCarrier ? '更新' : '新增'}
          </Button>
        ]}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCarrierSubmit}
        >
          <Form.Item
            name="label"
            label="公司名稱"
            rules={[{ required: true, message: '請輸入公司名稱' }]}
          >
            <Input placeholder="例如：黑貓宅急便" />
          </Form.Item>
          
          <Form.Item
            name="value"
            label="代碼"
            rules={[
              { required: true, message: '請輸入公司代碼' },
              { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '代碼只能包含字母、數字、底線和中文' }
            ]}
          >
            <Input 
              placeholder="例如：black_cat" 
              disabled={!!editingCarrier}
            />
          </Form.Item>
          
          <Form.Item
            name="trackingUrlTemplate"
            label="追蹤網址模板"
            rules={[{ required: true, message: '請輸入追蹤網址模板' }]}
            extra="使用 {} 代表追蹤編號的位置，例如：https://example.com/track?no={}"
          >
            <Input placeholder="https://example.com/track?no={}" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LogisticsManagement;