import React from 'react';
import { Input, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const SearchFilter = ({ 
  searchValue,
  onSearchChange,
  onSearch,
  searchPlaceholder = '搜尋...',
  filters = [],
  style = {},
  searchStyle = {},
  filterStyle = {}
}) => {
  return (
    <Space style={{ width: '100%', ...style }}>
      <Search
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={onSearchChange}
        onSearch={onSearch}
        style={{ width: 300, ...searchStyle }}
        allowClear
      />
      
      {filters.map((filter, index) => (
        <Select
          key={index}
          value={filter.value}
          onChange={filter.onChange}
          style={{ width: 150, ...filterStyle }}
          placeholder={filter.placeholder}
        >
          {filter.options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      ))}
    </Space>
  );
};

export default SearchFilter;