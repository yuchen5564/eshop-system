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
import { useResponsive } from '../hooks/useBreakpoint';
import ResponsiveContainer from '../components/responsive/ResponsiveContainer';

const { Title } = Typography;

const ProductsPage = ({ 
  filteredProducts, 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onAddToCart 
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  const getGutter = () => {
    if (isMobile) return [16, 16];
    if (isTablet) return [20, 20];
    return [24, 24];
  };

  const getColSpan = () => {
    if (isMobile) return { xs: 24, sm: 12 };
    if (isTablet) return { xs: 24, sm: 12, md: 8 };
    return { xs: 24, sm: 12, md: 8, lg: 6 };
  };

  return (
    <div style={{ 
      padding: isMobile ? '20px 0' : isTablet ? '30px 0' : '40px 0', 
      width: '100%', 
      minHeight: 'calc(100vh - 200px)' 
    }}>
      <ResponsiveContainer>
        <Title 
          level={isMobile ? 3 : 2} 
          style={{ 
            textAlign: 'center', 
            marginBottom: isMobile ? '24px' : '40px' 
          }}
        >
          農產品商城
        </Title>
        
        {/* Category Filter */}
        <div style={{ 
          marginBottom: isMobile ? '24px' : '40px', 
          textAlign: 'center' 
        }}>
          <Space 
            size={isMobile ? "small" : "large"} 
            wrap
            style={{ 
              justifyContent: 'center',
              width: '100%'
            }}
          >
            {categories.map(category => (
              <Button
                key={category.id}
                type={selectedCategory === category.id ? 'primary' : 'default'}
                size={isMobile ? 'middle' : 'large'}
                onClick={() => onCategoryChange(category.id)}
                icon={category.id === 'all' ? <HomeOutlined /> : null}
                style={{
                  fontSize: isMobile ? '14px' : '16px',
                  height: isMobile ? '36px' : '40px'
                }}
              >
                {category.id !== 'all' && (
                  <span style={{ marginRight: '8px' }}>{category.icon}</span>
                )}
                {category.name}
              </Button>
            ))}
          </Space>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <Row gutter={getGutter()}>
            {filteredProducts.map(product => (
              <Col {...getColSpan()} key={product.id}>
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty 
            description="沒有找到相關商品" 
            style={{
              fontSize: isMobile ? '14px' : '16px',
              padding: isMobile ? '40px 20px' : '60px 40px'
            }}
          />
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ProductsPage;