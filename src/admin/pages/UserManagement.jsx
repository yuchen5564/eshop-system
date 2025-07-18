import React, { useState, useEffect } from 'react';
import {
  Button,
  Space,
  Form,
  Input,
  message,
  Popconfirm,
  Switch,
  Select,
  Tag,
  Avatar,
  Badge,
  Tooltip,
  Divider,
  Typography,
  Card,
  Table,
  Modal,
  Row,
  Col
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  KeyOutlined,
  EyeOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import userManagementService from '../../services/userManagementService';
import { PageContainer } from '../../components/common';
import { AdminCard, AdminTable, StatusTag } from '../components/ui';
import { AdminModal, AdminForm, ActionButton, FilterBar } from '../components/forms';

const { Option } = Select;
const { Title, Text } = Typography;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10); // 預設每頁10筆
  
  // 密碼重置相關狀態
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [resetPasswordResult, setResetPasswordResult] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await userManagementService.getAllUsers();
      if (result.success) {
        setUsers(result.data);
      } else {
        message.error('載入用戶列表失敗');
      }
    } catch (error) {
      message.error('載入用戶列表失敗');
    } finally {
      setLoading(false);
    }
  };


  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setUserModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      permissions: user.permissions || []
    });
    setUserModalVisible(true);
  };

  const handleUserSubmit = async (values) => {
    try {
      if (editingUser) {
        // 更新用戶
        const { password, ...updateData } = values;
        const result = await userManagementService.updateUser(editingUser.id, updateData);
        if (result.success) {
          message.success('用戶已更新');
          loadUsers();
        } else {
          message.error('更新失敗: ' + result.error);
          return;
        }
      } else {
        // 創建新用戶
        const result = await userManagementService.createUser(values);
        if (result.success) {
          message.success('用戶已創建');
          loadUsers();
        } else {
          message.error('創建失敗: ' + result.error);
          return;
        }
      }
      setUserModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('操作失敗：' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const result = await userManagementService.deleteUser(userId);
      if (result.success) {
        message.success('用戶已刪除');
        loadUsers();
      } else {
        message.error('刪除失敗');
      }
    } catch (error) {
      message.error('刪除失敗：' + error.message);
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      const result = await userManagementService.toggleUserStatus(userId, isActive);
      if (result.success) {
        message.success(`用戶已${isActive ? '啟用' : '停用'}`);
        loadUsers();
      } else {
        message.error('狀態更新失敗');
      }
    } catch (error) {
      message.error('狀態更新失敗：' + error.message);
    }
  };

  const handleResetPassword = (user) => {
    console.log('Resetting password for user:', user);
    setResetPasswordUser(user);
    setResetPasswordResult(null);
    setResetPasswordModalVisible(true);
  };

  const handleResetPasswordConfirm = async () => {
    if (!resetPasswordUser) return;
    
    setResetPasswordLoading(true);
    try {
      console.log('Calling resetUserPassword for:', resetPasswordUser.email);
      const result = await userManagementService.resetUserPassword(resetPasswordUser.email);
      console.log('Reset password result:', result);
      
      setResetPasswordResult(result);
      // 不關閉 Modal，而是顯示結果
    } catch (error) {
      console.error('Reset password error:', error);
      setResetPasswordResult({
        success: false,
        error: error.message
      });
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleResetPasswordCancel = () => {
    setResetPasswordModalVisible(false);
    setResetPasswordUser(null);
    setResetPasswordResult(null);
    setResetPasswordLoading(false);
  };

  const handleResetPasswordClose = () => {
    setResetPasswordModalVisible(false);
    setResetPasswordUser(null);
    setResetPasswordResult(null);
    setResetPasswordLoading(false);
  };

  const availablePermissions = [
    { label: '用戶管理', value: 'user_management' },
    { label: '商品管理', value: 'product_management' },
    { label: '訂單管理', value: 'order_management' },
    { label: '分類管理', value: 'category_management' },
    { label: '優惠券管理', value: 'coupon_management' },
    { label: '郵件管理', value: 'email_management' },
    { label: '物流管理', value: 'logistics_management' },
    { label: '付款管理', value: 'payment_management' },
    { label: '系統設定', value: 'system_settings' }
  ];

  const columns = [
    {
      title: '用戶',
      key: 'user',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar 
            size="large" 
            icon={<UserOutlined />}
            style={{ backgroundColor: record.isActive ? '#1890ff' : '#d9d9d9' }}
          >
            {record.displayName ? record.displayName.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold' }}>
              {record.displayName || '未設定姓名'}
              {/* {record.emailVerified && (
                <Tooltip title="郵箱已驗證">
                  <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: '4px' }} />
                </Tooltip>
              )} */}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
            <div style={{ fontSize: '11px', color: '#999' }}>
              UID: {record.uid?.substring(0, 8)}...
            </div>
          </div>
        </div>
      )
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role) => (
        <Tag color={role === 'admin' ? 'blue' : role === 'moderator' ? 'orange' : 'default'}>
          {role === 'admin' ? '管理員' : 
           role === 'moderator' ? '審核員' : '一般用戶'}
        </Tag>
      )
    },
    {
      title: '權限',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 200,
      render: (permissions = []) => (
        <div>
          {permissions.length === 0 ? (
            <Text type="secondary">無特殊權限</Text>
          ) : (
            <div>
              {permissions.slice(0, 2).map(permission => {
                const perm = availablePermissions.find(p => p.value === permission);
                return (
                  <Tag key={permission} size="small">
                    {perm ? perm.label : permission}
                  </Tag>
                );
              })}
              {permissions.length > 2 && (
                <Tooltip title={permissions.slice(2).map(p => {
                  const perm = availablePermissions.find(ap => ap.value === p);
                  return perm ? perm.label : p;
                }).join(', ')}>
                  <Tag size="small">+{permissions.length - 2}</Tag>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      title: '狀態',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
          checkedChildren="啟用"
          unCheckedChildren="停用"
        />
      )
    },
    {
      title: '創建時間',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (createdAt) => (
        <div>
          <div>{new Date(createdAt).toLocaleDateString('zh-TW')}</div>
          <div style={{ fontSize: '11px', color: '#999' }}>
            {new Date(createdAt).toLocaleTimeString('zh-TW')}
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space>
          <Tooltip title="編輯用戶">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="重置密碼">
            <Button
              size="small"
              icon={<KeyOutlined />}
              onClick={() => handleResetPassword(record)}
            />
          </Tooltip>
          <Popconfirm
            title="確定要刪除此用戶嗎？"
            description="此操作不可恢復"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="確定"
            cancelText="取消"
          >
            <Tooltip title="刪除用戶">
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>用戶管理</Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              loadUsers();
            }}
          >
            刷新
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
          >
            新增用戶
          </Button>
        </Space>
      </div>


      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `顯示 ${range[0]}-${range[1]} 項，共 ${total} 項`,
            pageSizeOptions: ['5', '10', '20', '50', '100'],
            onShowSizeChange: (current, size) => {
              setPageSize(size);
            }
          }}
          size="middle"
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 用戶編輯 Modal */}
      <Modal
        title={editingUser ? '編輯用戶' : '新增用戶'}
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setUserModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
          >
            {editingUser ? '更新' : '創建'}
          </Button>
        ]}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUserSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="displayName"
                label="顯示名稱"
                rules={[{ required: true, message: '請輸入顯示名稱' }]}
              >
                <Input placeholder="請輸入顯示名稱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="郵箱地址"
                rules={[
                  { required: true, message: '請輸入郵箱地址' },
                  { type: 'email', message: '請輸入有效的郵箱格式' }
                ]}
              >
                <Input 
                  placeholder="請輸入郵箱地址" 
                  disabled={!!editingUser}
                />
              </Form.Item>
            </Col>
          </Row>

          {!editingUser && (
            <Form.Item
              name="password"
              label="初始密碼"
              rules={[
                { required: true, message: '請輸入初始密碼' },
                { min: 6, message: '密碼至少需要6個字符' }
              ]}
            >
              <Input.Password placeholder="請輸入初始密碼" />
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="用戶角色"
                rules={[{ required: true, message: '請選擇用戶角色' }]}
              >
                <Select 
                  placeholder="請選擇用戶角色"
                  onChange={(value) => {
                    // 當角色變更時，自動設定預設權限
                    const rolePermissions = {
                      'admin': [
                        'user_management',
                        'product_management',
                        'order_management', 
                        'category_management',
                        'coupon_management',
                        'email_management',
                        'logistics_management',
                        'payment_management',
                        'system_settings'
                      ],
                      'moderator': [
                        'product_management',
                        'order_management',
                        'category_management'
                      ],
                      'user': []
                    };
                    
                    form.setFieldsValue({
                      permissions: rolePermissions[value] || []
                    });
                  }}
                >
                  <Option value="admin">管理員</Option>
                  <Option value="moderator">審核員</Option>
                  <Option value="user">一般用戶</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="permissions"
                label="特殊權限"
              >
                <Select
                  mode="multiple"
                  placeholder="請選擇特殊權限（可選）"
                  options={availablePermissions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          
          <div style={{ 
            background: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            borderRadius: '6px', 
            padding: '12px',
            fontSize: '14px',
            color: '#389e0d'
          }}>
            <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
            {editingUser ? 
              '更新用戶信息後，用戶需要重新登入。如需重置密碼，請使用「重置密碼」功能。' :
              '新用戶創建後可以直接使用，無需郵箱驗證。如需重置密碼，可使用「重置密碼」功能發送重置郵件。'
            }
          </div>
        </Form>
      </Modal>

      {/* 密碼重置 Modal */}
      <Modal
        title="重置用戶密碼"
        open={resetPasswordModalVisible}
        onOk={resetPasswordResult ? handleResetPasswordClose : handleResetPasswordConfirm}
        onCancel={handleResetPasswordCancel}
        confirmLoading={resetPasswordLoading}
        okText={resetPasswordResult ? '我知道了' : '確定發送'}
        cancelText="取消"
        centered
        closable={!resetPasswordLoading}
        maskClosable={!resetPasswordLoading}
      >
        {!resetPasswordResult ? (
          // 確認發送階段
          <div>
            <p>確定要為用戶重置密碼嗎？</p>
            <div style={{ 
              background: '#f6f6f6', 
              padding: '12px', 
              borderRadius: '6px', 
              marginTop: '12px' 
            }}>
              <div><strong>用戶：</strong>{resetPasswordUser?.displayName || '未設定姓名'}</div>
              <div><strong>郵箱：</strong>{resetPasswordUser?.email}</div>
            </div>
            <p style={{ marginTop: '12px', color: '#666', fontSize: '14px' }}>
              重置密碼郵件將發送到上述郵箱地址。
            </p>
          </div>
        ) : (
          // 結果顯示階段
          <div>
            {resetPasswordResult.success ? (
              <div>
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '16px',
                  color: '#52c41a',
                  fontSize: '16px'
                }}>
                  <CheckCircleOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                  重置密碼郵件發送成功
                </div>
                <div style={{ 
                  background: '#f6ffed', 
                  border: '1px solid #b7eb8f',
                  padding: '16px', 
                  borderRadius: '6px',
                  marginBottom: '16px'
                }}>
                  <div><strong>發送到：</strong>{resetPasswordUser?.email}</div>
                  <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                    請提醒用戶檢查郵箱（包含垃圾郵件夾），並按照郵件中的指示重置密碼。
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '16px',
                  color: '#ff4d4f',
                  fontSize: '16px'
                }}>
                  <CloseCircleOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                  重置密碼郵件發送失敗
                </div>
                <div style={{ 
                  background: '#fff2f0', 
                  border: '1px solid #ffccc7',
                  padding: '16px', 
                  borderRadius: '6px',
                  marginBottom: '16px'
                }}>
                  <div><strong>目標郵箱：</strong>{resetPasswordUser?.email}</div>
                  <div style={{ marginTop: '8px' }}>
                    <strong>錯誤原因：</strong>
                    <div style={{ color: '#ff4d4f', marginTop: '4px' }}>
                      {resetPasswordResult.error}
                    </div>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                    請檢查郵箱地址是否正確，或稍後再試。
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;