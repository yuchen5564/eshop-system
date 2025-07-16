import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, Space, Table, Button, Spin } from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import userManagementService from '../../services/userManagementService';
import couponService from '../../services/couponService';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    activeCoupons: 0,
    todayOrders: 0,
    todayRevenue: 0,
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
      // 並行載入所有數據以提高效能
      const [
        ordersResult,
        productsResult,
        categoriesResult,
        usersResult,
        couponsResult
      ] = await Promise.all([
        orderService.getAll(),
        productService.getAll(),
        categoryService.getAll(),
        userManagementService.getAllUsers(),
        couponService.getAll()
      ]);

      let calculatedStats = {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        totalProducts: 0,
        totalCategories: 0,
        totalUsers: 0,
        activeCoupons: 0,
        todayOrders: 0,
        todayRevenue: 0,
        monthlyOrdersGrowth: 0,
        monthlyRevenueGrowth: 0
      };

      // 處理訂單數據
      if (ordersResult.success) {
        const orders = ordersResult.data;
        
        // 設定最近5筆訂單 (修正時間排序)
        const sortedOrders = orders.sort((a, b) => {
          const aDate = new Date(a.orderDate || a.createdAt);
          const bDate = new Date(b.orderDate || b.createdAt);
          return bDate - aDate;
        });
        setRecentOrders(sortedOrders.slice(0, 5));
        
        // 計算訂單統計
        calculatedStats.totalOrders = orders.length;
        calculatedStats.totalRevenue = orders.reduce((sum, order) => {
          if (order.status === 'delivered' || order.status === 'shipped') {
            return sum + (order.total || 0);
          }
          return sum;
        }, 0);        
        calculatedStats.pendingOrders = orders.filter(order => order.status === 'pending').length;
        
        // 計算今日訂單和營收
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayOrders = orders.filter(order => {
          const orderDate = new Date(order.orderDate || order.createdAt);
          return orderDate >= startOfDay;
        });
        
        calculatedStats.todayOrders = todayOrders.length;
        calculatedStats.todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        // 計算月度成長率 (簡化版本)
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        const currentMonthOrders = orders.filter(order => {
          const orderDate = new Date(order.orderDate || order.createdAt);
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });
        
        const lastMonthOrders = orders.filter(order => {
          const orderDate = new Date(order.orderDate || order.createdAt);
          return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
        });
        
        if (lastMonthOrders.length > 0) {
          calculatedStats.monthlyOrdersGrowth = Math.round(
            ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
          );
          
          const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
          const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
          
          if (lastMonthRevenue > 0) {
            calculatedStats.monthlyRevenueGrowth = Math.round(
              ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            );
          }
        }
      }

      // 處理商品數據
      if (productsResult.success) {
        const products = productsResult.data;
        calculatedStats.totalProducts = products.length;
        
        // 計算低庫存商品 (庫存 <= 10)
        calculatedStats.lowStockProducts = products.filter(product => 
          (product.stock || 0) <= 10 && product.isActive !== false
        ).length;
      }

      // 處理分類數據
      if (categoriesResult.success) {
        calculatedStats.totalCategories = categoriesResult.data.length;
      }

      // 處理用戶數據
      if (usersResult.success) {
        calculatedStats.totalUsers = usersResult.data.length;
      }

      // 處理優惠券數據
      if (couponsResult.success) {
        const coupons = couponsResult.data;
        const now = new Date();
        calculatedStats.activeCoupons = coupons.filter(coupon => 
          coupon.isActive && 
          new Date(coupon.validFrom) <= now && 
          new Date(coupon.validTo) >= now
        ).length;
      }

      setStats(calculatedStats);
      
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
          delivered: { color: 'green', text: '已送達' },
          cancelled: { color: 'red', text: '已取消' },
          refunded: { color: 'purple', text: '已退款' }
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
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>總覽儀表板</Title>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={loadDashboardData}
          loading={loading}
        >
          刷新數據
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Spin spinning={loading}>
              <Statistic
                title="總訂單數"
                value={loading ? 0 : stats.totalOrders}
                prefix={<ShoppingOutlined />}
                suffix={
                  !loading && stats.monthlyOrdersGrowth !== 0 && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: stats.monthlyOrdersGrowth > 0 ? '#52c41a' : '#ff4d4f' 
                    }}>
                      {stats.monthlyOrdersGrowth > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} 
                      {Math.abs(stats.monthlyOrdersGrowth)}%
                    </div>
                  )
                }
              />
            </Spin>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Spin spinning={loading}>
              <Statistic
                title="總營收"
                value={loading ? 0 : stats.totalRevenue}
                prefix={<DollarOutlined />}
                precision={0}
                formatter={(value) => `NT$ ${value.toLocaleString()}`}
                suffix={
                  !loading && stats.monthlyRevenueGrowth !== 0 && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: stats.monthlyRevenueGrowth > 0 ? '#52c41a' : '#ff4d4f' 
                    }}>
                      {stats.monthlyRevenueGrowth > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} 
                      {Math.abs(stats.monthlyRevenueGrowth)}%
                    </div>
                  )
                }
              />
            </Spin>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Spin spinning={loading}>
              <Statistic
                title="待處理訂單"
                value={loading ? 0 : stats.pendingOrders}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: stats.pendingOrders > 0 ? '#faad14' : '#52c41a' }}
              />
            </Spin>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Spin spinning={loading}>
              <Statistic
                title="低庫存商品"
                value={loading ? 0 : stats.lowStockProducts}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: stats.lowStockProducts > 0 ? '#ff4d4f' : '#52c41a' }}
              />
            </Spin>
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
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="快速統計" style={{ height: '500px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>今日訂單</Text>
                <Text strong style={{ color: '#1890ff' }}>
                  {loading ? '-' : stats.todayOrders}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>今日營收</Text>
                <Text strong style={{ color: '#52c41a' }}>
                  {loading ? '-' : `NT$ ${stats.todayRevenue.toLocaleString()}`}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>總商品數</Text>
                <Text strong style={{ color: '#722ed1' }}>
                  {loading ? '-' : stats.totalProducts}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>商品分類</Text>
                <Text strong style={{ color: '#fa8c16' }}>
                  {loading ? '-' : stats.totalCategories}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>系統用戶</Text>
                <Text strong style={{ color: '#13c2c2' }}>
                  {loading ? '-' : stats.totalUsers}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>活躍優惠券</Text>
                <Text strong style={{ color: '#eb2f96' }}>
                  {loading ? '-' : stats.activeCoupons}
                </Text>
              </div>
              <div 
                style={{ 
                  marginTop: '16px', 
                  padding: '12px', 
                  background: '#f6ffed', 
                  border: '1px solid #b7eb8f', 
                  borderRadius: '6px' 
                }}
              >
                <Text style={{ fontSize: '12px', color: '#389e0d' }}>
                  📊 數據每次進入頁面時自動更新
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;