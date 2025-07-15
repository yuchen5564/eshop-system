import FirestoreService from './firestoreService';

class LogisticsService extends FirestoreService {
  constructor() {
    super('logistics_methods');
  }

  // 獲取所有物流方法
  async getLogisticsMethods() {
    return await this.getAll();
  }

  // 獲取啟用的物流方法
  async getActiveLogisticsMethods() {
    return await this.getWhere('isActive', '==', true);
  }

  // 根據ID獲取物流方法
  async getLogisticsMethodById(id) {
    return await this.getById(id);
  }

  // 新增物流方法
  async addLogisticsMethod(methodData) {
    console.log('Adding logistics method:', methodData);
    return await this.add(methodData);
  }

  // 使用自訂ID新增物流方法
  async addLogisticsMethodWithId(id, methodData) {
    return await this.addWithId(id, methodData);
  }

  // 更新物流方法
  async updateLogisticsMethod(id, methodData) {
    return await this.update(id, methodData);
  }

  // 刪除物流方法
  async deleteLogisticsMethod(id) {
    return await this.delete(id);
  }

  // 切換物流方法狀態
  async toggleLogisticsMethodStatus(id, isActive) {
    return await this.update(id, { isActive });
  }

  // 初始化預設物流方法
  async initializeDefaultLogisticsMethods() {
    const defaultMethods = [
      {
        id: 'standard',
        name: '標準配送',
        description: '3-5個工作天送達',
        type: 'standard',
        carrier: 'post_office',
        carrierName: '中華郵政',
        isActive: true,
        deliveryTime: '3-5個工作天',
        pricing: {
          type: 'weight_based',
          freeShippingThreshold: 1000,
          rules: [
            { maxWeight: 1, price: 60 },
            { maxWeight: 3, price: 80 },
            { maxWeight: 5, price: 100 },
            { maxWeight: 10, price: 120 }
          ]
        },
        availableAreas: ['全台灣'],
        restrictions: {
          maxWeight: 10,
          maxDimensions: { length: 60, width: 40, height: 40 },
          prohibited: ['液體', '易燃物品', '活體動物']
        },
        trackingUrl: 'https://trackings.post.gov.tw/?id={trackingNumber}',
        sortOrder: 1
      },
      {
        id: 'express',
        name: '快速配送',
        description: '1-2個工作天送達',
        type: 'express',
        carrier: 'fedex',
        carrierName: 'FedEx',
        isActive: true,
        deliveryTime: '1-2個工作天',
        pricing: {
          type: 'fixed',
          freeShippingThreshold: 2000,
          basePrice: 120,
          rules: []
        },
        availableAreas: ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市'],
        restrictions: {
          maxWeight: 15,
          maxDimensions: { length: 80, width: 50, height: 50 },
          prohibited: ['液體', '易燃物品', '活體動物']
        },
        trackingUrl: 'https://www.fedex.com/fedextrack/?tracknumbers={trackingNumber}',
        sortOrder: 2
      },
      {
        id: 'same_day',
        name: '當日配送',
        description: '當日送達（限特定地區）',
        type: 'same_day',
        carrier: 'uber_eats',
        carrierName: 'Uber Eats',
        isActive: false,
        deliveryTime: '3-6小時',
        pricing: {
          type: 'fixed',
          freeShippingThreshold: 5000,
          basePrice: 200,
          rules: []
        },
        availableAreas: ['台北市信義區', '台北市大安區', '台北市中正區'],
        restrictions: {
          maxWeight: 5,
          maxDimensions: { length: 40, width: 30, height: 30 },
          prohibited: ['液體', '易燃物品', '活體動物', '冷凍食品']
        },
        trackingUrl: 'https://www.ubereats.com/orders/{trackingNumber}',
        sortOrder: 3
      },
      {
        id: 'pickup',
        name: '門市取貨',
        description: '到指定門市取貨',
        type: 'pickup',
        carrier: 'self',
        carrierName: '自取',
        isActive: true,
        deliveryTime: '1-3個工作天',
        pricing: {
          type: 'fixed',
          freeShippingThreshold: 500,
          basePrice: 0,
          rules: []
        },
        availableAreas: ['台北市', '新北市', '桃園市'],
        restrictions: {
          maxWeight: 20,
          maxDimensions: { length: 100, width: 60, height: 60 },
          prohibited: ['易燃物品', '活體動物']
        },
        trackingUrl: '',
        sortOrder: 4
      }
    ];

    let successCount = 0;
    for (const method of defaultMethods) {
      const { id, ...methodData } = method;
      const result = await this.addWithId(id, methodData);
      if (result.success) {
        successCount++;
      }
    }

    return {
      success: successCount === defaultMethods.length,
      message: `成功創建 ${successCount}/${defaultMethods.length} 個物流方法`,
      count: successCount
    };
  }

