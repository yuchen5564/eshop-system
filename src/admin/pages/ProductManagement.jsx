import React, { useState } from 'react';
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
  Tag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { mockProducts } from '../../data/mockData';
import { productCategories } from '../data/mockAdminData';

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const ProductManagement = () => {
  const [products, setProducts] = useState(mockProducts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [form] = Form.useForm();

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

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    message.success('商品已刪除');
  };

  const handleSaveProduct = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingProduct) {
        // 編輯現有商品
        setProducts(products.map(p => 
          p.id === editingProduct.id 
            ? { ...p, ...values }
            : p
        ));
        message.success('商品已更新');
      } else {
        // 添加新商品
        const newProduct = {
          id: Math.max(...products.map(p => p.id)) + 1,
          ...values,
          rating: 0,
          reviews: 0
        };
        setProducts([...products, newProduct]);
        message.success('商品已添加');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         product.farm.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      title: '商品圖片',
      dataIndex: 'image',
      key: 'image',
      width: 80,
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
        const categoryInfo = productCategories.find(c => c.value === category);
        return <Tag color="blue">{categoryInfo?.label || category}</Tag>;
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
      title: '評價',
      key: 'rating',
      render: (_, record) => (
        <div>
          <div>⭐ {record.rating}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>({record.reviews} 評價)</div>
        </div>
      ),
      sorter: (a, b) => a.rating - b.rating
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
          新增商品
        </Button>
      </div>
      
      <Card>

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={12}>
            <Search
              placeholder="搜尋商品名稱或農場"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="商品分類"
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: '100%' }}
            >
              <Select.Option value="all">全部分類</Select.Option>
              {productCategories.map(category => (
                <Select.Option key={category.value} value={category.value}>
                  {category.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
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
            category: 'vegetable',
            stock: 0,
            price: 0,
            originalPrice: 0,
            unit: '斤'
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
                  {productCategories.map(category => (
                    <Select.Option key={category.value} value={category.value}>
                      {category.label}
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
                <Input placeholder="請輸入emoji圖示" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="farm"
                label="農場名稱"
                rules={[{ required: true, message: '請輸入農場名稱' }]}
              >
                <Input placeholder="請輸入農場名稱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="產地"
                rules={[{ required: true, message: '請輸入產地' }]}
              >
                <Input placeholder="請輸入產地" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;