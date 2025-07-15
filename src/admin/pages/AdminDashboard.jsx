import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, Space, Table } from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import orderService from '../../services/orderService';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    monthlyOrdersGrowth: 0,
    monthlyRevenueGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 載入所有訂單
      const ordersResult = await orderService.getAll();
      if (ordersResult.success) {
        const orders = ordersResult.data;
        
        // 設定最近5筆訂單
        const sortedOrders = orders.sort((a, b) => new Date(b.createdAt?.seconds * 1000) - new Date(a.createdAt?.seconds * 1000));
        setRecentOrders(sortedOrders.slice(0, 5));
        
        // 計算統計數據
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        
        setStats({
          totalOrders,
          totalRevenue,
          pendingOrders,
          lowStockProducts: 0, // TODO: 實現低庫存商品統計
          monthlyOrdersGrowth: 0, // TODO: 實現月度增長統計
          monthlyRevenueGrowth: 0 // TODO: 實現月度增長統計
        });
      }
    } catch (error) {
      console.error('載入儀表板數據失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const orderColumns = [
    {
      title: '訂單編號',
      dataIndex: 'id',
      key: 'id',
      width: 120
    },
    {
      title: '客戶姓名',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: '訂單金額',
      dataIndex: 'total',
      key: 'total',
      render: (amount) => `NT$ ${amount}`
    },
    {
      title: '訂單狀態',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          pending: { color: 'orange', text: '待處理' },
          processing: { color: 'blue', text: '處理中' },
          shipped: { color: 'cyan', text: '已出貨' },
          delivered: { color: 'green', text: '已送達' }
        };
        const statusInfo = statusMap[status];
        return (
          <span style={{ color: statusInfo.color }}>
            {statusInfo.text}
          </span>
        );
      }
    },
    {
      title: '訂單時間',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => new Date(date).toLocaleDateString('zh-TW')
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>總覽儀表板</Title>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="總訂單數"
              value={stats.totalOrders}
              prefix={<ShoppingOutlined />}
              suffix={
                <div style={{ fontSize: '12px', color: '#52c41a' }}>
                  <ArrowUpOutlined /> {stats.monthlyOrdersGrowth}%
                </div>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="總營收"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              precision={0}
              suffix={
                <div style={{ fontSize: '12px', color: '#52c41a' }}>
                  <ArrowUpOutlined /> {stats.monthlyRevenueGrowth}%
                </div>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待處理訂單"
              value={stats.pendingOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="低庫存商品"
              value={stats.lowStockProducts}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts and Tables */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="最近訂單" style={{ height: '500px' }}>
            <Table
              dataSource={recentOrders}
              columns={orderColumns}
              rowKey="id"
              pagination={false}
              size="small"
              loading={loading}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="快速統計" style={{ height: '500px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>今日訂單</Text>
                    <Text strong>12</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>今日營收</Text>
                    <Text strong>NT$ 8,500</Text>
                  </div>
                  {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>線上用戶</Text>
                    <Text strong>156</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>新註冊用戶</Text>
                    <Text strong>3</Text>
                  </div> */}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;