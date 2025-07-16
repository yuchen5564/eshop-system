import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

const SearchBar = ({ searchTerm, onSearchChange, placeholder = "搜尋農產品..." }) => {
  return (
    <Search
      placeholder={placeholder}
      size="large"
      value={searchTerm}
      onChange={onSearchChange}
      style={{ width: '100%' }}
    />
  );
};

export default SearchBar;