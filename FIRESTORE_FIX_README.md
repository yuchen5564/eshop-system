# Firebase Firestore 修正說明

## 問題描述
系統在更新和刪除Firestore文檔時遇到"無法找到文檔"的錯誤，主要原因是文檔ID管理不當。

## 主要修正內容

### 1. 增強的FirestoreService
- ✅ 添加了`addWithId()`方法來支持自訂ID
- ✅ 在更新和刪除操作前增加文檔存在性檢查
- ✅ 改善了錯誤處理和日誌記錄
- ✅ 添加了`exists()`方法檢查文檔是否存在
- ✅ 添加了`listAllIds()`方法列出所有文檔ID
- ✅ 添加了`getMultiple()`方法批量獲取文檔

### 2. 修正系統初始化
修正了以下服務的初始化邏輯，使用自訂ID而非隨機ID：

- ✅ **CategoryService**: 使用固定ID（'vegetable', 'fruit', 'grain', 'meat', 'dairy'）
- ✅ **CouponService**: 使用固定ID（'WELCOME100', 'FRUIT20', 'SPRING2025'）
- ✅ **LogisticsService**: 使用固定ID（'default_logistics_settings'）
- ✅ **EmailManagementService**: 使用固定ID（'default_email_settings'）
- ✅ **PaymentService**: 使用固定ID（'credit_card', 'bank_transfer', 'cash_on_delivery', 'line_pay', 'apple_pay'）

### 3. 添加調試工具
創建了`firestoreDebug.js`工具來幫助診斷和修復問題：

- 🔍 `checkAllCollections()`: 檢查所有集合的狀態
- 🧪 `testDocumentOperations()`: 測試CRUD操作
- 🆔 `testCustomIdOperations()`: 測試自訂ID功能
- 🔧 `fixOrphanedDocuments()`: 修復孤立文檔

## 如何使用

### 1. 檢查系統狀態
在瀏覽器控制台中執行：
```javascript
// 檢查所有集合
await window.debugFirestore();

// 測試特定集合的CRUD操作
await window.testCRUD('products');

// 測試自訂ID功能
await window.testCustomId();
```

### 2. 修復現有問題
如果發現有問題的文檔，可以使用：
```javascript
// 修復特定集合
await window.fixDocuments('products');
```

### 3. 重新初始化系統
如果需要重新初始化系統數據：
```javascript
import systemService from './src/services/systemService';

// 重新初始化所有數據
const result = await systemService.initializeSystem({
  email: 'admin@example.com',
  password: 'admin123',
  displayName: 'Administrator'
});
```

## 常見問題解決

### Q1: 更新操作失敗，提示"Document not found"
**解決方案**: 
1. 檢查文檔ID是否正確
2. 使用`service.exists(id)`檢查文檔是否存在
3. 使用`service.listAllIds()`查看所有可用的文檔ID

### Q2: 刪除操作失敗
**解決方案**:
1. 確認要刪除的文檔確實存在
2. 檢查Firebase安全規則是否允許刪除操作
3. 使用調試工具測試刪除功能

### Q3: 自訂ID創建失敗
**解決方案**:
1. 使用`addWithId()`方法而非`add()`方法
2. 確保ID不包含Firebase不支持的字符
3. 檢查ID長度不超過限制

### Q4: Firebase安全規則問題
**建議的Firestore規則**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允許所有讀寫操作（開發環境）
    match /{document=**} {
      allow read, write: if true;
    }
    
    // 生產環境建議使用更嚴格的規則
    // match /products/{productId} {
    //   allow read: if true;
    //   allow write: if request.auth != null;
    // }
  }
}
```

## 測試步驟

### 1. 基本功能測試
```bash
# 1. 啟動開發服務器
npm run dev

# 2. 打開瀏覽器控制台
# 3. 執行調試命令
await window.debugFirestore();
```

### 2. 完整系統測試
1. 進入後台管理系統
2. 嘗試添加、編輯、刪除商品
3. 檢查訂單管理功能
4. 測試設定頁面的保存功能

## 注意事項

1. **環境變數**: 確保`.env`文件中的Firebase配置正確
2. **網路連接**: 確保能正常連接到Firebase
3. **瀏覽器權限**: 某些瀏覽器可能阻止跨域請求
4. **Firebase配額**: 注意Firebase的免費額度限制

## 監控和維護

建議定期執行以下檢查：
```javascript
// 每日檢查
await window.debugFirestore();

// 週度深度檢查
for (const collection of ['products', 'orders', 'categories']) {
  await window.testCRUD(collection);
}
```

## 聯繫支援

如果問題持續存在，請提供以下信息：
1. 瀏覽器控制台的錯誤訊息
2. `debugFirestore()`的輸出結果
3. Firebase控制台的相關截圖
4. 具體的操作步驟

---

**最後更新**: 2025年7月15日
**版本**: 1.0.0