import productService from '../services/productService';
import categoryService from '../services/categoryService';
import orderService from '../services/orderService';
import couponService from '../services/couponService';
import { logisticsService } from '../services/logisticsService';
import { emailManagementService } from '../services/emailManagementService';
import paymentService from '../services/paymentService';

/**
 * Firestore 調試工具
 * 用於檢查和修復文檔ID問題
 */
export class FirestoreDebugTool {
  static async checkAllCollections() {
    console.log('🔍 開始檢查所有集合...');
    
    const services = {
      products: productService,
      categories: categoryService,
      orders: orderService,
      coupons: couponService,
      logistics_settings: logisticsService,
      email_settings: emailManagementService,
      payment_methods: paymentService
    };

    const results = {};

    for (const [name, service] of Object.entries(services)) {
      try {
        console.log(`\n📁 檢查集合: ${name}`);
        
        // 獲取所有文檔ID
        const idsResult = await service.listAllIds();
        if (idsResult.success) {
          console.log(`✅ ${name}: 找到 ${idsResult.data.length} 個文檔`);
          console.log(`   文檔ID: ${idsResult.data.join(', ')}`);
          results[name] = {
            success: true,
            count: idsResult.data.length,
            ids: idsResult.data
          };
        } else {
          console.log(`❌ ${name}: ${idsResult.error}`);
          results[name] = {
            success: false,
            error: idsResult.error
          };
        }

        // 嘗試獲取所有文檔
        const allResult = await service.getAll();
        if (allResult.success) {
          console.log(`📄 ${name}: 成功載入 ${allResult.data.length} 個文檔`);
        } else {
          console.log(`⚠️  ${name}: 載入失敗 - ${allResult.error}`);
        }

      } catch (error) {
        console.error(`💥 ${name}: 檢查時發生錯誤`, error);
        results[name] = {
          success: false,
          error: error.message
        };
      }
    }

    console.log('\n📊 檢查完成，結果摘要:');
    console.table(results);
    
    return results;
  }

  static async testDocumentOperations(collectionName = 'products') {
    console.log(`\n🧪 測試 ${collectionName} 集合的 CRUD 操作...`);
    
    const service = this.getServiceByName(collectionName);
    if (!service) {
      console.error(`❌ 找不到服務: ${collectionName}`);
      return;
    }

    const testData = {
      name: 'Debug Test Item',
      description: 'This is a test document for debugging',
      price: 99,
      createdAt: new Date().toISOString()
    };

    try {
      // 1. 測試添加
      console.log('1. 測試添加文檔...');
      const addResult = await service.add(testData);
      if (addResult.success) {
        console.log(`✅ 添加成功, ID: ${addResult.id}`);
        
        // 2. 測試讀取
        console.log('2. 測試讀取文檔...');
        const getResult = await service.getById(addResult.id);
        if (getResult.success) {
          console.log('✅ 讀取成功');
          console.log('   文檔內容:', getResult.data);
          
          // 3. 測試更新
          console.log('3. 測試更新文檔...');
          const updateResult = await service.update(addResult.id, {
            description: 'Updated description',
            updatedTest: true
          });
          
          if (updateResult.success) {
            console.log('✅ 更新成功');
            
            // 4. 驗證更新
            const verifyResult = await service.getById(addResult.id);
            if (verifyResult.success) {
              console.log('✅ 更新驗證成功');
              console.log('   更新後內容:', verifyResult.data);
            }
          } else {
            console.log(`❌ 更新失敗: ${updateResult.error}`);
          }
          
          // 5. 測試刪除
          console.log('4. 測試刪除文檔...');
          const deleteResult = await service.delete(addResult.id);
          if (deleteResult.success) {
            console.log('✅ 刪除成功');
            
            // 6. 驗證刪除
            const verifyDeleteResult = await service.getById(addResult.id);
            if (!verifyDeleteResult.success) {
              console.log('✅ 刪除驗證成功 - 文檔已不存在');
            } else {
              console.log('⚠️  刪除驗證失敗 - 文檔仍然存在');
            }
          } else {
            console.log(`❌ 刪除失敗: ${deleteResult.error}`);
          }
          
        } else {
          console.log(`❌ 讀取失敗: ${getResult.error}`);
        }
      } else {
        console.log(`❌ 添加失敗: ${addResult.error}`);
      }
      
    } catch (error) {
      console.error('💥 測試過程中發生錯誤:', error);
    }
  }

  static async testCustomIdOperations() {
    console.log('\n🆔 測試自訂ID操作...');
    
    const testData = {
      name: 'Custom ID Test',
      description: 'Testing custom ID functionality',
      testField: 'custom_id_test'
    };

    const customId = `test_${Date.now()}`;
    
    try {
      // 測試使用自訂ID添加
      console.log(`1. 測試使用自訂ID添加 (${customId})...`);
      const addResult = await productService.addWithId(customId, testData);
      
      if (addResult.success) {
        console.log(`✅ 自訂ID添加成功: ${addResult.id}`);
        
        // 測試讀取
        const getResult = await productService.getById(customId);
        if (getResult.success) {
          console.log('✅ 自訂ID讀取成功');
          console.log('   文檔內容:', getResult.data);
          
          // 清理測試數據
          await productService.delete(customId);
          console.log('✅ 測試數據清理完成');
        } else {
          console.log(`❌ 自訂ID讀取失敗: ${getResult.error}`);
        }
      } else {
        console.log(`❌ 自訂ID添加失敗: ${addResult.error}`);
      }
      
    } catch (error) {
      console.error('💥 自訂ID測試過程中發生錯誤:', error);
    }
  }

  static getServiceByName(name) {
    const services = {
      products: productService,
      categories: categoryService,
      orders: orderService,
      coupons: couponService,
      logistics_settings: logisticsService,
      email_settings: emailManagementService,
      payment_methods: paymentService
    };
    
    return services[name];
  }

  static async fixOrphanedDocuments(collectionName) {
    console.log(`\n🔧 修復 ${collectionName} 集合中的孤立文檔...`);
    
    const service = this.getServiceByName(collectionName);
    if (!service) {
      console.error(`❌ 找不到服務: ${collectionName}`);
      return;
    }

    try {
      const allResult = await service.getAll();
      if (!allResult.success) {
        console.error(`❌ 無法載入 ${collectionName}: ${allResult.error}`);
        return;
      }

      console.log(`📄 找到 ${allResult.data.length} 個文檔`);
      
      for (const doc of allResult.data) {
        // 檢查文檔是否可以正常讀取
        const checkResult = await service.getById(doc.id);
        if (!checkResult.success) {
          console.log(`⚠️  發現問題文檔: ${doc.id} - ${checkResult.error}`);
          
          // 可以在這裡添加修復邏輯
          // 例如：重新創建文檔或標記為需要手動處理
        } else {
          console.log(`✅ 文檔正常: ${doc.id}`);
        }
      }
      
    } catch (error) {
      console.error(`💥 修復過程中發生錯誤:`, error);
    }
  }
}

// 導出便利方法
export const debugFirestore = FirestoreDebugTool.checkAllCollections;
export const testCRUD = FirestoreDebugTool.testDocumentOperations;
export const testCustomId = FirestoreDebugTool.testCustomIdOperations;
export const fixDocuments = FirestoreDebugTool.fixOrphanedDocuments;

// 如果在瀏覽器環境中，將調試工具添加到全局對象
if (typeof window !== 'undefined') {
  window.firestoreDebug = FirestoreDebugTool;
  window.debugFirestore = debugFirestore;
  window.testCRUD = testCRUD;
  window.testCustomId = testCustomId;
  window.fixDocuments = fixDocuments;
}