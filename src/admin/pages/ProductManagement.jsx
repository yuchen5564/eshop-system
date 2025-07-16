import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  InputNumber,
  Upload,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  Tag,
  Switch
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import EmojiPicker from '../../components/EmojiPicker';

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadProducts(), loadCategories()]);
    } catch (error) {
      message.error('載入資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const result = await productService.getAll();
      if (result.success) {
        setProducts(result.data);
      } else {
        message.error('載入商品失敗');
      }
    } catch (error) {
      message.error('載入商品失敗');
    }
  };

  const loadCategories = async () => {
    try {
      const result = await categoryService.getActiveCategories();
      if (result.success) {
        setCategories(result.data);
      } else {
        message.error('載入分類失敗');
      }
    } catch (error) {
      message.error('載入分類失敗');
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const result = await productService.delete(productId);
      if (result.success) {
        message.success('商品已刪除');
        loadData(); // 重新載入數據
      } else {
        message.error('刪除商品失敗');
      }
    } catch (error) {
      message.error('刪除商品失敗');
    }
  };

  const handleSaveProduct = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingProduct) {
        // 編輯現有商品
        const result = await productService.update(editingProduct.id, values);
        if (result.success) {
          setProducts(products.map(p => 
            p.id === editingProduct.id 
              ? { ...p, ...values }
              : p
          ));
          message.success('商品已更新');
        } else {
          message.error('更新商品失敗');
          return;
        }
      } else {
        // 添加新商品
        const newProduct = {
          ...values,
          rating: 0,
          reviews: 0,
          isActive: true
        };
        const result = await productService.add(newProduct);
        if (result.success) {
          setProducts([...products, { id: result.id, ...newProduct }]);
          message.success('商品已添加');
        } else {
          message.error('添加商品失敗');
          return;
        }
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
      message.error('操作失敗');
    }
  };

  const handleToggleStatus = async (productId, newStatus) => {
    try {
      const result = await productService.update(productId, { isActive: newStatus });
      if (result.success) {
        setProducts(products.map(p => 
          p.id === productId 
            ? { ...p, isActive: newStatus }
            : p
        ));
        message.success(newStatus ? '商品已上架' : '商品已下架');
      } else {
        message.error('更新商品狀態失敗');
      }
    } catch (error) {
      message.error('更新商品狀態失敗');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         product.farm.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.isActive) ||
                         (statusFilter === 'inactive' && !product.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const columns = [
    {
      title: '商品圖片',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image) => (
        <div style={{ fontSize: '32px', textAlign: 'center' }}>{image}</div>
      )
    },
    {
      title: '商品名稱',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: '分類',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const categoryInfo = categories.find(c => c.id === category);
        return <Tag color={categoryInfo?.color || "blue"}>{categoryInfo?.name || category}</Tag>;
      }
    },
    {
      title: '價格',
      key: 'price',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
            NT$ {record.price}
          </div>
          {record.originalPrice > record.price && (
            <div style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>
              NT$ {record.originalPrice}
            </div>
          )}
        </div>
      ),
      sorter: (a, b) => a.price - b.price
    },
    {
      title: '狀態',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
          checkedChildren="上架"
          unCheckedChildren="下架"
        />
      )
    },
    {
      title: '庫存',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <span style={{ color: stock < 10 ? '#ff4d4f' : '#000' }}>
          {stock} {stock < 10 && <Tag color="red">低庫存</Tag>}
        </span>
      ),
      sorter: (a, b) => a.stock - b.stock
    },
    {
      title: '農場',
      key: 'farm',
      render: (_, record) => (
        <div>
          <div>{record.farm}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.location}</div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditProduct(record)}
          >
            編輯
          </Button>
          <Popconfirm
            title="確定要刪除這個商品嗎？"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="確定"
            cancelText="取消"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
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
        <Title level={3} style={{ margin: 0 }}>商品管理</Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              loadProducts();
            }}
          >
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
            新增商品
          </Button>
        </Space>
      </div>
      
      <Card>

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={8}>
            <Search
              placeholder="搜尋商品名稱或農場"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="商品分類"
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: '100%' }}
            >
              <Select.Option value="all">全部分類</Select.Option>
              {categories.map(category => (
                <Select.Option key={category.id} value={category.id}>
                  <span style={{ marginRight: '8px' }}>{category.icon}</span>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="商品狀態"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Select.Option value="all">全部狀態</Select.Option>
              <Select.Option value="active">已上架</Select.Option>
              <Select.Option value="inactive">已下架</Select.Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 個商品`
          }}
        />
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        title={editingProduct ? '編輯商品' : '新增商品'}
        open={isModalVisible}
        onOk={handleSaveProduct}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            category: categories.length > 0 ? categories[0].id : '',
            stock: 0,
            price: 0,
            originalPrice: 0,
            unit: '斤',
            isActive: true
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="商品名稱"
                rules={[{ required: true, message: '請輸入商品名稱' }]}
              >
                <Input placeholder="請輸入商品名稱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="商品分類"
                rules={[{ required: true, message: '請選擇商品分類' }]}
              >
                <Select placeholder="請選擇商品分類">
                  {categories.map(category => (
                    <Select.Option key={category.id} value={category.id}>
                      <span style={{ marginRight: '8px' }}>{category.icon}</span>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="商品描述"
            rules={[{ required: true, message: '請輸入商品描述' }]}
          >
            <TextArea rows={3} placeholder="請輸入商品描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="售價"
                rules={[{ required: true, message: '請輸入售價' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="請輸入售價"
                  addonBefore="NT$"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="originalPrice"
                label="原價"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="請輸入原價"
                  addonBefore="NT$"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="unit"
                label="單位"
                rules={[{ required: true, message: '請輸入單位' }]}
              >
                <Input placeholder="請輸入單位" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stock"
                label="庫存數量"
                rules={[{ required: true, message: '請輸入庫存數量' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="請輸入庫存數量"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="image"
                label="商品圖示"
                rules={[{ required: true, message: '請輸入商品圖示' }]}
              >
                <EmojiPicker placeholder="請輸入emoji圖示" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="farm"
                label="農場名稱"
                rules={[{ required: true, message: '請輸入農場名稱' }]}
              >
                <Input placeholder="請輸入農場名稱" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="location"
                label="產地"
                rules={[{ required: true, message: '請輸入產地' }]}
              >
                <Input placeholder="請輸入產地" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isActive"
                label="商品狀態"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="上架"
                  unCheckedChildren="下架"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;