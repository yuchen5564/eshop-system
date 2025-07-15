import FirestoreService from './firestoreService';

class PaymentService extends FirestoreService {
  constructor() {
    super('payment_methods');
  }

  // 獲取啟用的付款方式
  async getActivePaymentMethods() {
    return await this.getWhere('enabled', '==', true);
  }

  // 切換付款方式狀態
  async togglePaymentMethodStatus(id, enabled) {
    return await this.update(id, { enabled });
  }

  // 更新付款方式設定
  async updatePaymentMethodSettings(id, settings) {
    return await this.update(id, { settings });
  }

  // 獲取付款方式統計
  async getPaymentMethodStats() {
    try {
      const allMethods = await this.getAll();
      
      if (!allMethods.success) {
        return allMethods;
      }
      
      const methods = allMethods.data;
      const stats = {
        total: methods.length,
        active: methods.filter(m => m.enabled).length,
        inactive: methods.filter(m => !m.enabled).length
      };
      
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 初始化默認付款方式
  async initializeDefaultPaymentMethods() {
    const defaultMethods = [
      {
        id: 'credit_card',
        name: '信用卡付款',
        description: '支援 Visa、MasterCard、JCB 等信用卡',
        type: 'online',
        icon: '💳',
        enabled: true,
        sortOrder: 1,
        settings: {
          supportedCards: ['visa', 'mastercard', 'jcb'],
          requireCVV: true,
          require3DS: false,
          minimumAmount: 1,
          maximumAmount: 100000,
          processingFee: 0.03,
          processingTime: '即時'
        },
        provider: {
          name: 'stripe',
          apiKey: '',
          webhookSecret: ''
        }
      },
      {
        id: 'bank_transfer',
        name: '銀行轉帳',
        description: 'ATM轉帳或網路銀行轉帳',
        type: 'offline',
        icon: '🏦',
        enabled: true,
        sortOrder: 2,
        settings: {
          bankName: '台灣銀行',
          bankCode: '004',
          accountNumber: '12345678901',
          accountName: '農鮮市集有限公司',
          transferDeadline: 3, // 天數
          minimumAmount: 100,
          maximumAmount: 500000,
          processingFee: 0,
          processingTime: '1-3個工作天'
        },
        provider: null
      },
      {
        id: 'cash_on_delivery',
        name: '貨到付款',
        description: '商品送達時以現金付款',
        type: 'cod',
        icon: '💰',
        enabled: true,
        sortOrder: 3,
        settings: {
          extraFee: 30,
          minimumAmount: 500,
          maximumAmount: 10000,
          availableAreas: ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市'],
          processingTime: '配送時付款'
        },
        provider: null
      },
      {
        id: 'line_pay',
        name: 'LINE Pay',
        description: '使用LINE Pay快速付款',
        type: 'online',
        icon: '💬',
        enabled: false,
        sortOrder: 4,
        settings: {
          minimumAmount: 1,
          maximumAmount: 50000,
          processingFee: 0.025,
          processingTime: '即時'
        },
        provider: {
          name: 'line_pay',
          channelId: '',
          channelSecret: ''
        }
      },
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        description: '使用Apple Pay安全付款',
        type: 'online',
        icon: '🍎',
        enabled: false,
        sortOrder: 5,
        settings: {
          minimumAmount: 1,
          maximumAmount: 50000,
          processingFee: 0.029,
          processingTime: '即時'
        },
        provider: {
          name: 'apple_pay',
          merchantId: ''
        }
      }
    ];

    let successCount = 0;
    for (const method of defaultMethods) {
      // 使用自訂ID創建付款方式
      const { id, ...methodData } = method;
      const result = await this.addWithId(id, methodData);
      if (result.success) {
        successCount++;
      }
    }

    return {
      success: successCount === defaultMethods.length,
      message: `成功創建 ${successCount}/${defaultMethods.length} 個付款方式`,
      count: successCount
    };
  }

  // 驗證付款方式設定
  validatePaymentMethod(methodData) {
    const errors = [];
    
    if (!methodData.name) {
      errors.push('付款方式名稱不能為空');
    }
    
    if (!methodData.type) {
      errors.push('付款方式類型不能為空');
    }
    
    if (!methodData.settings) {
      errors.push('付款方式設定不能為空');
    }
    
    if (methodData.type === 'online' && !methodData.provider) {
      errors.push('線上付款方式需要提供商設定');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new PaymentService();