  // 獲取貨運公司（從啟用的物流方法中提取）
  async getShippingCarriers() {
    try {
      // 只獲取啟用的物流方法
      const methods = await this.getActiveLogisticsMethods();
      //console.log('Active logistics methods result:', methods);
      
      if (!methods.success) {
        console.warn('Failed to get active logistics methods:', methods.error);
        return { success: true, data: [] };
      }
      
      if (!methods.data || methods.data.length === 0) {
        console.warn('No active logistics methods found in database');
        return { success: true, data: [] };
      }
      
      //console.log('Found active logistics methods:', methods.data.length);
      
      // 從啟用的物流方法中提取唯一的貨運公司
      const carriersMap = new Map();
      methods.data.forEach(method => {
        //console.log('Processing active method:', method.name, 'Carrier:', method.carrier, 'CarrierName:', method.carrierName, 'IsActive:', method.isActive);
        if (method.carrier && method.carrierName) {
          carriersMap.set(method.carrier, {
            value: method.carrier,
            label: method.carrierName,
            trackingUrlTemplate: method.trackingUrl || ''
          });
        }
      });
      
      const carriers = Array.from(carriersMap.values());
      //console.log('Extracted carriers from active methods:', carriers);
      
      return { success: true, data: carriers };
    } catch (error) {
      console.error('Error in getShippingCarriers:', error);
      return { success: false, error: error.message };
    }
  }

  // 新增貨運公司（實際上是為了向後兼容）
  async addShippingCarrier(carrierData) {
    // 由於新結構不需要單獨的貨運公司表，這個方法保留但不做任何事情
    return { success: true, message: '新結構下，貨運公司資訊將在物流方法中管理' };
  }

  // 更新貨運公司（實際上是為了向後兼容）
  async updateShippingCarrier(carrierId, carrierData) {
    // 由於新結構不需要單獨的貨運公司表，這個方法保留但不做任何事情
    return { success: true, message: '新結構下，貨運公司資訊將在物流方法中管理' };
  }

  // 刪除貨運公司（實際上是為了向後兼容）
  async deleteShippingCarrier(carrierId) {
    // 由於新結構不需要單獨的貨運公司表，這個方法保留但不做任何事情
    return { success: true, message: '新結構下，貨運公司資訊將在物流方法中管理' };
  }
}

// 物流追蹤服務
class ShippingTrackingService extends FirestoreService {
  constructor() {
    super('shipping_tracking');
  }

  // 創建追蹤記錄
  async createTrackingRecord(trackingData) {
    const record = {
      orderId: trackingData.orderId,
      trackingNumber: trackingData.trackingNumber,
      carrier: trackingData.carrier,
      shippingMethod: trackingData.shippingMethod,
      status: 'processing',
      estimatedDelivery: trackingData.estimatedDelivery,
      actualDelivery: null,
      events: [
        {
          timestamp: new Date(),
          status: 'processing',
          description: '訂單處理中',
          location: '倉庫'
        }
      ]
    };

    return await this.add(record);
  }

  // 更新追蹤狀態
  async updateTrackingStatus(trackingId, status, description, location) {
    try {
      const tracking = await this.getById(trackingId);
      if (!tracking.success) {
        return tracking;
      }

      const currentEvents = tracking.data.events || [];
      const newEvent = {
        timestamp: new Date(),
        status,
        description,
        location
      };

      const updatedData = {
        status,
        events: [...currentEvents, newEvent]
      };

      if (status === 'delivered') {
        updatedData.actualDelivery = new Date();
      }

      return await this.update(trackingId, updatedData);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根據訂單ID獲取追蹤記錄
  async getTrackingByOrderId(orderId) {
    return await this.getWhere('orderId', '==', orderId);
  }

  // 根據追蹤號碼獲取追蹤記錄
  async getTrackingByNumber(trackingNumber) {
    return await this.getWhere('trackingNumber', '==', trackingNumber);
  }
}

export const logisticsService = new LogisticsService();
export const shippingTrackingService = new ShippingTrackingService();
export default logisticsService;