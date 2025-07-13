import React from 'react';
import { 
  Row, 
  Col, 
  Typography, 
  Button, 
  Space,
  Empty
} from 'antd';
import {
  HomeOutlined
} from '@ant-design/icons';
import ProductCard from '../components/ProductCard';

const { Title } = Typography;

const ProductsPage = ({ 
  filteredProducts, 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onAddToCart 
}) => {
  return (
    <div style={{ padding: '40px 0', width: '100%', minHeight: 'calc(100vh - 200px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
          農產品商城
        </Title>
        
        {/* Category Filter */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <Space size="large" wrap>
            {categories.map(category => (
              <Button
                key={category.id}
                type={selectedCategory === category.id ? 'primary' : 'default'}
                size="large"
                onClick={() => onCategoryChange(category.id)}
                icon={category.id === 'all' ? <HomeOutlined /> : null}
              >
                {category.id !== 'all' && <span style={{ marginRight: '8px' }}>{category.icon}</span>}
                {category.name}
              </Button>
            ))}
          </Space>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <Row gutter={[24, 24]}>
            {filteredProducts.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="沒有找到相關商品" />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;