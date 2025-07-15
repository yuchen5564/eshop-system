import FirestoreService from './firestoreService';

class CouponService extends FirestoreService {
  constructor() {
    super('coupons');
  }

  // 根據代碼獲取優惠券
  async getCouponByCode(code) {
    return await this.getWhere('code', '==', code.toUpperCase());
  }

  // 獲取啟用的優惠券
  async getActiveCoupons() {
    return await this.getWhere('isActive', '==', true);
  }

  // 獲取可用優惠券
  async getAvailableCoupons(isNewUser = false) {
    try {
      const activeCoupons = await this.getActiveCoupons();
      
      if (!activeCoupons.success) {
        return activeCoupons;
      }
      
      const now = new Date();
      const availableCoupons = activeCoupons.data.filter(coupon => {
        if (new Date(coupon.validTo) < now) return false;
        if (new Date(coupon.validFrom) > now) return false;
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return false;
        if (coupon.userRestrictions.newUsersOnly && !isNewUser) return false;
        
        return true;
      });
      
      return { success: true, data: availableCoupons };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 驗證優惠券
  async validateCoupon(code, cartItems = [], subtotal = 0, userId = 'guest') {
    try {
      const couponResult = await this.getCouponByCode(code);
      
      if (!couponResult.success || couponResult.data.length === 0) {
        return {
          valid: false,
          error: '優惠券代碼不存在',
          coupon: null
        };
      }
      
      const coupon = couponResult.data[0];

      if (!coupon.isActive) {
        return {
          valid: false,
          error: '此優惠券已停用',
          coupon: null
        };
      }

      const now = new Date();
      const validFrom = new Date(coupon.validFrom);
      const validTo = new Date(coupon.validTo);

      if (now < validFrom) {
        return {
          valid: false,
          error: '優惠券尚未生效',
          coupon: null
        };
      }

      if (now > validTo) {
        return {
          valid: false,
          error: '優惠券已過期',
          coupon: null
        };
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return {
          valid: false,
          error: '優惠券使用次數已達上限',
          coupon: null
        };
      }

      // 檢查用戶使用次數
      const userUsageCount = await this.getUserCouponUsageCount(code, userId);
      
      if (coupon.userRestrictions.maxUsagePerUser && userUsageCount >= coupon.userRestrictions.maxUsagePerUser) {
        return {
          valid: false,
          error: '您已達到此優惠券的使用次數上限',
          coupon: null
        };
      }

      if (subtotal < coupon.minimumAmount) {
        return {
          valid: false,
          error: `訂單金額需滿 NT$ ${coupon.minimumAmount} 才能使用此優惠券`,
          coupon: null
        };
      }

      if (coupon.applicableCategories.length > 0) {
        const hasApplicableItems = cartItems.some(item => 
          coupon.applicableCategories.includes(item.category)
        );
        if (!hasApplicableItems) {
          return {
            valid: false,
            error: '購物車中沒有適用此優惠券的商品',
            coupon: null
          };
        }
      }

      if (coupon.excludedProducts.length > 0) {
        const hasExcludedItems = cartItems.some(item =>
          coupon.excludedProducts.includes(item.id)
        );
        if (hasExcludedItems) {
          return {
            valid: false,
            error: '購物車中包含不適用此優惠券的商品',
            coupon: null
          };
        }
      }

      return {
        valid: true,
        error: null,
        coupon: coupon
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        coupon: null
      };
    }
  }

  // 計算折扣
  calculateDiscount(coupon, cartItems = [], subtotal = 0) {
    if (!coupon) return 0;

    let applicableAmount = subtotal;

    if (coupon.applicableCategories.length > 0) {
      applicableAmount = cartItems
        .filter(item => coupon.applicableCategories.includes(item.category))
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    let discount = 0;

    if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, applicableAmount);
    } else if (coupon.type === 'percentage') {
      discount = applicableAmount * (coupon.value / 100);
      if (coupon.maximumDiscount) {
        discount = Math.min(discount, coupon.maximumDiscount);
      }
    }

    return Math.floor(discount);
  }

  // 應用優惠券
  async applyCoupon(code, cartItems = [], subtotal = 0, userId = 'guest') {
    const validation = await this.validateCoupon(code, cartItems, subtotal, userId);
    
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        discount: 0,
        coupon: null
      };
    }

    const discount = this.calculateDiscount(validation.coupon, cartItems, subtotal);

