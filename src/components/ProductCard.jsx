import React from 'react';
import { 
  Card, 
  Button, 
  Tag, 
  Rate, 
  Typography, 
  Space 
} from 'antd';
import {
  PlusOutlined,
  HeartOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const ProductCard = ({ product, onAddToCart }) => {
  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card
      hoverable
      style={{ height: '100%' }}
      cover={
        <div style={{ 
          height: '200px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '80px',
          background: '#f5f5f5'
        }}>
          {product.image}
        </div>
      }
      actions={[
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => onAddToCart(product)}
          size="large"
        >
          加入購物車
        </Button>
      ]}
    >
      <div style={{ position: 'relative' }}>
        {discount > 0 && (
          <Tag color="red" style={{ position: 'absolute', top: '-10px', right: '-10px' }}>
            -{discount}%
          </Tag>
        )}
        <HeartOutlined 
          style={{ 
            position: 'absolute', 
            top: '-10px', 
            right: '20px',
            fontSize: '20px',
            color: '#d9d9d9',
            cursor: 'pointer'
          }}
        />
      </div>
      
      <Meta 
        title={<Title level={4}>{product.name}</Title>}
        description={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Space>
              <EnvironmentOutlined />
              <Text type="secondary">{product.farm} • {product.location}</Text>
            </Space>
            
            <Space>
              <Rate disabled defaultValue={product.rating} allowHalf />
              <Text type="secondary">({product.reviews} 評價)</Text>
            </Space>
            
            <Paragraph ellipsis={{ rows: 2 }}>{product.description}</Paragraph>
            
            <Space size="middle">
              <Title level={3} type="success" style={{ margin: 0 }}>
                NT$ {product.price}
              </Title>
              {product.originalPrice > product.price && (
                <Text delete type="secondary">NT$ {product.originalPrice}</Text>
              )}
              <Text type="secondary">/ {product.unit}</Text>
            </Space>
            
            <Text type="secondary">庫存: {product.stock}</Text>
          </Space>
        }
      />
    </Card>
  );
};

export default ProductCard;