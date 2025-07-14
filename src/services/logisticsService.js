import FirestoreService from './firestoreService';

class LogisticsService extends FirestoreService {
  constructor() {
    super('logistics_settings');
  }

  // 獲取物流設定
  async getLogisticsSettings() {
    try {
      const settings = await this.getAll();
      if (settings.success && settings.data.length > 0) {
        return { success: true, data: settings.data[0] };
      }
      return { success: false, error: '物流設定不存在' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 更新物流設定
  async updateLogisticsSettings(settingsData) {
    try {
      const existing = await this.getAll();
      if (existing.success && existing.data.length > 0) {
        return await this.update(existing.data[0].id, settingsData);
      } else {
        return await this.add(settingsData);
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 初始化預設物流設定
  async initializeDefaultLogisticsSettings() {
    const defaultSettings = {
      id: 'default_logistics_settings',
      generalSettings: {
        defaultShippingMethod: 'standard',
        processingTime: '1-2個工作天',
        cutoffTime: '14:00',
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        holidays: [],
        autoProcessing: false
      },
      shippingMethods: [
        {
          id: 'standard',
          name: '標準配送',
          description: '3-5個工作天送達',
          type: 'standard',
          carrier: 'post_office',
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
          }
        },
        {
          id: 'express',
          name: '快速配送',
          description: '1-2個工作天送達',
          type: 'express',
          carrier: 'fedex',
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
          }
        },
        {
          id: 'same_day',
          name: '當日配送',
          description: '當日送達（限特定地區）',
          type: 'same_day',
          carrier: 'uber_eats',
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
          }
        },
        {
          id: 'pickup',
          name: '門市取貨',
          description: '到指定門市取貨',
          type: 'pickup',
          carrier: 'self',
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
          }
        }
      ],
      carriers: [
        {
          id: 'post_office',
          name: '中華郵政',
          type: 'standard',
          apiEndpoint: 'https://api.post.gov.tw',
          apiKey: '',
          isActive: true,
          trackingUrl: 'https://trackings.post.gov.tw/?id={trackingNumber}',
          supportedServices: ['standard', 'express', 'registered']
        },
        {
          id: 'fedex',
          name: 'FedEx',
          type: 'express',
          apiEndpoint: 'https://api.fedex.com',
          apiKey: '',
          isActive: true,
          trackingUrl: 'https://www.fedex.com/fedextrack/?tracknumbers={trackingNumber}',
          supportedServices: ['express', 'overnight']
        },
        {
          id: 'uber_eats',
          name: 'Uber Eats',
          type: 'same_day',
          apiEndpoint: 'https://api.uber.com',
          apiKey: '',
          isActive: false,
          trackingUrl: 'https://www.ubereats.com/orders/{trackingNumber}',
          supportedServices: ['same_day']
        }
      ],
      pickupLocations: [
        {
          id: 'store_001',
          name: '農鮮市集台北店',
          address: '台北市信義區信義路四段101號',
          phone: '02-1234-5678',
          workingHours: {
            monday: '09:00-21:00',
            tuesday: '09:00-21:00',
            wednesday: '09:00-21:00',
            thursday: '09:00-21:00',
            friday: '09:00-21:00',
            saturday: '09:00-18:00',
            sunday: '10:00-18:00'
          },
          isActive: true
        },
        {
          id: 'store_002',
          name: '農鮮市集新北店',
          address: '新北市板橋區中山路一段200號',
          phone: '02-2345-6789',
          workingHours: {
            monday: '09:00-21:00',
            tuesday: '09:00-21:00',
            wednesday: '09:00-21:00',
            thursday: '09:00-21:00',
            friday: '09:00-21:00',
            saturday: '09:00-18:00',
            sunday: '10:00-18:00'
          },
          isActive: true
        }
      ],
      deliveryAreas: [
        {
          id: 'taipei_city',
          name: '台北市',
          type: 'city',
          isActive: true,
          supportedMethods: ['standard', 'express', 'same_day', 'pickup'],
          additionalFee: 0,
          deliveryTime: {
            standard: '2-3個工作天',
            express: '1個工作天',
            same_day: '3-6小時'
          }
        },
        {
          id: 'new_taipei_city',
          name: '新北市',
          type: 'city',
          isActive: true,
          supportedMethods: ['standard', 'express', 'pickup'],
          additionalFee: 0,
          deliveryTime: {
            standard: '2-3個工作天',
            express: '1-2個工作天'
          }
        },
        {
          id: 'remote_areas',
          name: '偏遠地區',
          type: 'remote',
          isActive: true,
          supportedMethods: ['standard'],
          additionalFee: 50,
          deliveryTime: {
            standard: '5-7個工作天'
          }
        }
      ],
      isActive: true
    };

    const result = await this.add(defaultSettings);
    return {
      success: result.success,
      message: result.success ? '物流設定初始化成功' : '物流設定初始化失敗',
      data: result.success ? defaultSettings : null
    };
  }

  // 獲取貨運公司
  async getShippingCarriers() {
    try {
      const settings = await this.getLogisticsSettings();
      if (settings.success && settings.data.carriers) {
        return { success: true, data: settings.data.carriers };
      }
      return { success: true, data: [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 新增貨運公司
  async addShippingCarrier(carrierData) {
    try {
      const settings = await this.getLogisticsSettings();
      if (settings.success) {
        const carriers = settings.data.carriers || [];
        const newCarrier = {
          ...carrierData,
          id: carrierData.value,
          isActive: true
        };
        carriers.push(newCarrier);
        
        return await this.updateLogisticsSettings({
          ...settings.data,
          carriers
        });
      }
      return { success: false, error: '無法載入物流設定' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 更新貨運公司
  async updateShippingCarrier(carrierId, carrierData) {
    try {
      const settings = await this.getLogisticsSettings();
      if (settings.success) {
        const carriers = settings.data.carriers || [];
        const index = carriers.findIndex(c => c.id === carrierId || c.value === carrierId);
        
        if (index !== -1) {
          carriers[index] = { ...carriers[index], ...carrierData };
          
          return await this.updateLogisticsSettings({
            ...settings.data,
            carriers
          });
        }
        return { success: false, error: '找不到指定的貨運公司' };
      }
      return { success: false, error: '無法載入物流設定' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 刪除貨運公司
  async deleteShippingCarrier(carrierId) {
    try {
      const settings = await this.getLogisticsSettings();
      if (settings.success) {
        const carriers = settings.data.carriers || [];
        const filteredCarriers = carriers.filter(c => c.id !== carrierId && c.value !== carrierId);
        
        return await this.updateLogisticsSettings({
          ...settings.data,
          carriers: filteredCarriers
        });
      }
      return { success: false, error: '無法載入物流設定' };
    } catch (error) {
      return { success: false, error: error.message };
    }
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