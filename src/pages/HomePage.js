// src/pages/HomePage.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = React.useState([]);
  
  useEffect(() => {
    // Mock data - replace with API call
    setFeaturedProducts([
      { id: 1, name: 'Summer Dress', price: 49.99, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', category: 'dresses' },
      { id: 2, name: 'Casual Jeans', price: 39.99, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', category: 'jeans' },
      { id: 3, name: 'Cotton T-Shirt', price: 19.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', category: 'shirts' },
      { id: 4, name: 'Leather Jacket', price: 129.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', category: 'jackets' },
    ]);
  }, []);

  return (
    <>
      <Header />
      <HeroSection>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1>Elevate Your Style</h1>
          <p>Discover the latest trends in fashion</p>
          <ShopNowButton to="/products">Shop Now</ShopNowButton>
        </motion.div>
      </HeroSection>
      
      <FeaturedSection>
        <SectionTitle>Featured Collection</SectionTitle>
        <ProductGrid>
          {featuredProducts.map(product => (
            <motion.div 
              key={product.id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </ProductGrid>
        <ViewAllButton to="/products">View All Products</ViewAllButton>
      </FeaturedSection>
      
      <CategoriesSection>
        <SectionTitle>Shop By Category</SectionTitle>
        <CategoryGrid>
          <CategoryCard to="/products?category=women">
            <CategoryImage src="https://images.unsplash.com/photo-1525845859779-54d477ff291f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" alt="Women's Clothing" />
            <CategoryName>Women</CategoryName>
          </CategoryCard>
          <CategoryCard to="/products?category=men">
            <CategoryImage src="https://images.unsplash.com/photo-1505022610485-0249ba5b3675?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" alt="Men's Clothing" />
            <CategoryName>Men</CategoryName>
          </CategoryCard>
          <CategoryCard to="/products?category=accessories">
            <CategoryImage src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" alt="Accessories" />
            <CategoryName>Accessories</CategoryName>
          </CategoryCard>
        </CategoryGrid>
      </CategoriesSection>
      
      <PromotionSection>
        <PromotionContent>
          <h2>Summer Sale</h2>
          <p>Up to 50% off on selected items</p>
          <PromotionButton to="/products?sale=true">Shop Sale</PromotionButton>
        </PromotionContent>
      </PromotionSection>
      
      <Footer />
    </>
  );
};

// Styled Components
const HeroSection = styled.section`
  height: 80vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  
  h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const ShopNowButton = styled(Link)`
  background-color: white;
  color: black;
  padding: 12px 30px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f8f8f8;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FeaturedSection = styled.section`
  padding: 5rem 2rem;
  text-align: center;
  background-color: #f9f9f9;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  position: relative;
  display: inline-block;
  
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

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ViewAllButton = styled(Link)`
  display: inline-block;
  margin-top: 3rem;
  padding: 12px 30px;
  border: 2px solid #000;
  color: #000;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #000;
    color: white;
  }
`;

const CategoriesSection = styled.section`
  padding: 5rem 2rem;
  text-align: center;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CategoryCard = styled(Link)`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  height: 400px;
  text-decoration: none;
  color: white;
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const CategoryName = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const PromotionSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
  background-size: cover;
  background-position: center;
  padding: 5rem 2rem;
  text-align: center;
  color: white;
`;

const PromotionContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  
  h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const PromotionButton = styled(Link)`
  background-color: white;
  color: black;
  padding: 12px 30px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f8f8f8;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

export default HomePage;