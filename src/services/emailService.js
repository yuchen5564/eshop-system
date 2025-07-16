import { emailManagementService, emailLogService } from './emailManagementService';

class EmailService {
  constructor() {
    this.emailConfig = {
      adminEmail: 'admin@example.com',
      fromEmail: 'noreply@example.com'
    };
  }

  // 獲取 Google App Script URL
  getGoogleAppScriptUrl() {
    const scriptId = import.meta.env.VITE_GOOGLE_APP_SCRIPT_ID;
    if (!scriptId) {
      throw new Error('Google App Script ID 未設定，請在 .env 文件中設定 VITE_GOOGLE_APP_SCRIPT_ID');
    }
    return `https://script.google.com/macros/s/${scriptId}/exec`;
  }

  async sendOrderConfirmationEmail(orderData) {
    const customerEmail = {
      to: orderData.customerEmail,
      subject: `訂單確認 - ${orderData.id}`,
      html: this.generateOrderConfirmationTemplate(orderData),
      type: 'order_confirmation'
    };

    const adminEmail = {
      to: this.emailConfig.adminEmail,
      subject: `新訂單通知 - ${orderData.id}`,
      html: this.generateNewOrderAdminTemplate(orderData),
      type: 'new_order_admin'
    };

    try {
      await this.sendEmail(customerEmail);
      await this.sendEmail(adminEmail);
      console.log('訂單確認郵件已發送');
      return { success: true, message: '郵件發送成功' };
    } catch (error) {
      console.error('郵件發送失敗:', error);
      return { success: false, message: '郵件發送失敗', error };
    }
  }

  async sendShippingNotificationEmail(orderData, shippingInfo) {
    const email = {
      to: orderData.customerEmail,
      subject: `出貨通知 - ${orderData.id}`,
      html: this.generateShippingNotificationTemplate(orderData, shippingInfo),
      type: 'shipping_notification'
    };

    try {
      await this.sendEmail(email);
      console.log('出貨通知郵件已發送');
      return { success: true, message: '出貨通知郵件發送成功' };
    } catch (error) {
      console.error('出貨通知郵件發送失敗:', error);
      return { success: false, message: '出貨通知郵件發送失敗', error };
    }
  }

