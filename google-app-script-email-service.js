/**
 * 農鮮市集 - Google App Script 郵件發送服務
 * 
 * 部署說明：
 * 1. 在 Google Apps Script (script.google.com) 創建新專案
 * 2. 將此程式碼貼到 Code.gs 文件中
 * 3. 在「服務」中啟用 Gmail API
 * 4. 部署為 Web App，設定執行身份為您的帳戶，存取權限為「任何人」
 * 5. 將獲得的 Web App URL 設定到系統的郵件設定中
 * 
 * 注意：此程式碼不包含任何預設設定，所有資料都從POST請求中獲取
 */

// 基本配置
const CONFIG = {
  // 郵件限制
  MAX_RECIPIENTS: 100,
  MAX_SUBJECT_LENGTH: 250,
  MAX_BODY_LENGTH: 1000000, // 1MB
  
  // 錯誤重試設定
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000 // 毫秒
};

/**
 * 主要的 doPost 函數 - 處理來自前端的POST請求
 */
function doPost(e) {
  try {
    let requestData;
    
    // 處理不同的請求格式
    if (e.postData.type === 'application/json') {
      // JSON 格式
      requestData = JSON.parse(e.postData.contents);
    } else {
      // Form data 格式
      const payload = e.parameter.payload;
      if (payload) {
        requestData = JSON.parse(payload);
      } else {
        throw new Error('無法解析請求資料');
      }
    }
    
    // 驗證請求資料
    const validation = validateRequest(requestData);
    if (!validation.valid) {
      return createResponse(false, validation.message);
    }
    
    // 發送郵件
    const result = sendEmail(requestData);
    
    return createResponse(result.success, result.message, result.data);
    
  } catch (error) {
    console.error('doPost 執行錯誤:', error);
    return createResponse(false, '伺服器內部錯誤: ' + error.toString());
  }
}

/**
 * 處理 OPTIONS 請求 (CORS preflight)
 */
function doOptions(e) {
  return createCorsResponse();
}

/**
 * 處理 GET 請求 (JSONP 調用和健康檢查)
 */
function doGet(e) {
  try {
    // 檢查是否是 JSONP 調用
    if (e.parameter.callback && e.parameter.payload) {
      const callback = e.parameter.callback;
      const requestData = JSON.parse(e.parameter.payload);
      
      // 驗證請求資料
      const validation = validateRequest(requestData);
      if (!validation.valid) {
        return createJsonpResponse(callback, false, validation.message);
      }
      
      // 發送郵件
      const result = sendEmail(requestData);
      
      return createJsonpResponse(callback, result.success, result.message, result.data);
    }
    
    // 否則返回健康檢查
    return healthCheck();
    
  } catch (error) {
    console.error('doGet 執行錯誤:', error);
    if (e.parameter.callback) {
      return createJsonpResponse(e.parameter.callback, false, '伺服器內部錯誤: ' + error.toString());
    }
    return createResponse(false, '伺服器內部錯誤: ' + error.toString());
  }
}

/**
 * 驗證請求資料
 */
function validateRequest(data) {
  // 檢查必要欄位
  if (!data.to) {
    return { valid: false, message: '缺少收件人地址' };
  }
  
  if (!data.subject) {
    return { valid: false, message: '缺少郵件主題' };
  }
  
  if (!data.htmlContent && !data.textContent) {
    return { valid: false, message: '缺少郵件內容' };
  }
  
  if (!data.from || !data.from.email) {
    return { valid: false, message: '缺少寄件者資訊' };
  }
  
  // 驗證電子郵件格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.to)) {
    return { valid: false, message: '收件人電子郵件格式不正確' };
  }
  
  if (!emailRegex.test(data.from.email)) {
    return { valid: false, message: '寄件者電子郵件格式不正確' };
  }
  
  // 檢查內容長度限制
  if (data.subject.length > CONFIG.MAX_SUBJECT_LENGTH) {
    return { valid: false, message: '郵件主題過長' };
  }
  
  const bodyLength = (data.htmlContent || '').length + (data.textContent || '').length;
  if (bodyLength > CONFIG.MAX_BODY_LENGTH) {
    return { valid: false, message: '郵件內容過長' };
  }
  
  return { valid: true };
}

/**
 * 發送郵件主函數
 */
function sendEmail(data) {
  let attempts = 0;
  let lastError = null;
  
  while (attempts < CONFIG.MAX_RETRIES) {
    try {
      attempts++;
      
      // 準備郵件選項
      const mailOptions = prepareMailOptions(data);
      
      // 發送郵件
      const result = sendGmailMessage(mailOptions);
      
      return {
        success: true,
        message: '郵件發送成功',
        data: {
          messageId: result.messageId,
          to: data.to,
          subject: data.subject,
          sentAt: new Date().toISOString(),
          attempts: attempts
        }
      };
      
    } catch (error) {
      lastError = error;
      console.error(`郵件發送失敗 (嘗試 ${attempts}/${CONFIG.MAX_RETRIES}):`, error);
      
      if (attempts < CONFIG.MAX_RETRIES) {
        Utilities.sleep(CONFIG.RETRY_DELAY * attempts); // 指數退避
      }
    }
  }
  
  return {
    success: false,
    message: `郵件發送失敗，已嘗試 ${attempts} 次`,
    error: lastError.toString()
  };
}

/**
 * 準備郵件選項
 */
