// Mock data for admin dashboard
export const mockOrders = [
  {
    id: 'ORD001',
    customerName: '張三',
    customerEmail: 'zhang@example.com',
    customerPhone: '0912-345-678',
    orderDate: '2025-01-10T10:30:00Z',
    status: 'pending',
    total: 520,
    items: [
      { id: 1, name: '有機番茄', quantity: 2, price: 150, image: '🍅' },
      { id: 5, name: '愛文芒果', quantity: 1, price: 280, image: '🥭' }
    ],
    shippingAddress: '台北市中正區忠孝東路一段1號',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    notes: '請於下午配送',
    shippingInfo: null,
    emailNotifications: {
      orderConfirmation: { sent: true, sentAt: '2025-01-10T10:35:00Z', status: 'delivered' }
    }
  },
  {
    id: 'ORD002',
    customerName: '李四',
    customerEmail: 'li@example.com',
    customerPhone: '0923-456-789',
    orderDate: '2025-01-10T14:15:00Z',
    status: 'processing',
    total: 360,
    items: [
      { id: 2, name: '高山高麗菜', quantity: 3, price: 80, image: '🥬' },
      { id: 3, name: '有機胡蘿蔔', quantity: 1, price: 120, image: '🥕' }
    ],
    shippingAddress: '新北市板橋區文化路二段123號',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'pending',
    notes: '',
    shippingInfo: null,
    emailNotifications: {
      orderConfirmation: { sent: false, sentAt: null, status: 'pending' }
    }
  },
  {
    id: 'ORD003',
    customerName: '王五',
    customerEmail: 'wang@example.com',
    customerPhone: '0934-567-890',
    orderDate: '2025-01-09T16:45:00Z',
    status: 'shipped',
    total: 800,
    items: [
      { id: 7, name: '溫室草莓', quantity: 2, price: 350, image: '🍓' },
      { id: 4, name: '新鮮玉米', quantity: 1, price: 100, image: '🌽' }
    ],
    shippingAddress: '台中市西屯區台灣大道三段99號',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    notes: '包裝請小心',
    shippingInfo: {
      carrier: '黑貓宅急便',
      trackingNumber: 'TC123456789TW',
      shippedDate: '2025-01-11T09:00:00Z',
      estimatedDelivery: '2025-01-12',
      trackingUrl: 'https://www.t-cat.com.tw/inquire/trace.aspx?no=TC123456789TW',
      notes: '請準時收貨'
    },
    emailNotifications: {
      orderConfirmation: { sent: true, sentAt: '2025-01-09T16:50:00Z', status: 'delivered' },
      shippingNotification: { sent: true, sentAt: '2025-01-11T09:05:00Z', status: 'delivered' }
    }
  },
  {
    id: 'ORD004',
    customerName: '陳六',
    customerEmail: 'chen@example.com',
    customerPhone: '0945-678-901',
    orderDate: '2025-01-09T09:20:00Z',
    status: 'delivered',
    total: 640,
    items: [
      { id: 8, name: '池上米', quantity: 1, price: 450, image: '🌾' },
      { id: 6, name: '有機香蕉', quantity: 2, price: 90, image: '🍌' }
    ],
    shippingAddress: '高雄市前金區中正四路100號',
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'paid',
    notes: '已完成配送',
    shippingInfo: {
      carrier: '新竹物流',
      trackingNumber: 'HC987654321TW',
      shippedDate: '2025-01-10T14:00:00Z',
      deliveredDate: '2025-01-11T16:30:00Z',
      estimatedDelivery: '2025-01-11',
      trackingUrl: 'https://www.hct.com.tw/business/service/query_cargo',
      notes: '已送達並簽收'
    },
    emailNotifications: {
      orderConfirmation: { sent: true, sentAt: '2025-01-09T09:25:00Z', status: 'delivered' },
      shippingNotification: { sent: true, sentAt: '2025-01-10T14:05:00Z', status: 'delivered' }
    }
  }
];

