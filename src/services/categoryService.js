import FirestoreService from './firestoreService';

class CategoryService extends FirestoreService {
  constructor() {
    super('categories');
  }

  // 獲取啟用的分類
  async getActiveCategories() {
    return await this.getWhere('isActive', '==', true);
  }

  // 獲取父分類
  async getParentCategories() {
    return await this.getWhere('parentId', '==', null);
  }

  // 獲取子分類
  async getChildCategories(parentId) {
    return await this.getWhere('parentId', '==', parentId);
  }

  // 獲取分類樹
  async getCategoryTree() {
    try {
      const allCategories = await this.getAll('sortOrder', 'asc');
      
      if (!allCategories.success) {
        return allCategories;
      }
      
      const categories = allCategories.data;
      const tree = [];
      
      // 建立父分類
      const parentCategories = categories.filter(cat => !cat.parentId);
      
      parentCategories.forEach(parent => {
        const children = categories.filter(cat => cat.parentId === parent.id);
        tree.push({
          ...parent,
          children: children
        });
      });
      
      return { success: true, data: tree };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 切換分類啟用狀態
  async toggleCategoryStatus(id, isActive) {
    return await this.update(id, { isActive });
  }

  // 更新排序
  async updateSortOrder(id, sortOrder) {
    return await this.update(id, { sortOrder });
  }

  // 獲取分類選項（用於下拉選單）
  async getCategoryOptions() {
    try {
      const activeCategories = await this.getActiveCategories();
      
      if (!activeCategories.success) {
        return activeCategories;
      }
      
      const options = activeCategories.data.map(category => ({
        value: category.id,
        label: category.name,
        icon: category.icon,
        color: category.color
      }));
      
      return { success: true, data: options };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 獲取分類統計
  async getCategoryStats() {
    try {
      const allCategories = await this.getAll();
      
      if (!allCategories.success) {
        return allCategories;
      }
      
      const categories = allCategories.data;
      const activeCategories = categories.filter(c => c.isActive);
      
      const stats = {
        total: categories.length,
        active: activeCategories.length,
        inactive: categories.length - activeCategories.length
      };
      
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 搜尋分類
  async searchCategories(searchTerm) {
    try {
      const allCategories = await this.getAll();
      
      if (!allCategories.success) {
        return allCategories;
      }
      
      const term = searchTerm.toLowerCase();
      const filteredCategories = allCategories.data.filter(category =>
        category.name.toLowerCase().includes(term) ||
        category.description.toLowerCase().includes(term) ||
        category.id.toLowerCase().includes(term)
      );
      
      return { success: true, data: filteredCategories };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 驗證分類數據
  validateCategory(categoryData) {
    const errors = [];
    
    if (!categoryData.id) {
      errors.push('類別代碼不能為空');
    } else if (!/^[a-z_]+$/.test(categoryData.id)) {
      errors.push('類別代碼只能包含小寫字母和底線');
    }
    
    if (!categoryData.name) {
      errors.push('類別名稱不能為空');
    }
    
    if (!categoryData.description) {
      errors.push('類別描述不能為空');
    }
    
    if (!categoryData.icon) {
      errors.push('類別圖示不能為空');
    }
    
    if (!categoryData.color) {
      errors.push('主題色彩不能為空');
    }
    
    if (typeof categoryData.sortOrder !== 'number' || categoryData.sortOrder < 1) {
      errors.push('排序順序必須是大於0的數字');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 初始化默認分類
  async initializeDefaultCategories() {
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
      }
    ];

    for (const category of defaultCategories) {
      await this.add(category);
    }
  }
}

export const categoryService = new CategoryService();
export default categoryService;