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
  Switch,
  ColorPicker
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import categoryService from '../../services/categoryService';
import EmojiPicker from '../../components/EmojiPicker';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10); // 預設每頁10筆
  

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const result = await categoryService.getAll();
      if (result.success) {
        setCategories(result.data);
      } else {
        message.error('載入分類失敗');
      }
    } catch (error) {
      message.error('載入分類失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      color: '#1890ff',
      sortOrder: categories.length + 1
    });
    setModalVisible(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      ...category,
      color: category.color
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    const categoryData = {
      ...values,
      color: typeof values.color === 'string' ? values.color : values.color.toHexString()
    };

    // 驗證數據
    const validation = categoryService.validateCategory(categoryData);
    if (!validation.isValid) {
      validation.errors.forEach(error => message.error(error));
      return;
    }

    try {
      if (editingCategory) {
        const result = await categoryService.update(editingCategory.id, categoryData);
        if (result.success) {
          message.success('產品類別已更新');
        } else {
          message.error('更新失敗');
          return;
        }
      } else {
        const result = await categoryService.addWithId(categoryData.id, categoryData);
        if (result.success) {
          message.success('產品類別已新增');
        } else {
          message.error('新增失敗');
          return;
        }
      }

      loadCategories();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('操作失敗：' + error.message);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      const result = await categoryService.delete(categoryId);
      if (result.success) {
        loadCategories();
        message.success('產品類別已刪除');
      } else {
        message.error('刪除失敗');
      }
    } catch (error) {
      message.error('刪除失敗：' + error.message);
    }
  };

  const handleToggleActive = async (categoryId, isActive) => {
    try {
      console.log('Toggling category:', categoryId, 'to', isActive);
      
      // 先檢查類別是否存在
      const existsResult = await categoryService.exists(categoryId);
      if (!existsResult.success || !existsResult.exists) {
        message.error(`類別 "${categoryId}" 不存在，請重新載入頁面`);
        loadCategories(); // 重新載入數據
        return;
      }
      
      const result = await categoryService.toggleCategoryStatus(categoryId, isActive);
      if (result.success) {
        loadCategories();
        message.success(`類別已${isActive ? '啟用' : '停用'}`);
      } else {
        message.error('狀態更新失敗: ' + result.error);
      }
    } catch (error) {
      console.error('Toggle category active error:', error);
      message.error('狀態更新失敗：' + error.message);
    }
  };

  const handleSortChange = async (categoryId, newSortOrder) => {
    try {
      const result = await categoryService.updateSortOrder(categoryId, newSortOrder);
      if (result.success) {
        loadCategories();
        message.success('排序已更新');
      } else {
        message.error('排序更新失敗');
      }
    } catch (error) {
      message.error('排序更新失敗：' + error.message);
    }
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      render: (sortOrder, record) => (
        <Input
          type="number"
          value={sortOrder}
          onChange={(e) => handleSortChange(record.id, parseInt(e.target.value) || 1)}
          style={{ width: 60 }}
          min={1}
        />
      )
    },
    {
      title: '圖示',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      render: (icon) => (
        <div style={{ fontSize: '32px', textAlign: 'center' }}>
          {icon}
        </div>
      )
    },
    {
      title: '類別名稱',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: record.color,
              borderRadius: '2px'
            }}
          />
          <Text strong>{name}</Text>
        </div>
      )
    },
    {
      title: '類別代碼',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id) => <Text code>{id}</Text>
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '狀態',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          size="small"
          onChange={(checked) => handleToggleActive(record.id, checked)}
        />
      )
    },
    {
      title: '建立時間',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => {
        if (date && date.seconds) {
          return new Date(date.seconds * 1000).toLocaleDateString('zh-TW');
        }
        return date ? new Date(date).toLocaleDateString('zh-TW') : '-';
      }
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
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="確定要刪除此類別嗎？"
            description="刪除後將無法復原，且可能影響相關商品。"
            onConfirm={() => handleDelete(record.id)}
            okText="確定"
            cancelText="取消"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>產品類別管理</Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              loadCategories();
            }}
          >
            刷新
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            新增類別
          </Button>
        </Space>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={categories.sort((a, b) => a.sortOrder - b.sortOrder)}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50', '100'],
            showTotal: (total) => `共 ${total} 個類別`,
            onShowSizeChange: (current, size) => {
              setPageSize(size);
            }
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新增/編輯類別 Modal */}
      <Modal
        title={editingCategory ? '編輯產品類別' : '新增產品類別'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
          >
            {editingCategory ? '更新' : '建立'}
          </Button>
        ]}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="id"
            label="類別代碼"
            rules={[
              { required: true, message: '請輸入類別代碼' },
              { pattern: /^[a-z_]+$/, message: '只能包含小寫字母和底線' }
            ]}
          >
            <Input 
              placeholder="例如：vegetable" 
              disabled={!!editingCategory}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="類別名稱"
            rules={[{ required: true, message: '請輸入類別名稱' }]}
          >
            <Input placeholder="例如：蔬菜類" />
          </Form.Item>

          <Form.Item
            name="description"
            label="類別描述"
            rules={[{ required: true, message: '請輸入類別描述' }]}
          >
            <TextArea rows={3} placeholder="描述此類別的商品特色" />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="icon"
              label="類別圖示"
              rules={[{ required: true, message: '請輸入類別圖示' }]}
              style={{ flex: 1 }}
            >
              <EmojiPicker placeholder="🥬 (使用 emoji)" />
            </Form.Item>

            <Form.Item
              name="color"
              label="主題色彩"
              rules={[{ required: true, message: '請選擇主題色彩' }]}
            >
              <ColorPicker showText />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="sortOrder"
              label="排序順序"
              rules={[{ required: true, message: '請輸入排序順序' }]}
              style={{ flex: 1 }}
            >
              <Input type="number" min={1} placeholder="1" />
            </Form.Item>

            <Form.Item
              name="isActive"
              label="啟用狀態"
              valuePropName="checked"
              style={{ flex: 1 }}
            >
              <Switch checkedChildren="啟用" unCheckedChildren="停用" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;