export const mockPaymentMethods = [
  {
    id: 'credit_card',
    name: '信用卡',
    type: 'online',
    enabled: true,
    config: {
      supportedCards: ['VISA', 'MasterCard', 'JCB'],
      merchantId: 'FARM001',
      apiKey: '****-****-****-1234'
    },
    fees: {
      fixed: 0,
      percentage: 2.8
    },
    description: '支援VISA、MasterCard、JCB信用卡付款'
  },
  {
    id: 'bank_transfer',
    name: '銀行轉帳',
    type: 'offline',
    enabled: true,
    config: {
      bankName: '台灣銀行',
      accountNumber: '123-456-789012',
      accountName: '農鮮市集有限公司'
    },
    fees: {
      fixed: 15,
      percentage: 0
    },
    description: '請於訂單成立後3天內完成轉帳'
  },
  {
    id: 'cash_on_delivery',
    name: '貨到付款',
    type: 'cash',
    enabled: true,
    config: {
      availableAreas: ['台北市', '新北市', '台中市', '高雄市']
    },
    fees: {
      fixed: 50,
      percentage: 0
    },
    description: '限特定地區，收貨時以現金付款'
  },
  {
    id: 'line_pay',
    name: 'LINE Pay',
    type: 'online',
    enabled: false,
    config: {
      channelId: 'LINE_****1234',
      channelSecret: '****-****-****-5678'
    },
    fees: {
      fixed: 0,
      percentage: 2.5
    },
    description: '使用LINE Pay行動支付'
  }
];

export const orderStatusOptions = [
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

export const productCategories = [
  { value: 'vegetable', label: '蔬菜類' },
  { value: 'fruit', label: '水果類' },
  { value: 'grain', label: '穀物類' }
];

export const shippingCarriers = [
  { value: '黑貓宅急便', label: '黑貓宅急便', trackingUrlTemplate: 'https://www.t-cat.com.tw/inquire/trace.aspx?no={}' },
  { value: '新竹物流', label: '新竹物流', trackingUrlTemplate: 'https://www.hct.com.tw/business/service/query_cargo?no={}' },
  { value: '統一速達', label: '統一速達 (7-ELEVEN)', trackingUrlTemplate: 'https://www.pcse.com.tw/service05/service05_1.aspx?no={}' },
  { value: '全家便利商店', label: '全家便利商店', trackingUrlTemplate: 'https://www.famiport.com.tw/service/ShipQuery.aspx?no={}' },
  { value: '中華郵政', label: '中華郵政', trackingUrlTemplate: 'https://postserv.post.gov.tw/pstmail/main_mail.html?no={}' },
  { value: '嘉里大榮', label: '嘉里大榮', trackingUrlTemplate: 'https://www.kerryexpress.com.tw/track/?no={}' }
];

export const dashboardStats = {
  totalOrders: 156,
  totalRevenue: 128450,
  pendingOrders: 23,
  lowStockProducts: 8,
  monthlyOrdersGrowth: 12.5,
  monthlyRevenueGrowth: 18.3
};

export const mockEmailLogs = [
  {
    id: 'EMAIL001',
    type: 'order_confirmation',
    recipient: 'zhang@example.com',
    recipientName: '張三',
    subject: '訂單確認 - ORD001',
    orderId: 'ORD001',
    sentAt: '2025-01-10T10:35:00Z',
    status: 'delivered',
    deliveredAt: '2025-01-10T10:35:15Z',
    errorMessage: null
  },
  {
    id: 'EMAIL002',
    type: 'order_confirmation',
    recipient: 'li@example.com',
    recipientName: '李四',
    subject: '訂單確認 - ORD002',
    orderId: 'ORD002',
    sentAt: '2025-01-10T14:20:00Z',
    status: 'failed',
    deliveredAt: null,
    errorMessage: '收件人信箱不存在'
  },
  {
    id: 'EMAIL003',
    type: 'order_confirmation',
    recipient: 'wang@example.com',
    recipientName: '王五',
    subject: '訂單確認 - ORD003',
    orderId: 'ORD003',
    sentAt: '2025-01-09T16:50:00Z',
    status: 'delivered',
    deliveredAt: '2025-01-09T16:50:08Z',
    errorMessage: null
  },
  {
    id: 'EMAIL004',
    type: 'shipping_notification',
    recipient: 'wang@example.com',
    recipientName: '王五',
    subject: '出貨通知 - ORD003',
    orderId: 'ORD003',
    sentAt: '2025-01-11T09:05:00Z',
    status: 'delivered',
    deliveredAt: '2025-01-11T09:05:12Z',
    errorMessage: null
  },
  {
    id: 'EMAIL005',
    type: 'order_confirmation',
    recipient: 'chen@example.com',
    recipientName: '陳六',
    subject: '訂單確認 - ORD004',
    orderId: 'ORD004',
    sentAt: '2025-01-09T09:25:00Z',
    status: 'delivered',
    deliveredAt: '2025-01-09T09:25:18Z',
    errorMessage: null
  },
  {
    id: 'EMAIL006',
    type: 'shipping_notification',
    recipient: 'chen@example.com',
    recipientName: '陳六',
    subject: '出貨通知 - ORD004',
    orderId: 'ORD004',
    sentAt: '2025-01-10T14:05:00Z',
    status: 'delivered',
    deliveredAt: '2025-01-10T14:05:22Z',
    errorMessage: null
  }
];