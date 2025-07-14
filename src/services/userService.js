import FirestoreService from './firestoreService';

class UserService extends FirestoreService {
  constructor() {
    super('users');
  }

  // 創建用戶資料
  async createUserProfile(uid, userData) {
    try {
      const userProfile = {
        uid: uid,
        email: userData.email,
        displayName: userData.displayName || '',
        role: userData.role || 'user',
        isActive: true,
        ...userData
      };
      
      // 使用用戶的UID作為文檔ID
      const result = await this.add(userProfile);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根據UID獲取用戶資料
  async getUserByUid(uid) {
    return await this.getWhere('uid', '==', uid);
  }

  // 根據email獲取用戶資料
  async getUserByEmail(email) {
    return await this.getWhere('email', '==', email);
  }

  // 更新用戶角色
  async updateUserRole(uid, role) {
    try {
      const userResult = await this.getUserByUid(uid);
      if (userResult.success && userResult.data.length > 0) {
        const userId = userResult.data[0].id;
        return await this.update(userId, { role });
      }
      return { success: false, error: '用戶不存在' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 檢查用戶是否為管理員
  async isUserAdmin(uid) {
    try {
      const userResult = await this.getUserByUid(uid);
      if (userResult.success && userResult.data.length > 0) {
        return userResult.data[0].role === 'admin';
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // 獲取所有管理員
  async getAdmins() {
    return await this.getWhere('role', '==', 'admin');
  }

  // 獲取用戶統計
  async getUserStats() {
    try {
      const allUsers = await this.getAll();
      
      if (!allUsers.success) {
        return allUsers;
      }
      
      const users = allUsers.data;
      const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        active: users.filter(u => u.isActive).length,
        inactive: users.filter(u => !u.isActive).length
      };
      
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new UserService();