import React from 'react';
import { Navigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import permissionService from '../../services/permissionService';

const ProtectedRoute = ({ 
  children, 
  pageKey, 
  user, 
  showUnauthorized = true 
}) => {
  // 如果沒有用戶，重定向到登錄頁面
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // 檢查頁面訪問權限
  if (!permissionService.canAccessPage(user, pageKey)) {
    if (showUnauthorized) {
      return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <Result
            status="403"
            title="403"
            subTitle="抱歉，您沒有權限訪問此頁面。"
            icon={<LockOutlined style={{ color: '#ff4d4f' }} />}
            extra={
              <Button type="primary" onClick={() => window.history.back()}>
                返回
              </Button>
            }
          />
        </div>
      );
    }
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

export default ProtectedRoute;