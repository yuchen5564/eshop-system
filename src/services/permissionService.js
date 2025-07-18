// 頁面權限配置
const PAGE_PERMISSIONS = {
  // 儀表板 - 所有角色都可以訪問
  'dashboard': [],
  
  // 用戶管理 - 需要 user_management 權限
  'user-management': ['user_management'],
  
  // 商品管理 - 需要 product_management 權限
  'product-management': ['product_management'],
  
  // 訂單管理 - 需要 order_management 權限
  'order-management': ['order_management'],
  
  // 分類管理 - 需要 category_management 權限
  'category-management': ['category_management'],
  
  // 優惠券管理 - 需要 coupon_management 權限
  'coupon-management': ['coupon_management'],
  
  // 郵件管理 - 需要 email_management 權限
  'email-management': ['email_management'],
  
  // 物流管理 - 需要 logistics_management 權限
  'logistics-management': ['logistics_management'],
  
  // 付款管理 - 需要 payment_management 權限
  'payment-management': ['payment_management'],
  
  // 系統設定 - 需要 system_settings 權限
  'system-settings': ['system_settings']
};

// 角色預設權限配置
const DEFAULT_ROLE_PERMISSIONS = {
  // 管理員 - 大部分權限，但不包含系統設定
  'admin': [
    'user_management',
    'product_management',
    'order_management', 
    'category_management',
    'coupon_management',
    'email_management',
    'logistics_management',
    'payment_management',
    'system_settings'
  ],
  
  // 審核員 - 主要是查看和部分管理權限
  'moderator': [
    'product_management',
    'order_management',
    'category_management'
  ],
  
  // 一般用戶 - 基本查看權限
  'user': []
};

class PermissionService {
  constructor() {
    this.pagePermissions = PAGE_PERMISSIONS;
    this.defaultRolePermissions = DEFAULT_ROLE_PERMISSIONS;
  }

  // 檢查用戶是否有頁面訪問權限
  canAccessPage(user, pageKey) {
    if (!user) return false;
    
    const requiredPermissions = this.pagePermissions[pageKey];
    
    // 如果頁面不需要特殊權限，則允許訪問
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    
    // 獲取用戶的所有權限
    const userPermissions = this.getUserPermissions(user);
    
    // 檢查是否有任何必需的權限
    return requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );
  }

  // 獲取用戶的所有權限（角色權限 + 額外權限）
  getUserPermissions(user) {
    if (!user) return [];
    
    const rolePermissions = this.defaultRolePermissions[user.role] || [];
    const extraPermissions = user.permissions || [];
    
    // 合併權限並去重
    return [...new Set([...rolePermissions, ...extraPermissions])];
  }

  // 獲取用戶可訪問的頁面列表
  getAccessiblePages(user) {
    const accessiblePages = [];
    
    Object.keys(this.pagePermissions).forEach(pageKey => {
      if (this.canAccessPage(user, pageKey)) {
        accessiblePages.push(pageKey);
      }
    });
    
    return accessiblePages;
  }

  // 檢查特定權限
  hasPermission(user, permission) {
    const userPermissions = this.getUserPermissions(user);
    return userPermissions.includes(permission);
  }

  // 獲取所有可用權限
  getAllPermissions() {
    return [
      'user_management',
      'product_management',
      'order_management',
      'category_management',
      'coupon_management',
      'email_management',
      'logistics_management',
      'payment_management',
      'system_settings'
    ];
  }
}

export default new PermissionService();