  generateOrderConfirmationTemplate(orderData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #52c41a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items-table th { background-color: #f2f2f2; }
          .total { font-size: 18px; font-weight: bold; color: #52c41a; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>訂單確認通知</h1>
          </div>
          
          <div class="content">
            <p>親愛的 ${orderData.customerName}，</p>
            <p>感謝您的訂購！您的訂單已成功建立，詳細資訊如下：</p>
            
            <div class="order-info">
              <h3>訂單資訊</h3>
              <p><strong>訂單編號：</strong>${orderData.id}</p>
              <p><strong>訂單時間：</strong>${new Date(orderData.orderDate).toLocaleString('zh-TW')}</p>
              <p><strong>付款方式：</strong>${this.getPaymentMethodText(orderData.paymentMethod)}</p>
            </div>

            <div class="order-info">
              <h3>配送資訊</h3>
              <p><strong>收件人：</strong>${orderData.customerName}</p>
              <p><strong>聯絡電話：</strong>${orderData.customerPhone}</p>
              <p><strong>配送地址：</strong>${orderData.shippingAddress}</p>
              ${orderData.notes ? `<p><strong>備註：</strong>${orderData.notes}</p>` : ''}
            </div>

            <div class="order-info">
              <h3>訂購商品</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>商品名稱</th>
                    <th>單價</th>
                    <th>數量</th>
                    <th>小計</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderData.items.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>NT$ ${item.price}</td>
                      <td>${item.quantity}</td>
                      <td>NT$ ${item.price * item.quantity}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <p class="total">訂單總額：NT$ ${orderData.total.toLocaleString()}</p>
            </div>

            <p>我們將盡快為您處理訂單，如有任何問題請與我們聯繫。</p>
          </div>
          
          <div class="footer">
            <p>此為系統自動發送的郵件，請勿直接回覆</p>
            <p>農鮮市集 © 2025</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateNewOrderAdminTemplate(orderData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1890ff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items-table th { background-color: #f2f2f2; }
          .urgent { color: #ff4d4f; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>新訂單通知</h1>
          </div>
          
          <div class="content">
            <p class="urgent">有新的訂單需要處理！</p>
            
            <div class="order-info">
              <h3>訂單資訊</h3>
              <p><strong>訂單編號：</strong>${orderData.id}</p>
              <p><strong>訂單時間：</strong>${new Date(orderData.orderDate).toLocaleString('zh-TW')}</p>
              <p><strong>訂單狀態：</strong>待處理</p>
              <p><strong>付款狀態：</strong>${this.getPaymentStatusText(orderData.paymentStatus)}</p>
              <p><strong>付款方式：</strong>${this.getPaymentMethodText(orderData.paymentMethod)}</p>
              <p><strong>訂單總額：</strong>NT$ ${orderData.total.toLocaleString()}</p>
            </div>

            <div class="order-info">
              <h3>客戶資訊</h3>
              <p><strong>客戶姓名：</strong>${orderData.customerName}</p>
              <p><strong>聯絡電話：</strong>${orderData.customerPhone}</p>
              <p><strong>電子郵件：</strong>${orderData.customerEmail}</p>
              <p><strong>配送地址：</strong>${orderData.shippingAddress}</p>
              ${orderData.notes ? `<p><strong>備註：</strong>${orderData.notes}</p>` : ''}
            </div>

            <div class="order-info">
              <h3>訂購商品</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>商品名稱</th>
                    <th>單價</th>
                    <th>數量</th>
                    <th>小計</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderData.items.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>NT$ ${item.price}</td>
                      <td>${item.quantity}</td>
                      <td>NT$ ${item.price * item.quantity}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <p>請盡快在管理後台處理此訂單。</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateShippingNotificationTemplate(orderData, shippingInfo) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #722ed1; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .shipping-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #722ed1; }
          .tracking-box { background: #e6f7ff; padding: 15px; margin: 15px 0; border-radius: 5px; text-align: center; }
          .tracking-number { font-size: 20px; font-weight: bold; color: #1890ff; letter-spacing: 2px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚚 您的訂單已出貨</h1>
          </div>
          
          <div class="content">
            <p>親愛的 ${orderData.customerName}，</p>
            <p>您的訂單 <strong>${orderData.id}</strong> 已經出貨囉！</p>
            
            <div class="shipping-info">
              <h3>🏢 貨運資訊</h3>
              <p><strong>貨運公司：</strong>${shippingInfo.carrier}</p>
              <p><strong>出貨時間：</strong>${new Date(shippingInfo.shippedDate).toLocaleString('zh-TW')}</p>
              <p><strong>預計送達：</strong>${shippingInfo.estimatedDelivery || '1-3個工作天'}</p>
            </div>

            <div class="tracking-box">
              <h3>📦 貨運追蹤</h3>
              <p>追蹤編號</p>
              <div class="tracking-number">${shippingInfo.trackingNumber}</div>
              ${shippingInfo.trackingUrl ? `
                <p style="margin-top: 15px;">
                  <a href="${shippingInfo.trackingUrl}" target="_blank" 
                     style="background: #1890ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    點擊追蹤包裹
                  </a>
                </p>
              ` : ''}
            </div>

            <div class="shipping-info">
              <h3>📍 配送地址</h3>
              <p>${orderData.shippingAddress}</p>
            </div>

            ${shippingInfo.notes ? `
              <div class="shipping-info">
                <h3>💬 配送備註</h3>
                <p>${shippingInfo.notes}</p>
              </div>
            ` : ''}

            <p>感謝您的耐心等待，如有任何問題請與我們聯繫。</p>
          </div>
          
          <div class="footer">
            <p>此為系統自動發送的郵件，請勿直接回覆</p>
            <p>農鮮市集 © 2025</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPaymentMethodText(method) {
    const methods = {
      'credit_card': '信用卡付款',
      'bank_transfer': '銀行轉帳',
      'cash_on_delivery': '貨到付款'
    };
    return methods[method] || method;
  }

  getPaymentStatusText(status) {
    const statuses = {
      'pending': '待付款',
      'paid': '已付款',
      'failed': '付款失敗',
      'refunded': '已退款'
    };
    return statuses[status] || status;
  }

  async sendEmail(emailData) {
    let logData = {
      to: emailData.to,
      subject: emailData.subject,
      template: emailData.template || 'general',
      type: emailData.type || 'general',
      orderId: emailData.orderId,
      userId: emailData.userId,
      status: 'pending',
      attempts: 0,
      method: 'google_app_script'
    };

    try {
      // 檢查郵件功能是否啟用
      const isEnabled = await this.isEmailEnabled();
      if (!isEnabled) {
        console.log('郵件功能已停用，跳過發送');
        logData.status = 'skipped';
        logData.errorMessage = '郵件功能已停用';
        logData.from = 'system';
        await emailLogService.logEmail(logData);
        return { success: false, message: '郵件功能已停用', skipped: true };
      }

      // 獲取郵件設定
      const emailSettings = await this.getEmailSettings();
      if (!emailSettings.success) {
        throw new Error('無法獲取郵件設定');
      }

      logData.from = emailSettings.data.sender?.email || this.emailConfig.fromEmail;

      // 使用Google App Script發送
      const result = await this.sendViaGoogleAppScript(emailData, emailSettings.data);
      
      // 更新記錄狀態
      logData.status = result.success ? 'sent' : 'failed';
      logData.messageId = result.messageId;
      logData.attempts = result.attempts || 1;
      logData.errorMessage = result.success ? null : result.error;
      logData.from = emailSettings.data.sender?.email || this.emailConfig.fromEmail;
      
      await emailLogService.logEmail(logData);
      
      return result;
    } catch (error) {
      console.error('郵件發送失敗:', error);
      logData.status = 'failed';
      logData.errorMessage = error.message;
      logData.from = 'system';
      await emailLogService.logEmail(logData);
      return { success: false, message: '郵件發送失敗', error: error.message };
    }
  }

  async sendViaGoogleAppScript(emailData, emailSettings) {
    const scriptId = import.meta.env.VITE_GOOGLE_APP_SCRIPT_ID;
    
    if (!scriptId) {
      throw new Error('Google App Script ID 未設定');
    }
    
    try {
      const payload = {
        to: emailData.to,
        subject: emailData.subject,
        htmlContent: emailData.html || '',
        textContent: emailData.text || '',
        from: {
          email: emailSettings.sender?.email || this.emailConfig.fromEmail,
          name: emailSettings.sender?.name || '農鮮市集'
        },
        type: emailData.type || 'general',
        metadata: {
          orderId: emailData.orderId,
          userId: emailData.userId,
          timestamp: new Date().toISOString()
        }
      };

      // 使用 JSONP 方式調用
      const result = await this.sendViaJsonp(scriptId, payload);
      
      console.log(`郵件已通過Google App Script發送到 ${emailData.to}:`, emailData.subject);
      return { 
        success: true, 
        messageId: result.messageId || `gas_${Date.now()}`, 
        status: 'sent',
        method: 'google_app_script',
        attempts: 1
      };
      
    } catch (error) {
      console.error('Google App Script 郵件發送失敗:', error);
      return { 
        success: false, 
        message: '郵件發送失敗', 
        error: error.message,
        method: 'google_app_script'
      };
    }
  }

  // 使用 JSONP 方式調用 Google App Script
  async sendViaJsonp(scriptId, payload) {
    return new Promise((resolve, reject) => {
      const callbackName = `emailCallback_${Date.now()}`;
      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('請求超時'));
      }, 30000); // 30秒超時
      
      const cleanup = () => {
        if (window[callbackName]) {
          delete window[callbackName];
        }
        clearTimeout(timeoutId);
        const script = document.getElementById(callbackName);
        if (script) {
          document.head.removeChild(script);
        }
      };
      
      // 設定回調函數
      window[callbackName] = (response) => {
        cleanup();
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || '郵件發送失敗'));
        }
      };
      
      // 創建 JSONP 腳本
      const script = document.createElement('script');
      script.id = callbackName;
      
      const params = new URLSearchParams({
        callback: callbackName,
        payload: JSON.stringify(payload)
      });
      
      script.src = `https://script.google.com/macros/s/${scriptId}/exec?${params.toString()}`;
      
      script.onerror = () => {
        cleanup();
        reject(new Error('腳本載入失敗'));
      };
      
      document.head.appendChild(script);
    });
  }

  // 測試郵件發送功能
  async testEmailSending(testEmail) {
    const testData = {
      to: testEmail,
      subject: '測試郵件 - 農鮮市集郵件系統',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #52c41a;">🌱 郵件系統測試成功</h2>
          <p>恭喜！您的農鮮市集郵件系統已正常運作。</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>測試時間：</strong>${new Date().toLocaleString('zh-TW')}</p>
            <p><strong>發送方式：</strong>Google App Script</p>
          </div>
          <p style="color: #666;">此為系統自動發送的測試郵件，請勿直接回覆。</p>
        </div>
      `,
      text: `郵件系統測試成功\n\n恭喜！您的農鮮市集郵件系統已正常運作。\n\n測試時間：${new Date().toLocaleString('zh-TW')}\n發送方式：Google App Script\n\n此為系統自動發送的測試郵件，請勿直接回覆。`,
      type: 'test'
    };

    return await this.sendEmail(testData);
  }

  async isEmailEnabled() {
    try {
      const settings = await emailManagementService.getEmailSettings();
      return settings.success && settings.data?.isActive;
    } catch (error) {
      console.error('檢查郵件功能狀態失敗:', error);
      return false;
    }
  }

  async getEmailSettings() {
    try {
      return await emailManagementService.getEmailSettings();
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  updateEmailConfig(config) {
    this.emailConfig = { ...this.emailConfig, ...config };
  }

  getEmailConfig() {
    return { ...this.emailConfig };
  }
}

export const emailService = new EmailService();
export default emailService;