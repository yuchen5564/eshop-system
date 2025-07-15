import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { db, auth } from '../firebase/firebase';

class UserManagementService {
  constructor() {
    this.collectionName = 'admin_users';
  }

  // 獲取所有管理員用戶
  async getAllUsers() {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        data: users
      };
    } catch (error) {
      console.error('獲取用戶列表失敗:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 創建新用戶
  async createUser(userData) {
    try {
      const { email, password, displayName, role = 'admin', permissions = [] } = userData;

      // 檢查郵箱是否已存在
      const existingUser = await this.getUserByEmail(email);
      if (existingUser.success && existingUser.data) {
        return {
          success: false,
          error: '此郵箱已經被使用'
        };
      }

      // 在 Firebase Auth 中創建用戶
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 更新用戶顯示名稱
      if (displayName) {
        await updateProfile(user, {
          displayName: displayName
        });
      }

      // 發送驗證郵件
      try {
        await sendEmailVerification(user);
      } catch (emailError) {
        console.warn('發送驗證郵件失敗:', emailError);
      }

      // 在 Firestore 中保存用戶信息
      const userDoc = {
        uid: user.uid,
        email: email,
        displayName: displayName || '',
        role: role,
        permissions: permissions,
        isActive: true,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: null,
        createdBy: auth.currentUser?.uid || 'system'
      };

      const docRef = await addDoc(collection(db, this.collectionName), userDoc);

      return {
        success: true,
        data: {
          id: docRef.id,
          uid: user.uid,
          ...userDoc
        }
      };
    } catch (error) {
      console.error('創建用戶失敗:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // 根據郵箱查找用戶
  async getUserByEmail(email) {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return {
          success: true,
          data: null
        };
      }

      const doc = querySnapshot.docs[0];
      return {
        success: true,
        data: {
          id: doc.id,
          ...doc.data()
        }
      };
    } catch (error) {
      console.error('查找用戶失敗:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 更新用戶信息
  async updateUser(userId, updateData) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      const updatedData = {
        ...updateData,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.uid || 'system'
      };

      await updateDoc(userRef, updatedData);

      return {
        success: true,
        data: updatedData
      };
    } catch (error) {
      console.error('更新用戶失敗:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 停用/啟用用戶
  async toggleUserStatus(userId, isActive) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      await updateDoc(userRef, {
        isActive: isActive,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.uid || 'system'
      });

      return {
        success: true,
        data: { isActive }
      };
    } catch (error) {
      console.error('更新用戶狀態失敗:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 刪除用戶
  async deleteUser(userId) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      await deleteDoc(userRef);

      return {
        success: true
      };
    } catch (error) {
      console.error('刪除用戶失敗:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 重置用戶密碼
  async resetUserPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);

      return {
        success: true,
        message: '密碼重置郵件已發送'
      };
    } catch (error) {
      console.error('密碼重置失敗:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // 更新用戶權限
  async updateUserPermissions(userId, permissions) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      await updateDoc(userRef, {
        permissions: permissions,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.uid || 'system'
      });

      return {
        success: true,
        data: { permissions }
      };
    } catch (error) {
      console.error('更新用戶權限失敗:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 獲取用戶詳細信息
  async getUserById(userId) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return {
          success: false,
          error: '用戶不存在'
        };
      }

      return {
        success: true,
        data: {
          id: userSnap.id,
          ...userSnap.data()
        }
      };
    } catch (error) {
      console.error('獲取用戶詳情失敗:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 保存管理員用戶數據（系統初始化時使用）
  async saveAdminUserData(uid, userData) {
    try {
      // 直接在 Firestore 中保存用戶數據，不通過 Firebase Auth
      const docRef = await addDoc(collection(db, this.collectionName), userData);
      
      return {
        success: true,
        data: {
          id: docRef.id,
          ...userData
        }
      };
    } catch (error) {
      console.error('保存管理員用戶數據失敗:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 錯誤訊息轉換
  getErrorMessage(error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return '此郵箱已經被使用';
      case 'auth/invalid-email':
        return '郵箱格式無效';
      case 'auth/weak-password':
        return '密碼強度不足，至少需要6個字符';
      case 'auth/user-not-found':
        return '用戶不存在';
      case 'auth/too-many-requests':
        return '請求過於頻繁，請稍後再試';
      default:
        return error.message || '操作失敗';
    }
  }

  // 獲取用戶統計
  async getUserStats() {
    try {
      const users = await this.getAllUsers();
      if (!users.success) {
        return users;
      }

      const totalUsers = users.data.length;
      const activeUsers = users.data.filter(user => user.isActive).length;
      const verifiedUsers = users.data.filter(user => user.emailVerified).length;
      const recentUsers = users.data.filter(user => {
        const createdDate = new Date(user.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate > weekAgo;
      }).length;

      return {
        success: true,
        data: {
          total: totalUsers,
          active: activeUsers,
          verified: verifiedUsers,
          recent: recentUsers
        }
      };
    } catch (error) {
      console.error('獲取用戶統計失敗:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new UserManagementService();