    return {
      success: true,
      error: null,
      discount: discount,
      coupon: validation.coupon,
      finalAmount: subtotal - discount
    };
  }

  // 使用優惠券
  async useCoupon(code, userId = 'guest', orderId = null) {
    try {
      const couponResult = await this.getCouponByCode(code);
      
      if (!couponResult.success || couponResult.data.length === 0) {
        return { success: false, error: '優惠券不存在' };
      }
      
      const coupon = couponResult.data[0];
      const newUsedCount = (coupon.usedCount || 0) + 1;
      
      // 記錄使用情況
      await this.recordCouponUsage(code, userId, orderId);
      
      // 更新使用次數
      const updateResult = await this.update(coupon.id, {
        usedCount: newUsedCount,
        lastUsedAt: new Date().toISOString(),
        lastUsedBy: userId,
        lastOrderId: orderId
      });
      
      return updateResult;
    } catch (error) {
      console.error('Use coupon error:', error);
      return { success: false, error: error.message };
    }
  }

  // 記錄優惠券使用情況
  async recordCouponUsage(code, userId, orderId) {
    const usageService = new FirestoreService('coupon_usage');
    
    return await usageService.add({
      couponCode: code,
      userId: userId,
      orderId: orderId,
      usedAt: new Date()
    });
  }

  // 獲取用戶優惠券使用次數
  async getUserCouponUsageCount(code, userId) {
    try {
      const usageService = new FirestoreService('coupon_usage');
      const usageResult = await usageService.getWhere('couponCode', '==', code);
      
      if (!usageResult.success) {
        return 0;
      }
      
      return usageResult.data.filter(usage => usage.userId === userId).length;
    } catch (error) {
      return 0;
    }
  }

  // 獲取優惠券統計
  async getCouponStats() {
    try {
      const allCoupons = await this.getAll();
      
      if (!allCoupons.success) {
        return allCoupons;
      }
      
      const coupons = allCoupons.data;
      const activeCoupons = coupons.filter(c => c.isActive);
      const expiredCoupons = coupons.filter(c => new Date(c.validTo) < new Date());
      const totalUsage = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

      const stats = {
        total: coupons.length,
        active: activeCoupons.length,
        expired: expiredCoupons.length,
        totalUsage: totalUsage
      };
      
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 初始化模擬優惠券
  async initializeMockCoupons() {
    const mockCoupons = [
      {
        id: 'WELCOME100',
        code: 'WELCOME100',
        name: '新會員歡迎優惠',
        description: '首次購物享有 100 元折扣',
        type: 'fixed',
        value: 100,
        minimumAmount: 500,
        maximumDiscount: null,
        usageLimit: 100,
        usedCount: 25,
        validFrom: '2025-01-01T00:00:00Z',
        validTo: '2025-12-31T23:59:59Z',
        isActive: true,
        applicableCategories: [],
        excludedProducts: [],
        userRestrictions: {
          newUsersOnly: true,
          maxUsagePerUser: 1
        }
      },
      {
        id: 'FRUIT20',
        code: 'FRUIT20',
        name: '水果類 8 折優惠',
        description: '水果商品享有 8 折優惠',
        type: 'percentage',
        value: 20,
        minimumAmount: 200,
        maximumDiscount: 300,
        usageLimit: 50,
        usedCount: 12,
        validFrom: '2025-01-10T00:00:00Z',
        validTo: '2025-01-31T23:59:59Z',
        isActive: true,
        applicableCategories: ['fruit'],
        excludedProducts: [],
        userRestrictions: {
          newUsersOnly: false,
          maxUsagePerUser: 2
        }
      },
      {
        id: 'SPRING2025',
        code: 'SPRING2025',
        name: '春季限定優惠',
        description: '全館商品滿 1000 元折 150 元',
        type: 'fixed',
        value: 150,
        minimumAmount: 1000,
        maximumDiscount: null,
        usageLimit: 200,
        usedCount: 88,
        validFrom: '2025-03-01T00:00:00Z',
        validTo: '2025-05-31T23:59:59Z',
        isActive: true,
        applicableCategories: [],
        excludedProducts: [],
        userRestrictions: {
          newUsersOnly: false,
          maxUsagePerUser: 1
        }
      }
    ];

    for (const coupon of mockCoupons) {
      // 使用自訂ID創建優惠券
      const { id, ...couponData } = coupon;
      await this.addWithId(id, couponData);
    }
  }
}

export const couponService = new CouponService();
export default couponService;