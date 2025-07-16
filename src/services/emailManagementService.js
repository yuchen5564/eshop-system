import FirestoreService from './firestoreService';

class EmailManagementService extends FirestoreService {
  constructor() {
    super('email_settings');
  }

  // 獲取郵件設定
  async getEmailSettings() {
    try {
      const settings = await this.getAll();
      if (settings.success && settings.data.length > 0) {
        return { success: true, data: settings.data[0] };
      }
      return { success: false, error: '郵件設定不存在' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 更新郵件設定
  async updateEmailSettings(settingsData) {
    try {
      const existing = await this.getAll();
      if (existing.success && existing.data.length > 0) {
        return await this.update(existing.data[0].id, settingsData);
      } else {
        return await this.add(settingsData);
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 初始化預設郵件設定
  async initializeDefaultEmailSettings() {
    const defaultSettings = {
      id: 'default_email_settings',
      sender: {
        name: '農鮮市集',
        email: 'noreply@farmfresh.com'
      },
      templates: {
        orderConfirmation: {
          enabled: true,
          subject: '訂單確認 - {orderId}',
          template: 'order_confirmation'
        },
        orderStatusUpdate: {
          enabled: true,
          subject: '訂單狀態更新 - {orderId}',
          template: 'order_status_update'
        },
        shippingNotification: {
          enabled: true,
          subject: '出貨通知 - {orderId}',
          template: 'shipping_notification'
        },
        welcomeEmail: {
          enabled: true,
          subject: '歡迎加入農鮮市集',
          template: 'welcome_email'
        },
        passwordReset: {
          enabled: true,
          subject: '密碼重設',
          template: 'password_reset'
        }
      },
      notifications: {
        adminNotifications: {
          newOrder: true,
          lowStock: true,
          newUser: false,
          systemError: true
        },
        customerNotifications: {
          orderConfirmation: true,
          orderStatusUpdate: true,
          promotions: false,
          newsletter: false
        }
      },
      limits: {
        dailyLimit: 1000,
        hourlyLimit: 100,
        retryAttempts: 3
      },
      googleAppScript: {
        enabled: true,
        description: 'Google App Script 郵件發送服務'
      },
      isActive: true
    };

    // 使用固定ID創建郵件設定
    const result = await this.addWithId('default_email_settings', defaultSettings);
    return {
      success: result.success,
      message: result.success ? '郵件設定初始化成功' : '郵件設定初始化失敗',
      data: result.success ? defaultSettings : null
    };
  }
}

// 郵件模板服務
class EmailTemplateService extends FirestoreService {
  constructor() {
    super('email_templates');
  }

  // 根據模板類型獲取模板
  async getTemplateByType(type) {
    return await this.getWhere('type', '==', type);
  }

  // 初始化預設郵件模板
  async initializeDefaultTemplates() {
    const defaultTemplates = [
      {
        id: 'order_confirmation',
        type: 'order_confirmation',
        name: '訂單確認郵件',
        subject: '訂單確認 - {{orderId}}',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>訂單確認</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #52c41a; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
              .order-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>訂單確認通知</h1>
              </div>
              <div class="content">
                <p>親愛的 {{customerName}}，</p>
                <p>感謝您的訂購！您的訂單已成功建立。</p>
                <div class="order-info">
                  <h3>訂單資訊</h3>
                  <p><strong>訂單編號：</strong>{{orderId}}</p>
                  <p><strong>訂單時間：</strong>{{orderDate}}</p>
                  <p><strong>訂單總額：</strong>NT$ {{orderTotal}}</p>
                </div>
              </div>
              <div class="footer">
                <p>此為系統自動發送的郵件，請勿直接回覆</p>
                <p>農鮮市集 © 2025</p>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: '親愛的 {{customerName}}，感謝您的訂購！訂單編號：{{orderId}}',
        variables: ['customerName', 'orderId', 'orderDate', 'orderTotal'],
        isActive: true
      },
      {
        id: 'shipping_notification',
        type: 'shipping_notification',
        name: '出貨通知郵件',
        subject: '🚚 您的訂單已出貨 - {{orderId}}',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>出貨通知</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #722ed1; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
              .tracking-box { background: #e6f7ff; padding: 15px; margin: 15px 0; border-radius: 5px; text-align: center; }
              .tracking-number { font-size: 20px; font-weight: bold; color: #1890ff; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚚 您的訂單已出貨</h1>
              </div>
              <div class="content">
                <p>親愛的 {{customerName}}，</p>
                <p>您的訂單 <strong>{{orderId}}</strong> 已經出貨囉！</p>
                <div class="tracking-box">
                  <h3>📦 貨運追蹤</h3>
                  <p>追蹤編號</p>
                  <div class="tracking-number">{{trackingNumber}}</div>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: '您的訂單 {{orderId}} 已出貨，追蹤編號：{{trackingNumber}}',
        variables: ['customerName', 'orderId', 'trackingNumber'],
        isActive: true
      },
      {
        id: 'welcome_email',
        type: 'welcome_email',
        name: '歡迎郵件',
        subject: '歡迎加入農鮮市集！',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>歡迎加入</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #52c41a; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🌱 歡迎加入農鮮市集</h1>
              </div>
              <div class="content">
                <p>親愛的 {{customerName}}，</p>
                <p>歡迎您加入農鮮市集！我們致力於提供最新鮮的農產品。</p>
                <p>現在就開始探索我們的產品吧！</p>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: '歡迎加入農鮮市集！{{customerName}}',
        variables: ['customerName'],
        isActive: true
      }
    ];

    let successCount = 0;
    for (const template of defaultTemplates) {
      const result = await this.add(template);
      if (result.success) {
        successCount++;
      }
    }

    return {
      success: successCount === defaultTemplates.length,
      message: `成功創建 ${successCount}/${defaultTemplates.length} 個郵件模板`,
      count: successCount
    };
  }
}

// 郵件記錄服務
class EmailLogService extends FirestoreService {
  constructor() {
    super('email_logs');
  }

  // 獲取最近的郵件記錄
  async getRecentLogs(limit = 100) {
    try {
      const result = await this.getAll();
      if (!result.success) {
        return result;
      }

      // 按發送時間排序，最新的在前
      const sortedLogs = result.data.sort((a, b) => {
        const dateA = a.sentAt.seconds ? new Date(a.sentAt.seconds * 1000) : new Date(a.sentAt);
        const dateB = b.sentAt.seconds ? new Date(b.sentAt.seconds * 1000) : new Date(b.sentAt);
        return dateB.getTime() - dateA.getTime();
      });

      return {
        success: true,
        data: sortedLogs.slice(0, limit)
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 按類型統計
  groupByType(logs) {
    const typeStats = {};
    logs.forEach(log => {
      const type = log.type || 'general';
      if (!typeStats[type]) {
        typeStats[type] = { sent: 0, failed: 0, total: 0 };
      }
      typeStats[type].total++;
      if (log.status === 'sent' || log.status === 'delivered') {
        typeStats[type].sent++;
      } else if (log.status === 'failed' || log.status === 'error') {
        typeStats[type].failed++;
      }
    });
    return typeStats;
  }

  // 按日統計
  groupByDay(logs, days) {
    const dayStats = {};
    const today = new Date();
    
    // 初始化日期範圍
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dayStats[dateStr] = { sent: 0, failed: 0, total: 0 };
    }
    
    // 統計每日數據
    logs.forEach(log => {
      const logDate = log.sentAt.seconds ? new Date(log.sentAt.seconds * 1000) : new Date(log.sentAt);
      const dateStr = logDate.toISOString().split('T')[0];
      
      if (dayStats[dateStr]) {
        dayStats[dateStr].total++;
        if (log.status === 'sent' || log.status === 'delivered') {
          dayStats[dateStr].sent++;
        } else if (log.status === 'failed' || log.status === 'error') {
          dayStats[dateStr].failed++;
        }
      }
    });
    
    return dayStats;
  }

  // 記錄郵件發送
  async logEmail(emailData) {
    const logData = {
      to: emailData.to || '',
      from: emailData.from || '',
      subject: emailData.subject || '',
      template: emailData.template || 'general',
      type: emailData.type || 'general',
      status: emailData.status || 'unknown',
      sentAt: new Date(),
      messageId: emailData.messageId || null,
      method: emailData.method || 'google_app_script',
      attempts: emailData.attempts || 1,
      orderId: emailData.orderId || null,
      userId: emailData.userId || null,
      errorMessage: emailData.errorMessage || null
    };

    return await this.add(logData);
  }

  // 獲取郵件統計
  async getEmailStats(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const allLogs = await this.getAll();
      if (!allLogs.success) {
        return allLogs;
      }

      const recentLogs = allLogs.data.filter(log => {
        const logDate = new Date(log.sentAt.seconds * 1000);
        return logDate >= startDate;
      });

      const stats = {
        total: recentLogs.length,
        successful: recentLogs.filter(log => log.status === 'sent').length,
        failed: recentLogs.filter(log => log.status === 'failed').length,
        pending: recentLogs.filter(log => log.status === 'pending').length
      };

      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export const emailManagementService = new EmailManagementService();
export const emailTemplateService = new EmailTemplateService();
export const emailLogService = new EmailLogService();
export default emailManagementService;