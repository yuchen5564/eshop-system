import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userManagementService from '../services/userManagementService';

export const useAdminUser = () => {
  const { user } = useAuth();
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminUser = async () => {
      if (!user) {
        setAdminUser(null);
        setLoading(false);
        return;
      }

      try {
        // 先嘗試根據 email 查找用戶
        const result = await userManagementService.getUserByEmail(user.email);
        
        if (result.success && result.data) {
          setAdminUser(result.data);
        } else {
          // 如果找不到，創建一個基本的管理員用戶對象
          const basicAdminUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            role: 'admin', // 預設為管理員，讓首次登入的用戶能夠訪問所有功能
            permissions: [],
            isActive: true
          };
          setAdminUser(basicAdminUser);
        }
      } catch (error) {
        console.error('獲取管理員用戶資料失敗:', error);
        // 發生錯誤時，仍然創建基本用戶對象
        const basicAdminUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          role: 'admin', // 預設為管理員
          permissions: [],
          isActive: true
        };
        setAdminUser(basicAdminUser);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminUser();
  }, [user]);

  return { adminUser, loading };
};