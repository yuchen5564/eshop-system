import categoryService from './categoryService';
import productService from './productService';
import couponService from './couponService';
import paymentService from './paymentService';
import { emailManagementService, emailTemplateService } from './emailManagementService';
import { logisticsService } from './logisticsService';
import { signUp } from './authService';
import { mockProducts } from '../data/mockData';

class SystemService {
  // 檢查系統是否已經初始化
  async checkSystemInitialized() {
    try {
      // 檢查是否有基礎數據
      const categoriesResult = await categoryService.getAll();
      const productsResult = await productService.getAll();
      const paymentResult = await paymentService.getAll();
      
      const hasCategories = categoriesResult.success && categoriesResult.data.length > 0;
      const hasProducts = productsResult.success && productsResult.data.length > 0;
      const hasPaymentMethods = paymentResult.success && paymentResult.data.length > 0;
      
      return {
        initialized: hasCategories && hasProducts && hasPaymentMethods,
        hasCategories,
        hasProducts,
        hasPaymentMethods
      };
    } catch (error) {
      console.error('檢查系統初始化狀態失敗:', error);
      return { 
        initialized: false, 
        hasCategories: false, 
        hasProducts: false,
        hasPaymentMethods: false 
      };
    }
  }

  // 初始化整個系統
  async initializeSystem(adminData) {
    try {
      const results = {
        admin: null,
        categories: null,
        products: null,
        coupons: null,
        paymentMethods: null,
        emailSettings: null,
        emailTemplates: null,
        logisticsSettings: null
      };

      // 1. 創建管理員帳戶
      console.log('正在創建管理員帳戶...');
      const adminResult = await signUp(adminData.email, adminData.password, adminData.displayName);
      results.admin = adminResult;
      
      if (!adminResult.success) {
        throw new Error(`創建管理員帳戶失敗: ${adminResult.error}`);
      }

      // 2. 初始化分類
      console.log('正在初始化商品分類...');
      results.categories = await this.initializeCategories();
      
      if (!results.categories.success) {
        throw new Error(`初始化分類失敗: ${results.categories.error}`);
      }

      // 3. 初始化商品
      console.log('正在初始化商品資料...');
      results.products = await this.initializeProducts();
      
      if (!results.products.success) {
        throw new Error(`初始化商品失敗: ${results.products.error}`);
      }

      // 4. 初始化優惠券
      console.log('正在初始化優惠券...');
      results.coupons = await this.initializeCoupons();
      
      if (!results.coupons.success) {
        throw new Error(`初始化優惠券失敗: ${results.coupons.error}`);
      }

      // 5. 初始化付款方式
      console.log('正在初始化付款方式...');
      results.paymentMethods = await this.initializePaymentMethods();
      
      if (!results.paymentMethods.success) {
        throw new Error(`初始化付款方式失敗: ${results.paymentMethods.error}`);
      }

      // 6. 初始化郵件設定
      console.log('正在初始化郵件設定...');
      results.emailSettings = await this.initializeEmailSettings();
      
      if (!results.emailSettings.success) {
        throw new Error(`初始化郵件設定失敗: ${results.emailSettings.error}`);
      }

      // 7. 初始化郵件模板
      console.log('正在初始化郵件模板...');
      results.emailTemplates = await this.initializeEmailTemplates();
      
      if (!results.emailTemplates.success) {
        throw new Error(`初始化郵件模板失敗: ${results.emailTemplates.error}`);
      }

      // 8. 初始化物流設定
      console.log('正在初始化物流設定...');
      results.logisticsSettings = await this.initializeLogisticsSettings();
      
      if (!results.logisticsSettings.success) {
        throw new Error(`初始化物流設定失敗: ${results.logisticsSettings.error}`);
      }

      console.log('系統初始化完成！');
      return {
        success: true,
        message: '系統初始化完成',
        results
      };
    } catch (error) {
      console.error('系統初始化失敗:', error);
      return {
        success: false,
        error: error.message,
        results: null
      };
    }
  }