function prepareMailOptions(data) {
  const options = {
    to: data.to,
    subject: data.subject,
    replyTo: data.from.email,
    name: data.from.name || data.from.email,
    fromEmail: data.from.email // 新增寄件者信箱
  };
  
  // 設定郵件內容
  if (data.htmlContent) {
    options.htmlBody = data.htmlContent;
  }
  
  if (data.textContent) {
    options.body = data.textContent;
  } else if (data.htmlContent) {
    // 如果只有HTML內容，嘗試轉換為純文字
    options.body = stripHtml(data.htmlContent);
  }
  
  // 添加附件（如果有）
  if (data.attachments && data.attachments.length > 0) {
    options.attachments = prepareAttachments(data.attachments);
  }
  
  return options;
}

/**
 * 發送Gmail郵件
 */
function sendGmailMessage(options) {
  try {
    // 準備郵件選項
    const mailOptions = {
      htmlBody: options.htmlBody,
      replyTo: options.replyTo,
      name: options.name,
      attachments: options.attachments
    };
    
    // 嘗試使用指定的寄件者信箱（如果是已驗證的別名）
    if (options.fromEmail && options.fromEmail !== Session.getActiveUser().getEmail()) {
      try {
        // 檢查是否為已驗證的別名
        const aliases = GmailApp.getAliases();
        const isValidAlias = aliases.includes(options.fromEmail);
        
        if (isValidAlias) {
          mailOptions.from = options.fromEmail;
          console.log(`使用已驗證的別名: ${options.fromEmail}`);
        } else {
          console.warn(`${options.fromEmail} 不是已驗證的別名，使用預設寄件者`);
        }
      } catch (aliasError) {
        console.warn('檢查別名時發生錯誤:', aliasError);
      }
    }
    
    // 使用Gmail服務發送郵件
    GmailApp.sendEmail(
      options.to,
      options.subject,
      options.body,
      mailOptions
    );
    
    return {
      messageId: generateMessageId(),
      success: true
    };
    
  } catch (error) {
    console.error('Gmail發送錯誤:', error);
    throw error;
  }
}

/**
 * 準備附件
 */
function prepareAttachments(attachments) {
  return attachments.map(attachment => {
    if (attachment.url) {
      // 從URL獲取檔案
      const response = UrlFetchApp.fetch(attachment.url);
      return {
        fileName: attachment.filename || 'attachment',
        content: response.getBlob(),
        mimeType: attachment.mimeType || 'application/octet-stream'
      };
    } else if (attachment.content) {
      // 直接使用base64內容
      return {
        fileName: attachment.filename || 'attachment',
        content: Utilities.base64Decode(attachment.content),
        mimeType: attachment.mimeType || 'application/octet-stream'
      };
    }
  }).filter(attachment => attachment); // 過濾掉無效的附件
}

/**
 * 移除HTML標籤（簡單版本）
 */
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

/**
 * 生成郵件ID
 */
function generateMessageId() {
  return 'gas_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 創建統一的回應格式
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600'
    });
}

/**
 * 創建 CORS 回應
 */
function createCorsResponse() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600'
    });
}

/**
 * 創建 JSONP 回應
 */
function createJsonpResponse(callback, success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }
  
  const jsonpResponse = `${callback}(${JSON.stringify(response)});`;
  
  return ContentService
    .createTextOutput(jsonpResponse)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

/**
 * 測試函數 - 可以在Apps Script編輯器中直接執行
 * 注意：需要手動修改測試資料
 */
function testEmailSending() {
  const testData = {
    to: 'test@example.com', // 請修改為您的測試郵件地址
    subject: '測試郵件 - 農鮮市集郵件服務',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #52c41a;">🌱 郵件系統測試成功</h2>
        <p>恭喜！您的農鮮市集郵件系統已正常運作。</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>測試時間：</strong>${new Date().toLocaleString()}</p>
          <p><strong>發送方式：</strong>Google App Script</p>
          <p><strong>版本：</strong>純GAS版本（無預設設定）</p>
        </div>
        <p style="color: #666;">此為系統自動發送的測試郵件，請勿直接回覆。</p>
      </div>
    `,
    textContent: `
郵件系統測試成功

恭喜！您的農鮮市集郵件系統已正常運作。

測試時間：${new Date().toLocaleString()}
發送方式：Google App Script
版本：純GAS版本（無預設設定）

此為系統自動發送的測試郵件，請勿直接回覆。
    `,
    from: {
      email: 'noreply@example.com', // 請修改為您的寄件者郵件
      name: '農鮮市集'
    },
    type: 'test'
  };
  
  const result = sendEmail(testData);
  console.log('測試結果:', result);
  return result;
}

/**
 * 健康檢查函數
 */
function healthCheck() {
  try {
    return createResponse(true, 'Google App Script 郵件服務正常運行', {
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      features: ['gmail_sending', 'no_default_config', 'attachment_support']
    });
  } catch (error) {
    return createResponse(false, '健康檢查失敗: ' + error.toString());
  }
}

/**
 * 獲取服務資訊
 */
function getServiceInfo() {
  return createResponse(true, 'Google App Script 郵件服務資訊', {
    name: '農鮮市集郵件服務',
    version: '2.0.0',
    description: '純Google App Script郵件發送服務，無預設設定',
    capabilities: [
      'HTML郵件發送',
      '純文字郵件發送',
      '附件支援',
      '錯誤重試',
      '輸入驗證'
    ],
    limits: {
      maxRecipients: CONFIG.MAX_RECIPIENTS,
      maxSubjectLength: CONFIG.MAX_SUBJECT_LENGTH,
      maxBodyLength: CONFIG.MAX_BODY_LENGTH,
      maxRetries: CONFIG.MAX_RETRIES
    },
    requiredFields: [
      'to (收件人郵件地址)',
      'subject (郵件主題)',
      'htmlContent 或 textContent (郵件內容)',
      'from.email (寄件者郵件地址)',
      'from.name (寄件者名稱，可選)'
    ]
  });
}