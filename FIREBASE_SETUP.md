# Firebase 設定指南

## 🚀 快速開始指南

### 步驟 1: 創建 Firebase 項目

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「建立專案」
3. 輸入專案名稱 (例如：eshop-system)
4. 選擇是否啟用Google Analytics (可選)
5. 點擊「建立專案」

### 步驟 2: 啟用 Authentication

1. 在 Firebase Console 中選擇您的專案
2. 在左側菜單中點擊「Authentication」
3. 點擊「開始使用」
4. 前往「Sign-in method」標籤
5. 啟用「電子郵件/密碼」登入方式
6. 儲存設定

### 步驟 3: 設定 Firestore 資料庫

1. 在左側菜單中點擊「Firestore Database」
2. 點擊「建立資料庫」
3. 選擇「以測試模式啟動」(暫時)
4. 選擇資料庫位置 (建議選擇亞洲地區)
5. 點擊「完成」

### 步驟 4: 獲取 Firebase 配置

1. 在 Firebase Console 中點擊專案設定 (齒輪圖示)
2. 在「一般」標籤中找到「您的應用程式」
3. 點擊「網頁」圖示 (</>) 新增網頁應用程式
4. 輸入應用程式名稱 (例如：eshop-web)
5. 不需要設定 Firebase Hosting
6. 點擊「註冊應用程式」
7. 複製配置物件中的值

### 步驟 5: 設定環境變數

1. 在專案根目錄創建 `.env` 文件
2. 複製 `.env.example` 的內容
3. 填入從 Firebase 獲取的配置值：

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 步驟 6: 啟動系統

1. 安裝依賴：`npm install`
2. 啟動開發服務器：`npm run dev`
3. 在瀏覽器中開啟系統
4. **首次使用會自動進入系統初始化頁面**

## 🛠️ 系統初始化流程

### 自動化初始化
系統會自動檢測是否為首次使用，並引導您完成以下步驟：

1. **Firebase 設定檢查**
   - 自動檢測環境變數是否完整
   - 提供設定指南

2. **管理員帳戶創建**
   - 創建系統管理員帳戶
   - 設定管理員權限

3. **資料庫初始化**
   - 自動創建商品分類
   - 匯入示例商品資料
   - 設定優惠券模板

4. **設定完成**
   - 顯示初始化結果
   - 提供管理員帳戶資訊

## 🔐 管理後台使用

### 登入管理後台
1. 點擊首頁的「管理後台」按鈕
2. 使用初始化時創建的管理員帳戶登入
3. 開始使用管理功能

### 管理功能
- ✅ 商品管理
- ✅ 分類管理
- ✅ 訂單管理
- ✅ 優惠券管理
- ✅ 系統設定

## 安全規則設定 (可選)

為了提高安全性，建議設定 Firestore 安全規則：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允許已驗證用戶讀取商品和分類
    match /{document=**} {
      allow read: if request.auth != null;
    }
    
    // 只允許管理員寫入
    match /{document=**} {
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

## 常見問題

### Q: 無法進入管理後台？
A: 請確認：
- Firebase 配置正確
- 已創建管理員帳戶
- 管理員郵箱已添加到 `authService.js` 的管理員列表中

### Q: 數據無法載入？
A: 請確認：
- Firestore 已啟用
- 安全規則允許讀取
- 已完成數據初始化

### Q: 登入失敗？
A: 請確認：
- Authentication 已啟用
- 電子郵件/密碼登入方式已啟用
- 帳戶已正確創建

## 進階設定

### 設定自訂管理員權限

如果需要更精細的權限控制，可以使用 Firebase Admin SDK 設定自訂聲明：

```javascript
// 在 Firebase Functions 中設定
admin.auth().setCustomUserClaims(uid, { admin: true });
```

### 備份數據

建議定期備份 Firestore 數據：

```bash
gcloud firestore export gs://your-bucket/backup-folder
```

---

**注意：** 這是開發環境的設定，生產環境需要更嚴格的安全規則和配置。