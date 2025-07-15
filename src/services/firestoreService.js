import { 
  collection, 
  doc, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

// 通用的Firestore服務類
class FirestoreService {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collectionRef = collection(db, collectionName);
  }

  // 添加文檔（自動生成ID）
  async add(data) {
    try {
      const docRef = await addDoc(this.collectionRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Document added to ${this.collectionName} with ID: ${docRef.id}`);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error(`Error adding document to ${this.collectionName}:`, error);
      return { success: false, error: error.message };
    }
  }

  // 添加或更新文檔（使用指定ID）
  async addWithId(id, data, merge = false) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      if (merge) {
        await setDoc(docRef, docData, { merge: true });
      } else {
        await setDoc(docRef, docData);
      }
      
      console.log(`Document set in ${this.collectionName} with ID: ${id}`);
      return { success: true, id: id };
    } catch (error) {
      console.error(`Error setting document in ${this.collectionName} with ID ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  // 更新文檔
  async update(id, data) {
    try {
      if (!id) {
        throw new Error('Document ID is required for update operation');
      }
      
      const docRef = doc(db, this.collectionName, id);
      
      // 先檢查文檔是否存在
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error(`Document with ID '${id}' not found in collection '${this.collectionName}'`);
      }
      
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      console.log(`Document updated in ${this.collectionName} with ID: ${id}`);
      return { success: true };
    } catch (error) {
      console.error(`Error updating document in ${this.collectionName} with ID ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  // 刪除文檔
  async delete(id) {
    try {
      if (!id) {
        throw new Error('Document ID is required for delete operation');
      }
      
      const docRef = doc(db, this.collectionName, id);
      
      // 先檢查文檔是否存在
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error(`Document with ID '${id}' not found in collection '${this.collectionName}'`);
      }
      
      await deleteDoc(docRef);
      console.log(`Document deleted from ${this.collectionName} with ID: ${id}`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting document from ${this.collectionName} with ID ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  // 獲取單個文檔
  async getById(id) {
    try {
      if (!id) {
        throw new Error('Document ID is required for get operation');
      }
      
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log(`Document retrieved from ${this.collectionName} with ID: ${id}`);
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        console.warn(`Document not found in ${this.collectionName} with ID: ${id}`);
        return { success: false, error: `Document with ID '${id}' not found in collection '${this.collectionName}'` };
      }
    } catch (error) {
      console.error(`Error getting document from ${this.collectionName} with ID ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  // 獲取所有文檔
  async getAll(orderField = 'createdAt', orderDirection = 'desc', limitCount = null) {
    try {
      let q = query(this.collectionRef, orderBy(orderField, orderDirection));
      
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: documents };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 條件查詢
  async getWhere(field, operator, value) {
    try {
      const q = query(this.collectionRef, where(field, operator, value));
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: documents };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 實時監聽
  onSnapshot(callback, orderField = 'createdAt', orderDirection = 'desc') {
    const q = query(this.collectionRef, orderBy(orderField, orderDirection));
    
    return onSnapshot(q, (snapshot) => {
      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      callback(documents);
    });
  }

  // 檢查文檔是否存在
  async exists(id) {
    try {
      if (!id) {
        return { success: false, exists: false, error: 'Document ID is required' };
      }
      
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      return { success: true, exists: docSnap.exists() };
    } catch (error) {
      console.error(`Error checking document existence in ${this.collectionName} with ID ${id}:`, error);
      return { success: false, exists: false, error: error.message };
    }
  }

  // 批量操作：獲取多個文檔
  async getMultiple(ids) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error('IDs array is required and cannot be empty');
      }

      const promises = ids.map(id => this.getById(id));
      const results = await Promise.all(promises);
      
      const documents = [];
      const errors = [];
      
      results.forEach((result, index) => {
        if (result.success) {
          documents.push(result.data);
        } else {
          errors.push({ id: ids[index], error: result.error });
        }
      });
      
      return { 
        success: true, 
        data: documents,
        errors: errors.length > 0 ? errors : null 
      };
    } catch (error) {
      console.error(`Error getting multiple documents from ${this.collectionName}:`, error);
      return { success: false, error: error.message };
    }
  }

  // 調試方法：列出所有文檔ID
  async listAllIds() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const ids = [];
      
      querySnapshot.forEach((doc) => {
        ids.push(doc.id);
      });
      
      console.log(`All document IDs in ${this.collectionName}:`, ids);
      return { success: true, data: ids };
    } catch (error) {
      console.error(`Error listing document IDs in ${this.collectionName}:`, error);
      return { success: false, error: error.message };
    }
  }
}

export default FirestoreService;