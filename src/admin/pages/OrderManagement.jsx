import React, { useState, useEffect } from 'react';
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
  Divider,
  Form,
  DatePicker,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  SearchOutlined,
  FilterOutlined,
  TruckOutlined,
  SendOutlined,
  DownloadOutlined,
  CalendarOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import emailService from '../../services/emailService';
import orderService from '../../services/orderService';
import { logisticsService } from '../../services/logisticsService';
import paymentService from '../../services/paymentService';

const { Title, Text } = Typography;
const { Search } = Input;

const orderStatusOptions = [
  { value: 'pending', label: '待處理', color: 'orange' },
  { value: 'processing', label: '處理中', color: 'blue' },
  { value: 'shipped', label: '已出貨', color: 'cyan' },
  { value: 'delivered', label: '已送達', color: 'green' },
  { value: 'cancelled', label: '已取消', color: 'red' }
];

export const paymentStatusOptions = [
  { value: 'pending', label: '待付款', color: 'orange' },
  { value: 'paid', label: '已付款', color: 'green' },
  { value: 'failed', label: '付款失敗', color: 'red' },
  { value: 'refunded', label: '已退款', color: 'purple' }
];

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShippingModalVisible, setIsShippingModalVisible] = useState(false);
  const [shippingForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  const [emailSending, setEmailSending] = useState(false);
  const [shippingCarriers, setShippingCarriers] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [pageSize, setPageSize] = useState(10); // 預設每頁10筆


  // 載入訂單數據和物流選項
  useEffect(() => {
    loadOrders();
    loadShippingCarriers();
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const result = await paymentService.getAll();
      if (result.success && result.data.length > 0) {
        // 將資料庫格式轉換為組件需要的格式
        const formattedMethods = result.data.map(method => ({
          value: method.id,
          label: method.name,
          icon: method.icon || '💳'
        }));
        setPaymentMethods(formattedMethods);
        console.log('已載入付款方式:', formattedMethods);
      } else {
        console.log('資料庫中沒有付款方式，使用預設選項');
        // 如果資料庫中沒有資料，使用預設選項
        const defaultMethods = [
          { value: 'credit_card', label: '信用卡付款', icon: '💳' },
          { value: 'bank_transfer', label: '銀行轉帳', icon: '🏦' },
          { value: 'cash_on_delivery', label: '貨到付款', icon: '💰' }
        ];
        setPaymentMethods(defaultMethods);
      }
    } catch (error) {
      console.error('載入付款方式失敗:', error);
      // 發生錯誤時使用預設選項
      const defaultMethods = [
        { value: 'credit_card', label: '信用卡付款', icon: '💳' },
        { value: 'bank_transfer', label: '銀行轉帳', icon: '🏦' },
        { value: 'cash_on_delivery', label: '貨到付款', icon: '💰' }
      ];
      setPaymentMethods(defaultMethods);
      message.warning('載入付款方式失敗，使用預設選項');
    }
  };

  const loadShippingCarriers = async () => {
    try {
      const result = await logisticsService.getShippingCarriers();
      if (result.success) {
        // console.log('Loaded shipping carriers:', result.data);
        // console.log('Number of carriers loaded:', result.data.length);
        
        // 如果沒有物流選項，嘗試初始化物流方法
        if (result.data.length === 0) {
          // console.log('No carriers found, trying to initialize logistics methods');
          const initResult = await logisticsService.initializeDefaultLogisticsMethods();
          if (initResult.success) {
            // 重新載入物流選項
            const retryResult = await logisticsService.getShippingCarriers();
            if (retryResult.success && retryResult.data.length > 0) {
              setShippingCarriers(retryResult.data);
              message.success('物流方法已初始化');
              return;
            }
          }

          // 如果初始化失敗，使用預設選項
          const defaultCarriers = [
            { value: 'post_office', label: '中華郵政', trackingUrlTemplate: 'https://trackings.post.gov.tw/?id={trackingNumber}' },
            { value: 'fedex', label: 'FedEx', trackingUrlTemplate: 'https://www.fedex.com/fedextrack/?tracknumbers={trackingNumber}' },
            { value: 'black_cat', label: '黑貓宅急便', trackingUrlTemplate: 'https://www.t-cat.com.tw/inquire/trace.aspx?no={trackingNumber}' },
            { value: 'hct', label: '新竹物流', trackingUrlTemplate: 'https://www.hct.com.tw/business/service/query_cargo?no={trackingNumber}' }
          ];
          setShippingCarriers(defaultCarriers);
          console.log('No shipping carriers found, using default options');
          message.warning('使用預設物流選項');
        } else {
          console.log('Shipping carriers loaded:', result.data);
          setShippingCarriers(result.data);
          console.log(shippingCarriers)

        }
      } else {
        // console.error('Failed to load shipping carriers:', result.error);
        // 使用預設選項作為後備
        const defaultCarriers = [
          { value: 'post_office', label: '中華郵政', trackingUrlTemplate: 'https://trackings.post.gov.tw/?id={trackingNumber}' },
          { value: 'fedex', label: 'FedEx', trackingUrlTemplate: 'https://www.fedex.com/fedextrack/?tracknumbers={trackingNumber}' },
          { value: 'black_cat', label: '黑貓宅急便', trackingUrlTemplate: 'https://www.t-cat.com.tw/inquire/trace.aspx?no={trackingNumber}' },
          { value: 'hct', label: '新竹物流', trackingUrlTemplate: 'https://www.hct.com.tw/business/service/query_cargo?no={trackingNumber}' }
        ];
        setShippingCarriers(defaultCarriers);
        message.warning('載入物流選項失敗，使用預設選項');
      }
    } catch (error) {
      // console.error('載入物流選項失敗:', error);
      // 使用預設選項作為後備
      const defaultCarriers = [
        { value: 'post_office', label: '中華郵政', trackingUrlTemplate: 'https://trackings.post.gov.tw/?id={trackingNumber}' },
        { value: 'fedex', label: 'FedEx', trackingUrlTemplate: 'https://www.fedex.com/fedextrack/?tracknumbers={trackingNumber}' },
        { value: 'black_cat', label: '黑貓宅急便', trackingUrlTemplate: 'https://www.t-cat.com.tw/inquire/trace.aspx?no={trackingNumber}' },
        { value: 'hct', label: '新竹物流', trackingUrlTemplate: 'https://www.hct.com.tw/business/service/query_cargo?no={trackingNumber}' }
      ];
      setShippingCarriers(defaultCarriers);
      message.warning('載入物流選項失敗，使用預設選項');
    }
  };

  // 獲取付款方式顯示標籤的輔助函數
  const getPaymentMethodLabel = (paymentMethodId) => {
    const method = paymentMethods.find(method => method.value === paymentMethodId);
    return method ? method.label : paymentMethodId; // 找不到時顯示原始ID
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const result = await orderService.getAll();
      if (result.success) {
        setOrders(result.data);
      } else {
        message.error('載入訂單失敗: ' + result.error);
      }
    } catch (error) {
      message.error('載入訂單失敗: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const result = await orderService.updateStatus(orderId, newStatus);
      if (result.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        message.success('訂單狀態已更新');
      } else {
        message.error('更新訂單狀態失敗: ' + result.error);
      }
    } catch (error) {
      message.error('更新訂單狀態失敗: ' + error.message);
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      const result = await orderService.update(orderId, { paymentStatus: newPaymentStatus });
      if (result.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
        ));
        message.success('付款狀態已更新');
      } else {
        message.error('更新付款狀態失敗: ' + result.error);
      }
    } catch (error) {
      message.error('更新付款狀態失敗: ' + error.message);
    }
  };

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const showShippingModal = (order) => {
    setSelectedOrder(order);
    setIsShippingModalVisible(true);

    if (order.shippingInfo) {
      const {
        carrier = '',
        trackingNumber = '',
        estimatedDelivery = '',
        notes = ''
      } = order.shippingInfo;

      shippingForm.setFieldsValue({
        carrier: carrier || undefined,
        trackingNumber,
        estimatedDelivery: estimatedDelivery ?? '',
        notes: notes ?? ''
      });
    } else {
      shippingForm.setFieldsValue({
        carrier: undefined,
        trackingNumber: '',
        estimatedDelivery: '',
        notes: ''
      });
    }
  };

  const handleShippingSubmit = async (values) => {
    setEmailSending(true);
    try {
      const shippingInfo = {
        ...values,
        shippedDate: new Date().toISOString(),
        trackingUrl: shippingCarriers.find(c => c.value === values.carrier)?.trackingUrlTemplate?.replace('{trackingNumber}', values.trackingNumber)
      };

      const updatedOrder = {
        ...selectedOrder,
        status: 'shipped',
        shippingInfo,
        emailNotifications: {
          ...selectedOrder.emailNotifications,
          shippingNotification: { sent: false, sentAt: null, status: 'pending' }
        }
      };

      const result = await emailService.sendShippingNotificationEmail(selectedOrder, shippingInfo);
      
      // 更新郵件發送狀態
      if (result.success) {
        updatedOrder.emailNotifications.shippingNotification = {
          sent: true,
          sentAt: new Date().toISOString(),
          status: 'delivered'
        };
        message.success('出貨資訊已更新，通知郵件已發送');
      } else {
        updatedOrder.emailNotifications.shippingNotification = {
          sent: false,
          sentAt: new Date().toISOString(),
          status: 'failed'
        };
        message.warning('出貨資訊已更新，但郵件發送失敗');
      }

      // 更新到數據庫
      const updateResult = await orderService.update(selectedOrder.id, {
        status: 'shipped',
        shippingInfo,
        emailNotifications: updatedOrder.emailNotifications
      });
      
      if (updateResult.success) {
        setOrders(orders.map(order => 
          order.id === selectedOrder.id ? updatedOrder : order
        ));
      } else {
        message.error('更新出貨資訊到數據庫失敗');
      }

      setIsShippingModalVisible(false);
      shippingForm.resetFields();
    } catch (error) {
      message.error('更新出貨資訊失敗');
    } finally {
      setEmailSending(false);
    }
  };

  const handleShippingWithoutNotification = async (values) => {
    try {
      const shippingInfo = {
        ...values,
        shippedDate: new Date().toISOString(),
        trackingUrl: shippingCarriers.find(c => c.value === values.carrier)?.trackingUrlTemplate?.replace('{trackingNumber}', values.trackingNumber)
      };
      
      const updatedOrder = {
        ...selectedOrder,
        status: 'shipped',
        shippingInfo,
        emailNotifications: {
          ...selectedOrder.emailNotifications,
          shippingNotification: { sent: false, sentAt: null, status: 'not_sent' }
        }
      };
      
      // 更新到數據庫
      const updateResult = await orderService.update(selectedOrder.id, {
        status: 'shipped',
        shippingInfo,
        emailNotifications: updatedOrder.emailNotifications
      });
      
      if (updateResult.success) {
        setOrders(orders.map(order => 
          order.id === selectedOrder.id ? updatedOrder : order
        ));
        message.success('出貨資訊已更新（未發送通知郵件）');
      } else {
        message.error('更新出貨資訊到數據庫失敗');
      }
      setIsShippingModalVisible(false);
      shippingForm.resetFields();
    } catch {
      message.error('更新出貨資訊失敗');
    }
  };

  const handleExportReport = () => {
    const csvContent = generateCSVReport(filteredOrders);
    downloadCSV(csvContent, 'order-report.csv');
    message.success('報表已匯出');
  };

  const generateCSVReport = (orders) => {
    const headers = [
      '訂單編號',
      '客戶姓名',
      '客戶電話',
      '客戶郵件',
      '訂單金額',
      '訂單狀態',
      '付款狀態',
      '訂單時間',
      '配送地址',
      '付款方式',
      '出貨狀態',
      '貨運公司',
      '追蹤編號',
      '訂購商品詳情'
    ];
    
    const rows = orders.map(order => {
      // 將商品資訊格式化為文字
      const itemsDetail = order.items.map(item => 
        `${item.name} x${item.quantity} = NT$${item.price * item.quantity}`
      ).join('; ');
      
      return [
        order.id,
        order.customerName,
        order.customerPhone,
        order.customerEmail,
        order.total,
        orderStatusOptions.find(opt => opt.value === order.status)?.label || order.status,
        paymentStatusOptions.find(opt => opt.value === order.paymentStatus)?.label || order.paymentStatus,
        new Date(order.orderDate).toLocaleString('zh-TW'),
        order.shippingAddress,
        getPaymentMethodLabel(order.paymentMethod),
        order.shippingInfo ? '已出貨' : '未出貨',
        order.shippingInfo?.carrier || '',
        order.shippingInfo?.trackingNumber || '',
        itemsDetail
      ];
    });
    
    return [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    let matchesDate = true;
    if (dateRange && dateRange.length === 2) {
      const orderDate = new Date(order.orderDate);
      const startDate = dateRange[0].startOf('day').toDate();
      const endDate = dateRange[1].endOf('day').toDate();
      matchesDate = orderDate >= startDate && orderDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
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
      title: '郵件通知',
      key: 'notifications',
      width: 120,
      render: (_, record) => {
        const notifications = record.emailNotifications || {};
        return (
          <div>
            <div style={{ fontSize: '12px', marginBottom: '2px' }}>
              <span style={{ color: notifications.orderConfirmation?.sent ? '#52c41a' : '#faad14' }}>
                訂單確認: {notifications.orderConfirmation?.sent ? '✓' : '✗'}
              </span>
            </div>
            {notifications.shippingNotification && (
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: notifications.shippingNotification?.sent ? '#52c41a' : '#faad14' }}>
                  出貨通知: {notifications.shippingNotification?.sent ? '✓' : '✗'}
                </span>
              </div>
            )}
          </div>
        );
      }
    },
    {
      title: '出貨狀態',
      key: 'shipping',
      width: 120,
      render: (_, record) => {
        if (record.shippingInfo) {
          // 根據carrier代碼找到對應的物流公司名稱
          const carrierInfo = shippingCarriers.find(c => c.value === record.shippingInfo.carrier);
          const carrierName = carrierInfo ? carrierInfo.label : record.shippingInfo.carrier;
          
          return (
            <div>
              <div style={{ fontSize: '12px', color: '#52c41a' }}>
                {carrierName}
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>
                {record.shippingInfo.trackingNumber}
              </div>
            </div>
          );
        }
        return <Text type="secondary">未出貨</Text>;
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
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
          {(record.status === 'processing' || record.status === 'shipped') && (
            <Button
              type="default"
              icon={<TruckOutlined />}
              size="small"
              onClick={() => showShippingModal(record)}
            >
              出貨
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>訂單管理</Title>
        <Space>
          {/* <Button 
            onClick={loadShippingCarriers}
          >
            重新載入物流選項
          </Button> */}
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              loadOrders();
            }}
          >
            刷新
          </Button>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleExportReport}
          >
            匯出報表
          </Button>
        </Space>
      </div>
      
      <Card>

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={6}>
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
          <Col xs={24} sm={6}>
            <DatePicker.RangePicker
              placeholder={['開始日期', '結束日期']}
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
            />
          </Col>
          <Col xs={24} sm={4}>
            <Button 
              icon={<FilterOutlined />} 
              onClick={() => {
                setSearchText('');
                setStatusFilter('all');
                setPaymentFilter('all');
                setDateRange([]);
              }}
              style={{ width: '100%' }}
            >
              清除篩選
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 筆訂單`,
            pageSizeOptions: ['5', '10', '20', '50', '100'],
            onShowSizeChange: (current, size) => {
              setPageSize(size);
            }
          }}
          scroll={{ x: 1200 }}
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
              <Descriptions.Item label="付款方式">
                {getPaymentMethodLabel(selectedOrder.paymentMethod)}
              </Descriptions.Item>
              <Descriptions.Item label="訂單總額">
                <Text strong style={{ color: '#52c41a' }}>NT$ {selectedOrder.total.toLocaleString()}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="備註" span={2}>{selectedOrder.notes}</Descriptions.Item>
            </Descriptions>

            <Divider />

            {selectedOrder.shippingInfo && (
              <>
                <Descriptions title="出貨資訊" bordered column={2}>
                  <Descriptions.Item label="貨運公司">{selectedOrder.shippingInfo.carrier}</Descriptions.Item>
                  <Descriptions.Item label="追蹤編號">{selectedOrder.shippingInfo.trackingNumber}</Descriptions.Item>
                  <Descriptions.Item label="出貨時間">
                    {new Date(selectedOrder.shippingInfo.shippedDate).toLocaleString('zh-TW')}
                  </Descriptions.Item>
                  <Descriptions.Item label="預計送達">{selectedOrder.shippingInfo.estimatedDelivery}</Descriptions.Item>
                  {selectedOrder.shippingInfo.trackingUrl && (
                    <Descriptions.Item label="貨運追蹤" span={2}>
                      <a href={selectedOrder.shippingInfo.trackingUrl} target="_blank" rel="noopener noreferrer">
                        點擊追蹤包裹
                      </a>
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="出貨備註" span={2}>{selectedOrder.shippingInfo.notes}</Descriptions.Item>
                </Descriptions>
                <Divider />
              </>
            )}

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

      {/* Shipping Info Modal */}
      <Modal
        title={`出貨管理 - ${selectedOrder?.id}`}
        open={isShippingModalVisible}
        onCancel={() => setIsShippingModalVisible(false)}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setIsShippingModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submitNoNotify" 
            type="default"
            icon={<TruckOutlined />}
            onClick={() => {
              shippingForm.validateFields().then(values => {
                handleShippingWithoutNotification(values);
              }).catch(() => {
                message.error('請完整填寫出貨資訊');
              });
            }}
          >
            出貨（不寄送通知）
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            icon={<SendOutlined />}
            loading={emailSending}
            onClick={() => shippingForm.submit()}
          >
            出貨並發送通知
          </Button>
        ]}
      >
        <Form
          form={shippingForm}
          layout="vertical"
          onFinish={handleShippingSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="carrier"
                label="貨運公司"
                rules={[{ required: true, message: '請選擇貨運公司' }]}
              >
                <Select placeholder="請選擇貨運公司">
                  {shippingCarriers.map(carrier => (
                    <Select.Option key={carrier.value} value={carrier.value}>
                      {carrier.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="trackingNumber"
                label="追蹤編號"
                rules={[{ required: true, message: '請輸入追蹤編號' }]}
              >
                <Input placeholder="請輸入貨運追蹤編號" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="estimatedDelivery"
            label="預計送達日期"
          >
            <Input placeholder="例如：2025-01-15 或 1-3個工作天" />
          </Form.Item>

          <Form.Item
            name="notes"
            label="出貨備註"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="出貨相關備註（選填）"
            />
          </Form.Item>

          <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '6px', padding: '12px', marginTop: '16px' }}>
            <Text type="secondary">
              ℹ️ 更新出貨資訊後，系統會自動發送出貨通知郵件給客戶，並將訂單狀態更新為「已出貨」
            </Text>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderManagement;