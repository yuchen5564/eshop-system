import React from 'react';
import { Row, Col, Space } from 'antd';

const FilterBar = ({ 
  children, 
  style = {},
  gutter = [16, 16],
  justify = 'space-between',
  align = 'middle' 
}) => {
  return (
    <Row 
      gutter={gutter}
      justify={justify}
      align={align}
      style={{ 
        marginBottom: '16px', 
        padding: '16px',
        background: '#fff',
        borderRadius: '6px',
        ...style 
      }}
    >
      {children}
    </Row>
  );
};

FilterBar.Item = ({ children, span, ...props }) => (
  <Col span={span} {...props}>
    {children}
  </Col>
);

export default FilterBar;