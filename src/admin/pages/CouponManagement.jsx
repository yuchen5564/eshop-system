import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  message,
  Popconfirm,
  Tooltip,
  Alert
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  GiftOutlined,
  PercentageOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined
} from '@ant-design/icons';
import couponService from '../../services/couponService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadCoupons();
    loadStats();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const result = await couponService.getAll();
      if (result.success) {
        setCoupons(result.data);
      } else {
        message.error('載入優惠券失敗');
      }
    } catch (error) {
      message.error('載入優惠券失敗');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await couponService.getCouponStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('載入統計資料失敗:', error);
    }
  };

  const handleCreate = () => {
    setEditingCoupon(null);
    form.resetFields();
    form.setFieldsValue({
      type: 'fixed',
      isActive: true,
      userRestrictions: {
        newUsersOnly: false,
        maxUsagePerUser: 1
      }
    });
    setModalVisible(true);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    form.setFieldsValue({
      ...coupon,
      validPeriod: [dayjs(coupon.validFrom), dayjs(coupon.validTo)],
      applicableCategories: coupon.applicableCategories,
      excludedProducts: coupon.excludedProducts
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const [validFrom, validTo] = values.validPeriod || [];
      
      // 確保所有數據都是可序列化的
      const couponData = {
        code: values.code?.toUpperCase() || '',
        name: values.name || '',
        description: values.description || '',
        type: values.type || 'fixed',
        value: Number(values.value) || 0,
        minimumAmount: Number(values.minimumAmount) || 0,
        maximumDiscount: values.maximumDiscount ? Number(values.maximumDiscount) : null,
        usageLimit: values.usageLimit ? Number(values.usageLimit) : null,
        validFrom: validFrom?.toISOString() || new Date().toISOString(),
        validTo: validTo?.toISOString() || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: Boolean(values.isActive ?? true),
        applicableCategories: Array.isArray(values.applicableCategories) ? values.applicableCategories : [],
        excludedProducts: Array.isArray(values.excludedProducts) ? values.excludedProducts : [],
        userRestrictions: {
          newUsersOnly: Boolean(values.userRestrictions?.newUsersOnly ?? false),
          maxUsagePerUser: Number(values.userRestrictions?.maxUsagePerUser) || 1
        }
      };

      if (editingCoupon) {
        const result = await couponService.update(editingCoupon.id, couponData);
        if (result.success) {
          message.success('優惠券更新成功');
        } else {
          message.error('更新失敗: ' + result.error);
          return;
        }
      } else {
        // 新增優惠券時使用優惠券代碼作為ID
        const couponId = values.code.toUpperCase();
        const { code, ...dataWithoutCode } = couponData;
        const result = await couponService.addWithId(couponId, {
          ...dataWithoutCode,
          code: code.toUpperCase(),
          usedCount: 0
        });
        if (result.success) {
          message.success('優惠券建立成功');
        } else {
          message.error('建立失敗: ' + result.error);
          return;
        }
      }

      setModalVisible(false);
      loadCoupons();
      loadStats();
    } catch (error) {
      message.error('操作失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (couponId) => {
    try {
      const result = await couponService.delete(couponId);
      if (result.success) {
        message.success('優惠券刪除成功');
        loadCoupons();
        loadStats();
      } else {
        message.error('刪除失敗: ' + result.error);
      }
    } catch (error) {
      console.error('Delete coupon error:', error);
      message.error('刪除失敗: ' + error.message);
    }
  };

  const handleCopy = (coupon) => {
    const newCoupon = {
      ...coupon,
      code: `${coupon.code}_COPY`,
      name: `${coupon.name} (複製)`,
      usedCount: 0
    };
    setEditingCoupon(null);
    form.setFieldsValue({
      ...newCoupon,
      validPeriod: [dayjs(newCoupon.validFrom), dayjs(newCoupon.validTo)]
    });
    setModalVisible(true);
  };

  const handleToggleActive = async (coupon, isActive) => {
    try {
      const result = await couponService.update(coupon.id, { isActive });
      if (result.success) {
        message.success(`優惠券已${isActive ? '啟用' : '停用'}`);
        loadCoupons();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Toggle coupon active status error:', error);
      message.error('操作失敗: ' + error.message);
    }
  };

  const getStatusTag = (coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validTo = new Date(coupon.validTo);

    if (!coupon.isActive) {
      return <Tag color="default">已停用</Tag>;
    }
    if (now < validFrom) {
      return <Tag color="blue">未開始</Tag>;
    }
    if (now > validTo) {
      return <Tag color="red">已過期</Tag>;
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return <Tag color="orange">已用完</Tag>;
    }
    return <Tag color="green">進行中</Tag>;
  };

  const getTypeTag = (type, value) => {
    if (type === 'fixed') {
      return <Tag icon={<GiftOutlined />} color="blue">固定金額 NT$ {value}</Tag>;
    }
    return <Tag icon={<PercentageOutlined />} color="orange">百分比 {value}%</Tag>;
  };

  const columns = [
    {
      title: '優惠券代碼',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code) => (
        <Text strong copyable style={{ fontFamily: 'monospace' }}>
          {code}
        </Text>
      )
    },
    {
      title: '名稱',
      dataIndex: 'name',
      key: 'name',
      width: 180
    },
    {
      title: '優惠類型',
      key: 'discount',
      width: 150,
      render: (_, record) => getTypeTag(record.type, record.value)
    },
    {
      title: '最低金額',
      dataIndex: 'minimumAmount',
      key: 'minimumAmount',
      width: 100,
      render: (amount) => `NT$ ${amount}`
    },
    {
      title: '使用狀況',
      key: 'usage',
      width: 120,
      render: (_, record) => (
        <div>
          <div>{record.usedCount} / {record.usageLimit || '∞'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.usageLimit ? 
              `剩餘 ${Math.max(0, record.usageLimit - record.usedCount)}` : 
              '無限制'
            }
          </div>
        </div>
      )
    },
    {
      title: '有效期間',
      key: 'validity',
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            {dayjs(record.validFrom).format('YYYY/MM/DD')}
          </div>
          <div style={{ fontSize: '12px' }}>
            至 {dayjs(record.validTo).format('YYYY/MM/DD')}
          </div>
        </div>
      )
    },
    {
      title: '狀態',
      key: 'status',
      width: 100,
      render: (_, record) => getStatusTag(record)
    },
    {
      title: '啟用',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          size="small"
          onChange={(checked) => handleToggleActive(record, checked)}
        />
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="編輯">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="複製">
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          <Popconfirm
            title="確定要刪除此優惠券嗎？"
            onConfirm={() => handleDelete(record.id)}
            okText="確定"
            cancelText="取消"
          >
            <Tooltip title="刪除">
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

  const categoryOptions = [
    { label: '蔬菜類', value: 'vegetable' },
    { label: '水果類', value: 'fruit' },
    { label: '穀物類', value: 'grain' }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>優惠券管理</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          新增優惠券
        </Button>
      </div>
      
      {/* 統計卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="總優惠券數"
                value={stats.total}
                prefix={<GiftOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="進行中"
                value={stats.active}
                valueStyle={{ color: '#3f8600' }}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="已過期"
                value={stats.expired}
                valueStyle={{ color: '#cf1322' }}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="總使用次數"
                value={stats.totalUsage}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>

      <Card title="優惠券列表">

        <Table
          columns={columns}
          dataSource={coupons}
          rowKey="code"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 個優惠券`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新增/編輯優惠券 Modal */}
      <Modal
        title={editingCoupon ? '編輯優惠券' : '新增優惠券'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            {editingCoupon ? '更新' : '建立'}
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="優惠券代碼"
                rules={[
                  { required: true, message: '請輸入優惠券代碼' },
                  { pattern: /^[A-Z0-9_]+$/, message: '只能包含大寫字母、數字和底線' }
                ]}
              >
                <Input 
                  placeholder="例如：WELCOME100" 
                  style={{ textTransform: 'uppercase' }}
                  disabled={!!editingCoupon}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="優惠券名稱"
                rules={[{ required: true, message: '請輸入優惠券名稱' }]}
              >
                <Input placeholder="例如：新會員歡迎優惠" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '請輸入優惠券描述' }]}
          >
            <Input.TextArea rows={2} placeholder="優惠券的詳細說明" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="type"
                label="優惠類型"
                rules={[{ required: true, message: '請選擇優惠類型' }]}
              >
                <Select>
                  <Select.Option value="fixed">固定金額</Select.Option>
                  <Select.Option value="percentage">百分比折扣</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="value"
                label="優惠數值"
                rules={[{ required: true, message: '請輸入優惠數值' }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="例如：100 或 20"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="minimumAmount"
                label="最低消費金額"
                rules={[{ required: true, message: '請輸入最低消費金額' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="例如：500"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="maximumDiscount"
                label="最高折扣金額"
                tooltip="僅適用於百分比折扣，留空表示無上限"
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="例如：300"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="usageLimit"
                label="總使用次數限制"
                tooltip="留空表示無限制"
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="例如：100"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="validPeriod"
            label="有效期間"
            rules={[{ required: true, message: '請選擇有效期間' }]}
          >
            <RangePicker
              style={{ width: '100%' }}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="applicableCategories"
                label="適用商品分類"
                tooltip="留空表示適用全部分類"
              >
                <Select
                  mode="multiple"
                  options={categoryOptions}
                  placeholder="選擇適用的商品分類"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['userRestrictions', 'maxUsagePerUser']}
                label="每人使用次數限制"
                rules={[{ required: true, message: '請輸入每人使用次數限制' }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="例如：1"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['userRestrictions', 'newUsersOnly']}
                label="僅限新用戶"
                valuePropName="checked"
              >
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="啟用狀態"
                valuePropName="checked"
              >
                <Switch checkedChildren="啟用" unCheckedChildren="停用" />
              </Form.Item>
            </Col>
          </Row>

          <Alert
            message="溫馨提示"
            description="優惠券建立後，代碼將無法修改。請確認代碼正確無誤。"
            type="info"
            showIcon
            style={{ marginTop: '16px' }}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default CouponManagement;