import React from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, Space, Table } from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { dashboardStats, mockOrders } from '../data/mockAdminData';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const recentOrders = mockOrders.slice(0, 5);

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
      <Title level={2} style={{ marginBottom: '32px' }}>
        總覽儀表板
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="總訂單數"
              value={dashboardStats.totalOrders}
              prefix={<ShoppingOutlined />}
              suffix={
                <div style={{ fontSize: '12px', color: '#52c41a' }}>
                  <ArrowUpOutlined /> {dashboardStats.monthlyOrdersGrowth}%
                </div>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="總營收"
              value={dashboardStats.totalRevenue}
              prefix={<DollarOutlined />}
              precision={0}
              suffix={
                <div style={{ fontSize: '12px', color: '#52c41a' }}>
                  <ArrowUpOutlined /> {dashboardStats.monthlyRevenueGrowth}%
                </div>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待處理訂單"
              value={dashboardStats.pendingOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="低庫存商品"
              value={dashboardStats.lowStockProducts}
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
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="系統狀態" style={{ height: '500px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text strong>服務器運行狀態</Text>
                <Progress percent={98} status="active" strokeColor="#52c41a" />
              </div>
              
              <div>
                <Text strong>資料庫連接</Text>
                <Progress percent={100} strokeColor="#52c41a" />
              </div>
              
              <div>
                <Text strong>支付系統</Text>
                <Progress percent={95} strokeColor="#1890ff" />
              </div>
              
              <div>
                <Text strong>庫存同步</Text>
                <Progress percent={88} strokeColor="#faad14" />
              </div>
              
              <div style={{ marginTop: '32px' }}>
                <Title level={4}>快速統計</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>今日訂單</Text>
                    <Text strong>12</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>今日營收</Text>
                    <Text strong>NT$ 8,500</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>線上用戶</Text>
                    <Text strong>156</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>新註冊用戶</Text>
                    <Text strong>3</Text>
                  </div>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;