# 管理員用戶管理系統

## 📋 功能概述

後台管理員用戶管理系統提供了完整的用戶帳號管理功能，包括創建、編輯、刪除和密碼重置等操作。

## 🚀 主要功能

### 1. 用戶管理服務 (`userManagementService.js`)

**核心功能：**
- ✅ 創建新用戶（Firebase Auth + Firestore）
- ✅ 獲取用戶列表（支持排序）
- ✅ 更新用戶信息
- ✅ 停用/啟用用戶
- ✅ 刪除用戶
- ✅ 密碼重置（郵件發送）
- ✅ 權限管理
- ✅ 系統初始化時同步管理員數據

**數據存儲：**
- **Collection:** `admin_users`
- **認證:** Firebase Authentication
- **數據庫:** Cloud Firestore

### 2. 用戶管理頁面 (`UserManagement.jsx`)

**界面功能：**
- 📋 用戶列表顯示（頭像、基本信息、角色、權限、狀態）
- ➕ 新增用戶功能
- ✏️ 編輯用戶功能
- 🔄 用戶狀態切換
- 🔑 密碼重置
- 🗑️ 刪除用戶
- 🔄 刷新列表

**用戶數據顯示：**
- 用戶頭像和基本信息
- 郵箱驗證狀態指示器
- 角色標籤（超級管理員、管理員、審核員）
- 權限標籤（最多顯示2個，其餘用+數字表示）
- 創建時間
- 活躍狀態切換

## 🔐 權限系統

### 角色定義

| 角色 | 標籤顏色 | 說明 |
|------|----------|------|
| `super_admin` | 紅色 | 超級管理員（系統初始化創建） |
| `admin` | 藍色 | 管理員 |
| `moderator` | 默認 | 審核員 |
| `user` | 默認 | 一般用戶 |

### 可用權限

- `user_management` - 用戶管理
- `product_management` - 商品管理
- `order_management` - 訂單管理
- `category_management` - 分類管理
- `coupon_management` - 優惠券管理
- `email_management` - 郵件管理
- `logistics_management` - 物流管理
- `payment_management` - 付款管理
- `system_settings` - 系統設定

## 🛠️ 系統初始化集成

### 自動同步管理員數據

在系統初始化過程中，當創建管理員帳戶時，系統會自動：

1. **創建 Firebase Auth 帳戶**
2. **同步寫入用戶管理數據庫**，包含：
   - 用戶 UID
   - 郵箱和顯示名稱
   - 角色：`super_admin`
   - 完整權限列表
   - 創建時間戳
   - 系統標記

### 初始化流程

```javascript
// 在 systemService.js 中的流程
1. 創建 Firebase Auth 帳戶
2. 同步寫入用戶管理數據庫 ← 新增功能
3. 初始化其他系統組件...
```

## 📊 數據結構

### 用戶文檔結構 (Firestore)

```javascript
{
  uid: "firebase-auth-uid",
  email: "admin@example.com",
  displayName: "管理員姓名",
  role: "super_admin",
  permissions: [
    "user_management",
    "product_management",
    // ... 其他權限
  ],
  isActive: true,
  emailVerified: false,
  createdAt: "2025-01-15T10:30:00.000Z",
  lastLoginAt: null,
  createdBy: "system" | "user-uid",
  updatedAt: "2025-01-15T10:30:00.000Z",
  updatedBy: "user-uid"
}
```

## 🔧 API 方法

### UserManagementService 主要方法

```javascript
// 用戶 CRUD 操作
getAllUsers()                    // 獲取所有用戶
createUser(userData)            // 創建新用戶
updateUser(userId, updateData)  // 更新用戶
deleteUser(userId)              // 刪除用戶
getUserById(userId)             // 獲取用戶詳情

// 狀態和權限管理
toggleUserStatus(userId, isActive)          // 切換用戶狀態
updateUserPermissions(userId, permissions)  // 更新權限

// 密碼和認證
resetUserPassword(email)         // 重置密碼
getUserByEmail(email)           // 根據郵箱查找用戶

// 系統功能
saveAdminUserData(uid, userData) // 保存管理員數據（初始化用）
```

## 🎯 使用方式

### 1. 訪問用戶管理

1. 登入管理後台
2. 在側邊欄點擊「用戶管理」
3. 查看和管理所有系統用戶

### 2. 創建新用戶

1. 點擊「新增用戶」按鈕
2. 填寫用戶信息：
   - 顯示名稱（必填）
   - 郵箱地址（必填）
   - 初始密碼（必填）
   - 用戶角色（必選）
   - 特殊權限（可選）
3. 點擊「創建」

### 3. 編輯用戶

1. 點擊用戶行的「編輯」按鈕
2. 修改用戶信息（不能修改郵箱）
3. 點擊「更新」

### 4. 重置密碼

1. 點擊用戶行的「重置密碼」按鈕
2. 確認操作
3. 系統將發送重置郵件到用戶郵箱

## 🔒 安全性設計

### 數據保護
- ✅ 用戶密碼由 Firebase Auth 管理
- ✅ 操作記錄追蹤（創建者、更新者）
- ✅ 確認對話框防止誤操作
- ✅ 用戶狀態控制（可停用用戶）

### 錯誤處理
- ✅ 重複郵箱檢查
- ✅ 郵箱格式驗證
- ✅ 密碼強度檢查
- ✅ 網絡錯誤處理
- ✅ 友好的錯誤信息顯示

## 📝 注意事項

1. **系統初始化**：第一個管理員會在系統初始化時創建，擁有所有權限
2. **郵箱驗證**：新創建的用戶會收到驗證郵件
3. **密碼重置**：只能通過郵件重置，不能直接修改密碼
4. **用戶刪除**：刪除操作不可恢復，請謹慎操作
5. **權限管理**：超級管理員擁有所有權限，其他角色可自定義權限

## 🔄 版本更新

**v2.0 更新（當前版本）：**
- ✅ 移除統計儀表板，簡化界面
- ✅ 系統初始化時自動同步管理員數據
- ✅ 優化用戶列表顯示
- ✅ 改進錯誤處理機制

**v1.0 功能：**
- ✅ 基本用戶 CRUD 操作
- ✅ 權限管理系統
- ✅ 密碼重置功能
- ✅ 用戶狀態管理