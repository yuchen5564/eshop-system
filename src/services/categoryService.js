class CategoryService {
  constructor() {
    this.categories = new Map();
    this.initializeDefaultCategories();
  }

  initializeDefaultCategories() {
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
        createdAt: '2025-01-01T00:00:00Z'
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
        createdAt: '2025-01-01T00:00:00Z'
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
        createdAt: '2025-01-01T00:00:00Z'
      }
    ];

    defaultCategories.forEach(category => {
      this.categories.set(category.id, category);
    });
  }

  // 獲取所有類別
  getAllCategories() {
    return Array.from(this.categories.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // 獲取啟用的類別
  getActiveCategories() {
    return this.getAllCategories().filter(category => category.isActive);
  }

  // 根據ID獲取類別
  getCategoryById(id) {
    return this.categories.get(id);
  }

  // 新增類別
  createCategory(categoryData) {
    const newCategory = {
      ...categoryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  // 更新類別
  updateCategory(id, updates) {
    const category = this.categories.get(id);
    if (!category) return null;

    const updatedCategory = {
      ...category,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  // 刪除類別
  deleteCategory(id) {
    return this.categories.delete(id);
  }

  // 切換類別啟用狀態
  toggleCategoryStatus(id, isActive) {
    return this.updateCategory(id, { isActive });
  }

  // 更新排序
  updateSortOrder(id, sortOrder) {
    return this.updateCategory(id, { sortOrder });
  }

  // 獲取類別選項（用於下拉選單）
  getCategoryOptions() {
    return this.getActiveCategories().map(category => ({
      value: category.id,
      label: category.name,
      icon: category.icon,
      color: category.color
    }));
  }

  // 獲取類別統計
  getCategoryStats() {
    const allCategories = this.getAllCategories();
    const activeCategories = allCategories.filter(c => c.isActive);
    
    return {
      total: allCategories.length,
      active: activeCategories.length,
      inactive: allCategories.length - activeCategories.length
    };
  }

  // 檢查類別是否存在
  categoryExists(id) {
    return this.categories.has(id);
  }

  // 根據名稱搜尋類別
  searchCategories(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.getAllCategories().filter(category =>
      category.name.toLowerCase().includes(term) ||
      category.description.toLowerCase().includes(term) ||
      category.id.toLowerCase().includes(term)
    );
  }

  // 驗證類別數據
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
}

export const categoryService = new CategoryService();
export default categoryService;