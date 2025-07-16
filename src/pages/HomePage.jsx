import React from 'react';
import { HeroSection, FeaturesSection, PopularProductsSection } from '../components/sections';

const HomePage = ({ products, onAddToCart, onPageChange }) => {
  return (
    <div>
      <HeroSection onPageChange={onPageChange} />
      <FeaturesSection />
      <PopularProductsSection 
        products={products}
        onAddToCart={onAddToCart}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default HomePage;