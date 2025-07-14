import categoryService from './categoryService';
import couponService from './couponService';
import productService from './productService';
import { mockProducts } from '../data/mockData';

class InitializationService {
  // 初始化所有數據
  async initializeAll() {
    try {
      console.log('開始初始化Firebase數據...');
      
      // 檢查是否已經初始化
      const existingCategories = await categoryService.getAll();
      if (existingCategories.success && existingCategories.data.length > 0) {
        console.log('數據已經存在，跳過初始化');
        return { success: true, message: '數據已經存在' };
      }

      // 初始化分類
      await this.initializeCategories();
      
      // 初始化優惠券
      await this.initializeCoupons();
      
      // 初始化商品
      await this.initializeProducts();
      
      console.log('Firebase數據初始化完成');
      return { success: true, message: '初始化完成' };
    } catch (error) {
      console.error('初始化失敗:', error);
      return { success: false, error: error.message };
    }
  }

  // 初始化分類
  async initializeCategories() {
    await categoryService.initializeDefaultCategories();
    console.log('分類初始化完成');
  }

  // 初始化優惠券
  async initializeCoupons() {
    await couponService.initializeMockCoupons();
    console.log('優惠券初始化完成');
  }

  // 初始化商品
  async initializeProducts() {
    for (const product of mockProducts) {
      await productService.add(product);
    }
    console.log('商品初始化完成');
  }

  // 重置所有數據
  async resetAll() {
    try {
      console.log('開始重置Firebase數據...');
      
      // 刪除所有商品
      const products = await productService.getAll();
      if (products.success) {
        for (const product of products.data) {
          await productService.delete(product.id);
        }
      }
      
      // 刪除所有分類
      const categories = await categoryService.getAll();
      if (categories.success) {
        for (const category of categories.data) {
          await categoryService.delete(category.id);
        }
      }
      
      // 刪除所有優惠券
      const coupons = await couponService.getAll();
      if (coupons.success) {
        for (const coupon of coupons.data) {
          await couponService.delete(coupon.id);
        }
      }
      
      console.log('數據重置完成');
      return { success: true, message: '重置完成' };
    } catch (error) {
      console.error('重置失敗:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new InitializationService();