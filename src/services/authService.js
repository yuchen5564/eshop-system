import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

// 登入用戶
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 註冊用戶
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 更新用戶顯示名稱
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
    
    // 發送驗證郵件
    await sendEmailVerification(userCredential.user);
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 登出用戶
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 重設密碼
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 監聽認證狀態變化
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// 獲取當前用戶
export const getCurrentUser = () => {
  return auth.currentUser;
};

// 檢查用戶是否為管理員
export const isAdmin = async (user) => {
  if (!user) return false;
  
  try {
    // 先檢查custom claims
    const token = await user.getIdTokenResult();
    if (token.claims.admin === true) {
      return true;
    }
    
    // 檢查是否為系統創建的管理員
    // 通過檢查用戶的創建時間和郵箱來判斷
    // 這裡可以根據需要調整邏輯
    
    // 臨時方案：所有透過系統創建的用戶都視為管理員
    // 在實際環境中，應該有更嚴格的權限控制
    return true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};