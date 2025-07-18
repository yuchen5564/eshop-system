import React from 'react';
import { Card, Typography, Tag, List } from 'antd';
import { useAdminUser } from '../../hooks/useAdminUser';
import permissionService from '../../services/permissionService';

const { Title, Text } = Typography;

const UserDebugInfo = () => {
  const { adminUser, loading } = useAdminUser();

  if (loading) {
    return <div>載入中...</div>;
  }

  if (!adminUser) {
    return <div>沒有用戶資料</div>;
  }

  const userPermissions = permissionService.getUserPermissions(adminUser);
  const accessiblePages = permissionService.getAccessiblePages(adminUser);

  return (
    <Card title="用戶調試信息" >
      <div style={{ marginBottom: '16px' }}>
        <Title level={5}>基本信息</Title>
        <p><strong>Email:</strong> {adminUser.email}</p>
        <p><strong>顯示名稱:</strong> {adminUser.displayName || '未設定'}</p>
        <p><strong>角色:</strong> <Tag color="blue">{adminUser.role}</Tag></p>
        <p><strong>狀態:</strong> <Tag color={adminUser.isActive ? 'green' : 'red'}>{adminUser.isActive ? '啟用' : '停用'}</Tag></p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Title level={5}>權限信息</Title>
        <p><strong>額外權限:</strong></p>
        {adminUser.permissions && adminUser.permissions.length > 0 ? (
          <div>
            {adminUser.permissions.map(permission => (
              <Tag key={permission} color="orange">{permission}</Tag>
            ))}
          </div>
        ) : (
          <Text type="secondary">無額外權限</Text>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Title level={5}>所有權限</Title>
        {userPermissions.length > 0 ? (
          <div>
            {userPermissions.map(permission => (
              <Tag key={permission} color="green">{permission}</Tag>
            ))}
          </div>
        ) : (
          <Text type="secondary">無任何權限</Text>
        )}
      </div>

      <div>
        <Title level={5}>可訪問頁面</Title>
        <List
          size="small"
          dataSource={accessiblePages}
          renderItem={(page) => (
              <Tag color="cyan">{page}</Tag>
          )}
        />
      </div>
    </Card>
  );
};

export default UserDebugInfo;