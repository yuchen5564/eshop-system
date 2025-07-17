import React, { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import ResponsiveHeader from './components/ui/ResponsiveHeader';
import Footer from './components/Footer';
import MobileBottomNavigation from './components/mobile/MobileBottomNavigation';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AdminApp from './admin/AdminApp';
import AlertNotification, { useAlerts } from './components/AlertNotification';
import LoginForm from './components/LoginForm';
import SystemInitPage from './components/SystemInitPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useResponsive } from './hooks/useBreakpoint';
import productService from './services/productService';
import categoryService from './services/categoryService';
import systemService from './services/systemService';

const { Content } = Layout;

const FarmEcommerce = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [systemInitialized, setSystemInitialized] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { alerts, addSuccessAlert, addRemoveAlert, removeAlert } = useAlerts();
  const { user, isAdminUser, loading: authLoading } = useAuth();
  const { isMobile } = useResponsive();

  useEffect(() => {
    if (!authLoading) {
      checkSystemAndLoadData();
    }
  }, [authLoading]);

  const checkSystemAndLoadData = async () => {
    setLoading(true);
    try {
      // 檢查系統是否已初始化
      const initStatus = await systemService.checkSystemInitialized();
      setSystemInitialized(initStatus.initialized);
      
      if (initStatus.initialized) {
        // 如果已初始化，載入數據
        await Promise.all([loadProducts(), loadCategories()]);
      }
    } catch (error) {
      console.error('檢查系統狀態失敗:', error);
      setSystemInitialized(false);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const result = await productService.getAll();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('載入商品失敗:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await categoryService.getActiveCategories();
      if (result.success) {
        const categoriesWithAll = [
          { id: 'all', name: '全部商品', icon: '🏠', color: '#1890ff' },
          ...result.data
        ];
        setCategories(categoriesWithAll);
      }
    } catch (error) {
      console.error('載入分類失敗:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const isActive = product.isActive !== false; // 只顯示上架商品，預設為true
    return matchesSearch && matchesCategory && isActive;
  });

  const addToCart = (product, quantity = 1) => {
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      const newQuantity = existing.quantity + quantity;
      setCart(prev => prev.map(item =>
        item.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      ));
      addSuccessAlert(product, true, newQuantity);
    } else {
      setCart(prev => [...prev, { ...product, quantity }]);
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
      if (!user) {
        // 如果沒有登入，顯示登入表單
        setShowLoginForm(true);
        return;
      }
      if (!isAdminUser) {
        message.error('您沒有管理員權限');
        return;
      }
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
    setAppliedCoupon(null);
    setDiscountAmount(0);
    message.success('訂單已成功提交，購物車已清空！');
  };

  const handleApplyCoupon = (coupon, discount) => {
    setAppliedCoupon(coupon);
    setDiscountAmount(discount);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSystemInitComplete = () => {
    setSystemInitialized(true);
    // 重新載入數據
    checkSystemAndLoadData();
  };

  const handleLoginSuccess = (user) => {
    setShowLoginForm(false);
    setIsAdminMode(true);
  };

  // 如果還在載入認證狀態，顯示載入中
  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>載入中...</div>
      </div>
    );
  }

  // 如果系統未初始化，顯示初始化頁面
  if (systemInitialized === false) {
    return <SystemInitPage onInitComplete={handleSystemInitComplete} />;
  }

  // 如果要顯示登入表單
  if (showLoginForm) {
    return <LoginForm 
      onLoginSuccess={handleLoginSuccess} 
      onBack={() => setShowLoginForm(false)}
    />;
  }

  // 如果是管理後台模式，檢查權限並顯示相應內容
  if (isAdminMode) {
    if (!user) {
      return <LoginForm 
        onLoginSuccess={handleLoginSuccess} 
        onBack={handleBackToSite}
      />;
    }
    if (!isAdminUser) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>您沒有管理員權限</div>
        </div>
      );
    }
    return <AdminApp onBackToSite={handleBackToSite} />;
  }

  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <AlertNotification 
        alerts={alerts} 
        onRemoveAlert={removeAlert} 
      />
      
      <ResponsiveHeader 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        cartItemsCount={getTotalItems()}
        cart={cart}
        onRemoveFromCart={removeFromCart}
        getTotalPrice={getTotalPrice}
      />

      <Content style={{ 
        width: '100%', 
        overflow: 'hidden',
        paddingBottom: isMobile ? '80px' : '0' // 為移動端底部導航留空間
      }}>
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
            appliedCoupon={appliedCoupon}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            discountAmount={discountAmount}
          />
        )}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'order-tracking' && <OrderTrackingPage />}
        {currentPage === 'checkout' && (
          <CheckoutPage 
            cart={cart}
            getTotalPrice={getTotalPrice}
            onPageChange={handlePageChange}
            onOrderComplete={handleOrderComplete}
            appliedCoupon={appliedCoupon}
            discountAmount={discountAmount}
          />
        )}
      </Content>

      {/* 桌面端顯示Footer，移動端顯示底部導航 */}
      {isMobile ? (
        <MobileBottomNavigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
          cartItemsCount={getTotalItems()}
        />
      ) : (
        <Footer />
      )}
    </Layout>
  );
};

// 主應用組件，包含AuthProvider包裝器
const App = () => {
  return (
    <AuthProvider>
      <FarmEcommerce />
    </AuthProvider>
  );
};

export default App;