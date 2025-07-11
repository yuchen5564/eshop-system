import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Tag, 
  Button, 
  Space, 
  Input, 
  Select, 
  Modal, 
  Descriptions, 
  Typography,
  Row,
  Col,
  message,
  Divider
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { mockOrders, orderStatusOptions, paymentStatusOptions } from '../data/mockAdminData';

const { Title, Text } = Typography;
const { Search } = Input;

const OrderManagement = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    message.success('訂單狀態已更新');
  };

  const handlePaymentStatusChange = (orderId, newPaymentStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
    ));
    message.success('付款狀態已更新');
  };

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const columns = [
    {
      title: '訂單編號',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      sorter: (a, b) => a.id.localeCompare(b.id)
    },
    {
      title: '客戶資訊',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.customerName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.customerEmail}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.customerPhone}</div>
        </div>
      )
    },
    {
      title: '訂單金額',
      dataIndex: 'total',
      key: 'total',
      render: (amount) => (
        <Text strong style={{ color: '#52c41a' }}>NT$ {amount.toLocaleString()}</Text>
      ),
      sorter: (a, b) => a.total - b.total
    },
    {
      title: '訂單狀態',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const statusOption = orderStatusOptions.find(opt => opt.value === status);
        return (
          <Select
            value={status}
            style={{ width: 100 }}
            size="small"
            onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
          >
            {orderStatusOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                <Tag color={option.color}>{option.label}</Tag>
              </Select.Option>
            ))}
          </Select>
        );
      }
    },
    {
      title: '付款狀態',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (paymentStatus, record) => {
        const statusOption = paymentStatusOptions.find(opt => opt.value === paymentStatus);
        return (
          <Select
            value={paymentStatus}
            style={{ width: 100 }}
            size="small"
            onChange={(newStatus) => handlePaymentStatusChange(record.id, newStatus)}
          >
            {paymentStatusOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                <Tag color={option.color}>{option.label}</Tag>
              </Select.Option>
            ))}
          </Select>
        );
      }
    },
    {
      title: '訂單時間',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => new Date(date).toLocaleString('zh-TW'),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate)
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => showOrderDetail(record)}
          >
            詳情
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>訂單管理</Title>
        </div>

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={8}>
            <Search
              placeholder="搜尋訂單編號或客戶姓名"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="訂單狀態"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Select.Option value="all">全部狀態</Select.Option>
              {orderStatusOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="付款狀態"
              value={paymentFilter}
              onChange={setPaymentFilter}
              style={{ width: '100%' }}
            >
              <Select.Option value="all">全部付款</Select.Option>
              {paymentStatusOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 筆訂單`
          }}
        />
      </Card>

      {/* Order Detail Modal */}
      <Modal
        title={`訂單詳情 - ${selectedOrder?.id}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            關閉
          </Button>
        ]}
      >
        {selectedOrder && (
          <div>
            <Descriptions title="客戶資訊" bordered column={2}>
              <Descriptions.Item label="客戶姓名">{selectedOrder.customerName}</Descriptions.Item>
              <Descriptions.Item label="聯絡電話">{selectedOrder.customerPhone}</Descriptions.Item>
              <Descriptions.Item label="電子郵件" span={2}>{selectedOrder.customerEmail}</Descriptions.Item>
              <Descriptions.Item label="配送地址" span={2}>{selectedOrder.shippingAddress}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="訂單資訊" bordered column={2}>
              <Descriptions.Item label="訂單編號">{selectedOrder.id}</Descriptions.Item>
              <Descriptions.Item label="訂單時間">
                {new Date(selectedOrder.orderDate).toLocaleString('zh-TW')}
              </Descriptions.Item>
              <Descriptions.Item label="訂單狀態">
                <Tag color={orderStatusOptions.find(opt => opt.value === selectedOrder.status)?.color}>
                  {orderStatusOptions.find(opt => opt.value === selectedOrder.status)?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="付款狀態">
                <Tag color={paymentStatusOptions.find(opt => opt.value === selectedOrder.paymentStatus)?.color}>
                  {paymentStatusOptions.find(opt => opt.value === selectedOrder.paymentStatus)?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="付款方式">{selectedOrder.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="訂單總額">
                <Text strong style={{ color: '#52c41a' }}>NT$ {selectedOrder.total.toLocaleString()}</Text>
              </Descriptions.Item>
              {selectedOrder.notes && (
                <Descriptions.Item label="備註" span={2}>{selectedOrder.notes}</Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            <Title level={4}>訂單商品</Title>
            <Table
              dataSource={selectedOrder.items}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: '商品',
                  key: 'product',
                  render: (_, item) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '24px' }}>{item.image}</span>
                      <span>{item.name}</span>
                    </div>
                  )
                },
                {
                  title: '單價',
                  dataIndex: 'price',
                  render: (price) => `NT$ ${price}`
                },
                {
                  title: '數量',
                  dataIndex: 'quantity'
                },
                {
                  title: '小計',
                  render: (_, item) => `NT$ ${item.price * item.quantity}`
                }
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement;