class CouponService {
  constructor() {
    this.coupons = new Map();
    this.usedCoupons = new Set();
    this.initializeMockCoupons();
  }

  initializeMockCoupons() {
    const mockCoupons = [
      {
        id: 'WELCOME100',
        code: 'WELCOME100',
        name: '新會員歡迎優惠',
        description: '首次購物享有 100 元折扣',
        type: 'fixed', // fixed, percentage
        value: 100,
        minimumAmount: 500,
        maximumDiscount: null,
        usageLimit: 100,
        usedCount: 25,
        validFrom: '2025-01-01T00:00:00Z',
        validTo: '2025-12-31T23:59:59Z',
        isActive: true,
        applicableCategories: [], // 空陣列表示適用所有分類
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
        value: 20, // 20% 折扣
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
      },
      {
        id: 'VIP15',
        code: 'VIP15',
        name: 'VIP 會員專享',
        description: '全館商品享有 85 折優惠',
        type: 'percentage',
        value: 15,
        minimumAmount: 300,
        maximumDiscount: 500,
        usageLimit: null, // 無限制
        usedCount: 156,
        validFrom: '2025-01-01T00:00:00Z',
        validTo: '2025-12-31T23:59:59Z',
        isActive: true,
        applicableCategories: [],
        excludedProducts: [],
        userRestrictions: {
          newUsersOnly: false,
          maxUsagePerUser: 10
        }
      },
      {
        id: 'EXPIRED10',
        code: 'EXPIRED10',
        name: '已過期測試優惠券',
        description: '測試用過期優惠券',
        type: 'fixed',
        value: 10,
        minimumAmount: 100,
        maximumDiscount: null,
        usageLimit: 100,
        usedCount: 15,
        validFrom: '2024-12-01T00:00:00Z',
        validTo: '2024-12-31T23:59:59Z',
        isActive: false,
        applicableCategories: [],
        excludedProducts: [],
        userRestrictions: {
          newUsersOnly: false,
          maxUsagePerUser: 1
        }
      }
    ];

    mockCoupons.forEach(coupon => {
      this.coupons.set(coupon.code, coupon);
    });

    this.usedCoupons.add('WELCOME100_user123');
    this.usedCoupons.add('FRUIT20_user456');
  }

  validateCoupon(code, cartItems = [], subtotal = 0, userId = 'guest') {
    const coupon = this.coupons.get(code.toUpperCase());
    
    if (!coupon) {
      return {
        valid: false,
        error: '優惠券代碼不存在',
        coupon: null
      };
    }

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

    const userUsageCount = Array.from(this.usedCoupons).filter(key => 
      key.startsWith(`${code.toUpperCase()}_${userId}`)
    ).length;

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
  }

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

  applyCoupon(code, cartItems = [], subtotal = 0, userId = 'guest') {
    const validation = this.validateCoupon(code, cartItems, subtotal, userId);
    
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

  useCoupon(code, userId = 'guest', orderId = null) {
    const coupon = this.coupons.get(code.toUpperCase());
    if (!coupon) return false;

    const userCouponKey = `${code.toUpperCase()}_${userId}_${orderId || Date.now()}`;
    this.usedCoupons.add(userCouponKey);
    
    coupon.usedCount += 1;
    
    return true;
  }

  getAllCoupons() {
    return Array.from(this.coupons.values());
  }

  getCouponByCode(code) {
    return this.coupons.get(code.toUpperCase());
  }

  createCoupon(couponData) {
    const newCoupon = {
      id: couponData.code,
      ...couponData,
      usedCount: 0,
      code: couponData.code.toUpperCase()
    };
    
    this.coupons.set(newCoupon.code, newCoupon);
    return newCoupon;
  }

  updateCoupon(code, updates) {
    const coupon = this.coupons.get(code.toUpperCase());
    if (!coupon) return null;

    const updatedCoupon = { ...coupon, ...updates };
    this.coupons.set(code.toUpperCase(), updatedCoupon);
    return updatedCoupon;
  }

  deleteCoupon(code) {
    return this.coupons.delete(code.toUpperCase());
  }

  getAvailableCoupons(isNewUser = false) {
    const now = new Date();
    return Array.from(this.coupons.values()).filter(coupon => {
      if (!coupon.isActive) return false;
      if (new Date(coupon.validTo) < now) return false;
      if (new Date(coupon.validFrom) > now) return false;
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return false;
      if (coupon.userRestrictions.newUsersOnly && !isNewUser) return false;
      
      return true;
    });
  }

  getCouponStats() {
    const allCoupons = this.getAllCoupons();
    const activeCoupons = allCoupons.filter(c => c.isActive);
    const expiredCoupons = allCoupons.filter(c => new Date(c.validTo) < new Date());
    const totalUsage = allCoupons.reduce((sum, c) => sum + c.usedCount, 0);

    return {
      total: allCoupons.length,
      active: activeCoupons.length,
      expired: expiredCoupons.length,
      totalUsage: totalUsage
    };
  }
}

export const couponService = new CouponService();
export default couponService;