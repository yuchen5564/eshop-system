import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

const SearchInput = ({ 
  placeholder = '搜尋...', 
  onSearch, 
  onChange,
  value,
  size = 'default',
  allowClear = true,
  style = {} 
}) => {
  return (
    <Search
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onSearch={onSearch}
      size={size}
      allowClear={allowClear}
      style={style}
      prefix={<SearchOutlined />}
    />
  );
};

export default SearchInput;