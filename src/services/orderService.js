import FirestoreService from './firestoreService';

class OrderService extends FirestoreService {
  constructor() {
    super('orders');
  }

  // 根據用戶ID獲取訂單
  async getByUserId(userId) {
    return await this.getWhere('userId', '==', userId);
  }

  // 根據訂單狀態獲取訂單
  async getByStatus(status) {
    return await this.getWhere('status', '==', status);
  }

  // 更新訂單狀態
  async updateStatus(orderId, status) {
    return await this.update(orderId, { status });
  }

  // 獲取今日訂單
  async getTodayOrders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    try {
      const allOrders = await this.getAll();
      
      if (allOrders.success) {
        const todayOrders = allOrders.data.filter(order => {
          const orderDate = new Date(order.createdAt?.seconds * 1000);
          return orderDate >= today;
        });
        return { success: true, data: todayOrders };
      }
      
      return allOrders;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 獲取訂單統計
  async getOrderStats() {
    try {
      const allOrders = await this.getAll();
      
      if (!allOrders.success) {
        return allOrders;
      }
      
      const orders = allOrders.data;
      const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0)
      };
      
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根據訂單編號和電話號碼查詢訂單
  async trackOrder(orderNumber, phone) {
    try {
      const allOrders = await this.getAll();
      
      if (!allOrders.success) {
        return allOrders;
      }
      
      const order = allOrders.data.find(o => 
        o.id === orderNumber && o.customerPhone === phone
      );
      
      if (!order) {
        return { 
          success: false, 
          error: '找不到對應的訂單，請檢查訂單編號和電話號碼是否正確' 
        };
      }
      
      return { success: true, data: order };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new OrderService();