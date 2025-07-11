import React from 'react';
import { 
  Layout, 
  Row, 
  Col, 
  Space, 
  Typography, 
  Button, 
  Divider 
} from 'antd';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{ background: '#001529', color: 'white', padding: '60px 0', width: '100%', margin: 0 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={6}>
            <Space direction="vertical" size="middle">
              <Space align="center">
                <div style={{ fontSize: '32px' }}>🌱</div>
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                  農鮮市集
                </Title>
              </Space>
              <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                連接農場與餐桌，提供最新鮮的台灣農產品。
              </Text>
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Title level={4} style={{ color: 'white' }}>快速連結</Title>
            <Space direction="vertical">
              <Button type="link" style={{ color: 'rgba(255,255,255,0.8)', padding: 0 }}>首頁</Button>
              <Button type="link" style={{ color: 'rgba(255,255,255,0.8)', padding: 0 }}>商品</Button>
              <Button type="link" style={{ color: 'rgba(255,255,255,0.8)', padding: 0 }}>關於我們</Button>
              <Button type="link" style={{ color: 'rgba(255,255,255,0.8)', padding: 0 }}>聯絡我們</Button>
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Title level={4} style={{ color: 'white' }}>客戶服務</Title>
            <Space direction="vertical">
              <Button type="link" style={{ color: 'rgba(255,255,255,0.8)', padding: 0 }}>常見問題</Button>
              <Button type="link" style={{ color: 'rgba(255,255,255,0.8)', padding: 0 }}>退換貨政策</Button>
              <Button type="link" style={{ color: 'rgba(255,255,255,0.8)', padding: 0 }}>配送資訊</Button>
              <Button type="link" style={{ color: 'rgba(255,255,255,0.8)', padding: 0 }}>隱私政策</Button>
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Title level={4} style={{ color: 'white' }}>聯絡資訊</Title>
            <Space direction="vertical">
              <Text style={{ color: 'rgba(255,255,255,0.8)' }}>電話：0800-123-456</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)' }}>郵箱：service@farmfresh.com.tw</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)' }}>地址：台北市中正區農業路123號</Text>
            </Space>
          </Col>
        </Row>
        <Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)' }}>
            &copy; 2025 農鮮市集. 版權所有.
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;