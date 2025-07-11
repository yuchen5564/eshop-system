import React, { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminApp from './admin/AdminApp';
import AlertNotification, { useAlerts } from './components/AlertNotification';
import { mockProducts, categories } from './data/mockData';

const { Content } = Layout;

const FarmEcommerce = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { alerts, addSuccessAlert, addRemoveAlert, removeAlert } = useAlerts();

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      const newQuantity = existing.quantity + 1;
      setCart(prev => prev.map(item =>
        item.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      ));
      addSuccessAlert(product, true, newQuantity);
    } else {
      setCart(prev => [...prev, { ...product, quantity: 1 }]);
      addSuccessAlert(product, false);
    }
  };

  const removeFromCart = (productId) => {
    const item = cart.find(item => item.id === productId);
    setCart(prev => prev.filter(item => item.id !== productId));
    if (item) {
      addRemoveAlert(item);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };







  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    if (page === 'admin') {
      setIsAdminMode(true);
    } else {
      setCurrentPage(page);
    }
  };

  const handleBackToSite = () => {
    setIsAdminMode(false);
    setCurrentPage('home');
  };

  const handleOrderComplete = () => {
    setCart([]);
    message.success('訂單已成功提交，購物車已清空！');
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // 如果是管理後台模式，直接返回管理後台組件
  if (isAdminMode) {
    return <AdminApp onBackToSite={handleBackToSite} />;
  }

  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <AlertNotification 
        alerts={alerts} 
        onRemoveAlert={removeAlert} 
      />
      
      <Header 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        cartItemsCount={getTotalItems()}
        cart={cart}
        onRemoveFromCart={removeFromCart}
        getTotalPrice={getTotalPrice}
      />

      <Content style={{ width: '100%', overflow: 'hidden' }}>
        {currentPage === 'home' && (
          <HomePage 
            products={products}
            onAddToCart={addToCart}
            onPageChange={handlePageChange}
          />
        )}
        {currentPage === 'products' && (
          <ProductsPage 
            filteredProducts={filteredProducts}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onAddToCart={addToCart}
          />
        )}
        {currentPage === 'cart' && (
          <CartPage 
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            getTotalPrice={getTotalPrice}
            onPageChange={handlePageChange}
          />
        )}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'checkout' && (
          <CheckoutPage 
            cart={cart}
            getTotalPrice={getTotalPrice}
            onPageChange={handlePageChange}
            onOrderComplete={handleOrderComplete}
          />
        )}
      </Content>

      <Footer />
    </Layout>
  );
};

export default FarmEcommerce;