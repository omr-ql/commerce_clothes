// src/pages/ProductsPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import FilterBar from '../components/FilterBar';

const ProductsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const saleParam = queryParams.get('sale') === 'true';
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: categoryParam || 'all',
    priceRange: [0, 500],
    sortBy: 'newest',
    onSale: saleParam || false,
  });
  
  useEffect(() => {
    // Mock data - replace with API call
    const mockProducts = [
      { id: 1, name: 'Summer Dress', price: 49.99, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', category: 'dresses', onSale: true, discount: 20 },
      { id: 2, name: 'Casual Jeans', price: 39.99, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', category: 'jeans', onSale: false },
      { id: 3, name: 'Cotton T-Shirt', price: 19.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', category: 'shirts', onSale: true, discount: 15 },
      { id: 4, name: 'Leather Jacket', price: 129.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', category: 'jackets', onSale: false },
      { id: 5, name: 'Floral Skirt', price: 35.99, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', category: 'skirts', onSale: false },
      { id: 6, name: 'Denim Jacket', price: 79.99, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', category: 'jackets', onSale: true, discount: 30 },
      { id: 7, name: 'Striped Shirt', price: 29.99, image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', category: 'shirts', onSale: false },
      { id: 8, name: 'Formal Dress', price: 89.99, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', category: 'dresses', onSale: false },
    ];
    
    setProducts(mockProducts);
  }, []);
  
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter(product => product.category === filters.category);
    }
    
    // Apply price range filter
    result = result.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );
    
    // Apply sale filter
    if (filters.onSale) {
      result = result.filter(product => product.onSale);
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        // Assuming newest is the default order in our mock data
        break;
    }
    
    setFilteredProducts(result);
  }, [filters, products]);
  
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  return (
    <>
      <Header />
      <PageContainer>
        <PageTitle>Our Collection</PageTitle>
        
        <ContentWrapper>
          <FilterBarWrapper>
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />
          </FilterBarWrapper>
          
          <ProductsWrapper>
            <ResultCount>{filteredProducts.length} products found</ResultCount>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductList products={filteredProducts} />
              </motion.div>
            </AnimatePresence>
            
            {filteredProducts.length === 0 && (
              <NoResults>
                <h3>No products found</h3>
                <p>Try adjusting your filters to find what you're looking for.</p>
              </NoResults>
            )}
          </ProductsWrapper>
        </ContentWrapper>
      </PageContainer>
      <Footer />
    </>
  );
};

// Styled Components
const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-top: 4rem; /* Add this line to create space */
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 60px;
    height: 3px;
    background-color: #000;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterBarWrapper = styled.div`
  @media (max-width: 768px) {
    order: 2;
  }
`;

const ProductsWrapper = styled.div`
  @media (max-width: 768px) {
    order: 1;
  }
`;

const ResultCount = styled.div`
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #666;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  
  h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  p {
    color: #666;
  }
`;

export default ProductsPage;