  // 初始化分類
  async initializeCategories() {
    try {
      const defaultCategories = [
        {
          id: 'vegetable',
          name: '蔬菜類',
          description: '新鮮蔬菜，健康營養',
          color: '#52c41a',
          icon: '🥬',
          image: null,
          isActive: true,
          sortOrder: 1,
          parentId: null
        },
        {
          id: 'fruit',
          name: '水果類',
          description: '當季新鮮水果',
          color: '#fa8c16',
          icon: '🍎',
          image: null,
          isActive: true,
          sortOrder: 2,
          parentId: null
        },
        {
          id: 'grain',
          name: '穀物類',
          description: '優質穀物米糧',
          color: '#fadb14',
          icon: '🌾',
          image: null,
          isActive: true,
          sortOrder: 3,
          parentId: null
        },
        {
          id: 'meat',
          name: '肉類',
          description: '優質肉品',
          color: '#f5222d',
          icon: '🥩',
          image: null,
          isActive: true,
          sortOrder: 4,
          parentId: null
        },
        {
          id: 'dairy',
          name: '乳製品',
          description: '新鮮乳製品',
          color: '#722ed1',
          icon: '🥛',
          image: null,
          isActive: true,
          sortOrder: 5,
          parentId: null
        }
      ];

      let successCount = 0;
      for (const category of defaultCategories) {
        const result = await categoryService.add(category);
        if (result.success) {
          successCount++;
        }
      }

      return {
        success: successCount === defaultCategories.length,
        message: `成功創建 ${successCount}/${defaultCategories.length} 個分類`,
        count: successCount
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        count: 0
      };
    }
  }

  // 初始化商品
  async initializeProducts() {
    try {
      let successCount = 0;
      for (const product of mockProducts) {
        const result = await productService.add(product);
        if (result.success) {
          successCount++;
        }
      }

      return {
        success: successCount === mockProducts.length,
        message: `成功創建 ${successCount}/${mockProducts.length} 個商品`,
        count: successCount
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        count: 0
      };
    }
  }

  // 初始化優惠券
  async initializeCoupons() {
    try {
      const defaultCoupons = [
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
          usedCount: 0,
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
          usedCount: 0,
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
          usedCount: 0,
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

      let successCount = 0;
      for (const coupon of defaultCoupons) {
        const result = await couponService.add(coupon);
        if (result.success) {
          successCount++;
        }
      }

      return {
        success: successCount === defaultCoupons.length,
        message: `成功創建 ${successCount}/${defaultCoupons.length} 個優惠券`,
        count: successCount
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        count: 0
      };
    }
  }

  // 初始化付款方式
  async initializePaymentMethods() {
    try {
      return await paymentService.initializeDefaultPaymentMethods();
    } catch (error) {
      return {
        success: false,
        error: error.message,
        count: 0
      };
    }
  }

  // 初始化郵件設定
  async initializeEmailSettings() {
    try {
      return await emailManagementService.initializeDefaultEmailSettings();
    } catch (error) {
      return {
        success: false,
        error: error.message,
        count: 0
      };
    }
  }

  // 初始化郵件模板
  async initializeEmailTemplates() {
    try {
      return await emailTemplateService.initializeDefaultTemplates();
    } catch (error) {
      return {
        success: false,
        error: error.message,
        count: 0
      };
    }
  }

  // 初始化物流設定
  async initializeLogisticsSettings() {
    try {
      return await logisticsService.initializeDefaultLogisticsSettings();
    } catch (error) {
      return {
        success: false,
        error: error.message,
        count: 0
      };
    }
  }

  // 獲取系統狀態
  async getSystemStatus() {
    try {
      const initStatus = await this.checkSystemInitialized();
      const categoriesResult = await categoryService.getAll();
      const productsResult = await productService.getAll();
      const couponsResult = await couponService.getAll();
      const paymentResult = await paymentService.getAll();

      return {
        initialized: initStatus.initialized,
        categories: categoriesResult.success ? categoriesResult.data.length : 0,
        products: productsResult.success ? productsResult.data.length : 0,
        coupons: couponsResult.success ? couponsResult.data.length : 0,
        paymentMethods: paymentResult.success ? paymentResult.data.length : 0
      };
    } catch (error) {
      return {
        initialized: false,
        categories: 0,
        products: 0,
        coupons: 0,
        paymentMethods: 0,
        error: error.message
      };
    }
  }
}

export default new SystemService();