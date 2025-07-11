import React, { useState, useEffect } from 'react';
import { Alert } from 'antd';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';

const AlertNotification = ({ alerts, onRemoveAlert }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '80px', // 在 header 下方
      right: '24px',
      left: '24px',
      zIndex: 9999,
      maxWidth: '400px',
      marginLeft: 'auto'
    }}>
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          message={alert.title}
          description={alert.description}
          type="success"
          showIcon
          closable
          onClose={() => onRemoveAlert(alert.id)}
          style={{
            marginBottom: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            animation: 'slideIn 0.3s ease-out'
          }}
        />
      ))}
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// Hook for managing alerts
export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [lastAlertTime, setLastAlertTime] = useState(0);

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const addAlert = (title, description, duration = 3000) => {
    const now = Date.now();
    
    // 防止在短時間內添加重複的 alert（500ms 內）
    if (now - lastAlertTime < 500) {
      return null;
    }
    
    setLastAlertTime(now);
    const id = now + Math.random();
    const newAlert = { id, title, description };
    
    setAlerts(prev => [...prev, newAlert]);

    // Auto remove after duration
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, duration);

    return id;
  };

  const addSuccessAlert = (product, isUpdate = false, newQuantity = 1) => {
    const title = (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>{product.image}</span>
        <span style={{ fontWeight: 'bold' }}>{product.name}</span>
      </div>
    );

    const description = isUpdate 
      ? `數量已更新為 ${newQuantity} 個`
      : `已加入購物車！來自 ${product.farm}`;

    return addAlert(title, description, 3000);
  };

  const addRemoveAlert = (product) => {
    const title = (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>{product.image}</span>
        <span style={{ fontWeight: 'bold' }}>{product.name}</span>
      </div>
    );

    const description = '已從購物車移除';

    return addAlert(title, description, 2000);
  };

  return {
    alerts,
    addAlert,
    addSuccessAlert,
    addRemoveAlert,
    removeAlert
  };
};

export default AlertNotification;