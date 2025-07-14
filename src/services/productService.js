import FirestoreService from './firestoreService';

class ProductService extends FirestoreService {
  constructor() {
    super('products');
  }

  // 根據分類獲取產品
  async getByCategory(categoryId) {
    return await this.getWhere('categoryId', '==', categoryId);
  }

  // 根據狀態獲取產品
  async getByStatus(status) {
    return await this.getWhere('status', '==', status);
  }

  // 搜索產品
  async searchProducts(searchTerm) {
    try {
      // 由於Firestore不支持全文搜索，這裡使用簡單的名稱匹配
      const allProducts = await this.getAll();
      
      if (allProducts.success) {
        const filteredProducts = allProducts.data.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return { success: true, data: filteredProducts };
      }
      
      return allProducts;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 更新產品庫存
  async updateStock(productId, quantity) {
    try {
      const productResult = await this.getById(productId);
      
      if (!productResult.success) {
        return productResult;
      }
      
      const currentStock = productResult.data.stock || 0;
      const newStock = currentStock + quantity;
      
      return await this.update(productId, { stock: newStock });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 獲取熱門產品
  async getPopularProducts(limitCount = 10) {
    return await this.getAll('viewCount', 'desc', limitCount);
  }

  // 獲取低庫存產品
  async getLowStockProducts(threshold = 10) {
    return await this.getWhere('stock', '<', threshold);
  }
}

export default new ProductService();