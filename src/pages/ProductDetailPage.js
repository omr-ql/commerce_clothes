// src/pages/ProductDetailPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiShare2 } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';

// Helper component for star ratings
const Stars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <StarsContainer>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) return <StarFull key={i} />;
        if (i === fullStars && hasHalfStar) return <StarHalf key={i} />;
        return <StarEmpty key={i} />;
      })}
    </StarsContainer>
  );
};

const ProductDetailPage = () => {
  // State management
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [mainImage, setMainImage] = useState(0);

  // Fetch product data
  useEffect(() => {
    // Mock API call - replace with actual API
    setTimeout(() => {
      // Mock product data
      const mockProduct = {
        id: parseInt(id),
        name: 'Premium Cotton T-Shirt',
        price: 29.99,
        discount: 10,
        onSale: true,
        description: 'This premium cotton t-shirt is perfect for everyday wear. Made from 100% organic cotton, it offers exceptional comfort and durability.',
        details: 'Fabric: 100% Organic Cotton\nFit: Regular\nCare: Machine wash cold, tumble dry low\nImported',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Navy', 'Gray'],
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          'https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          'https://images.unsplash.com/photo-1503342394128-c104d54dba01?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        ],
        reviews: [
          { id: 1, user: 'Sarah M.', rating: 5, comment: 'Love this shirt! The material is so soft and comfortable.', date: '2023-04-10' },
          { id: 2, user: 'John D.', rating: 4, comment: 'Great quality, but runs a bit small.', date: '2023-03-22' },
          { id: 3, user: 'Emily R.', rating: 5, comment: 'Perfect fit and very comfortable. Will buy more colors!', date: '2023-02-15' },
        ],
        rating: 4.7,
        reviewCount: 124,
        inStock: true,
      };
      
      setProduct(mockProduct);
      setSelectedColor(mockProduct.colors[0]);
      setLoading(false);
    }, 800);
  }, [id]);

  // Event handlers
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.onSale ? product.price * (1 - product.discount / 100) : product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    
    navigate('/cart');
  };
  
  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Conditional rendering
  if (loading) {
    return (
      <>
        <Header />
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading product details...</p>
        </LoadingContainer>
        <Footer />
      </>
    );
  }
  
  if (!product) {
    return (
      <>
        <Header />
        <ErrorContainer>
          <h2>Product Not Found</h2>
          <p>Sorry, the product you are looking for does not exist.</p>
          <BackButton onClick={() => navigate('/products')}>
            Back to Products
          </BackButton>
        </ErrorContainer>
        <Footer />
      </>
    );
  }
  
  // Calculate discounted price if product is on sale
  const discountedPrice = product.onSale 
    ? product.price * (1 - product.discount / 100) 
    : null;
  
  // Main render
  return (
    <>
      <Header />
      <ProductContainer>
        <Breadcrumbs>
          <BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink> / 
          <BreadcrumbLink onClick={() => navigate('/products')}>Products</BreadcrumbLink> / 
          <span>{product.name}</span>
        </Breadcrumbs>
        
        <ProductLayout>
          {/* Product Images Section */}
          <ProductImagesSection>
            <MainImageContainer>
              <MainImage 
                src={product.images[mainImage]} 
                alt={product.name}
                as={motion.img}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              {product.onSale && (
                <SaleBadge>SALE {product.discount}% OFF</SaleBadge>
              )}
            </MainImageContainer>
            
            <ThumbnailContainer>
              {product.images.map((image, index) => (
                <Thumbnail 
                  key={index}
                  src={image} 
                  alt={`${product.name} thumbnail ${index + 1}`}
                  active={mainImage === index}
                  onClick={() => setMainImage(index)}
                />
              ))}
            </ThumbnailContainer>
          </ProductImagesSection>
          
          {/* Product Info Section */}
          <ProductInfoSection>
            <ProductName>{product.name}</ProductName>
            
            <PriceContainer>
              {product.onSale ? (
                <>
                  <OriginalPrice>${product.price.toFixed(2)}</OriginalPrice>
                  <CurrentPrice>${discountedPrice.toFixed(2)}</CurrentPrice>
                </>
              ) : (
                <CurrentPrice>${product.price.toFixed(2)}</CurrentPrice>
              )}
            </PriceContainer>
            
            <RatingContainer>
              <Stars rating={product.rating} />
              <ReviewCount>{product.reviewCount} reviews</ReviewCount>
            </RatingContainer>
            
            <ColorSection>
              <SectionTitle>Color: {selectedColor}</SectionTitle>
              <ColorOptions>
                {product.colors.map(color => (
                  <ColorOption 
                    key={color}
                    color={color.toLowerCase()}
                    selected={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </ColorOptions>
            </ColorSection>
            
            <SizeSection>
              <SectionTitle>Size:</SectionTitle>
              <SizeOptions>
                {product.sizes.map(size => (
                  <SizeOption 
                    key={size}
                    selected={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </SizeOption>
                ))}
              </SizeOptions>
            </SizeSection>
            
            <QuantitySection>
              <SectionTitle>Quantity:</SectionTitle>
              <QuantitySelector>
                <QuantityButton onClick={() => handleQuantityChange(-1)}>-</QuantityButton>
                <QuantityValue>{quantity}</QuantityValue>
                <QuantityButton onClick={() => handleQuantityChange(1)}>+</QuantityButton>
              </QuantitySelector>
            </QuantitySection>
            
            <ActionButtons>
              <AddToCartButton onClick={handleAddToCart}>
                <FiShoppingBag /> Add to Cart
              </AddToCartButton>
              <WishlistButton>
                <FiHeart /> Wishlist
              </WishlistButton>
              <ShareButton>
                <FiShare2 /> Share
              </ShareButton>
            </ActionButtons>
            
            <ProductAvailability available={product.inStock}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </ProductAvailability>
          </ProductInfoSection>
        </ProductLayout>
        
        {/* Product Tabs Section */}
        <ProductTabs>
          <TabButtons>
            <TabButton 
              active={activeTab === 'description'} 
              onClick={() => setActiveTab('description')}
            >
              Description
            </TabButton>
            <TabButton 
              active={activeTab === 'details'} 
              onClick={() => setActiveTab('details')}
            >
              Details
            </TabButton>
            <TabButton 
              active={activeTab === 'reviews'} 
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviews.length})
            </TabButton>
          </TabButtons>
          
          <TabContent>
            {activeTab === 'description' && (
              <TabPanel>
                <p>{product.description}</p>
              </TabPanel>
            )}
            
            {activeTab === 'details' && (
              <TabPanel>
                <pre>{product.details}</pre>
              </TabPanel>
            )}
            
            {activeTab === 'reviews' && (
              <TabPanel>
                <ReviewsContainer>
                  {product.reviews.map(review => (
                    <ReviewCard key={review.id}>
                      <ReviewHeader>
                        <ReviewUser>{review.user}</ReviewUser>
                        <ReviewDate>{review.date}</ReviewDate>
                      </ReviewHeader>
                      <Stars rating={review.rating} />
                      <ReviewComment>{review.comment}</ReviewComment>
                    </ReviewCard>
                  ))}
                </ReviewsContainer>
              </TabPanel>
            )}
          </TabContent>
        </ProductTabs>
      </ProductContainer>
      <Footer />
    </>
  );
};

// Styled Components - Grouped by section
// Layout Components
const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Breadcrumb Components
const Breadcrumbs = styled.div`
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #666;
`;

const BreadcrumbLink = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  margin: 0 0.5rem;
  &:first-child {
    margin-left: 0;
  }
`;

// Product Images Components
const ProductImagesSection = styled.div``;

const MainImageContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
`;

const MainImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 8px;
`;

const SaleBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: #e53935;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#000' : 'transparent'};
  opacity: ${props => props.active ? 1 : 0.7};
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

// Product Info Components
const ProductInfoSection = styled.div``;

const ProductName = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CurrentPrice = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
`;

const OriginalPrice = styled.span`
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
  margin-right: 1rem;
`;

// Rating Components
const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StarsContainer = styled.div`
  display: flex;
  color: #ffc107;
`;

const StarFull = styled.div`
  &:before {
    content: "★";
  }
`;

const StarHalf = styled.div`
  &:before {
    content: "★";
    clip-path: inset(0 50% 0 0);
  }
`;

const StarEmpty = styled.div`
  &:before {
    content: "☆";
  }
`;

const ReviewCount = styled.span`
  margin-left: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

// Section Components
const SectionTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

// Color Selection Components
const ColorSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ColorOption = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color};
  cursor: pointer;
  border: 2px solid ${props => props.selected ? '#000' : 'transparent'};
  box-shadow: ${props => props.selected ? '0 0 0 2px white inset' : 'none'};
`;

// Size Selection Components
const SizeSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SizeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SizeOption = styled.div`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.selected ? '#000' : '#ddd'};
  background-color: ${props => props.selected ? '#000' : 'white'};
  color: ${props => props.selected ? 'white' : '#000'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #000;
  }
`;

// Quantity Selection Components
const QuantitySection = styled.div`
  margin-bottom: 1.5rem;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  width: fit-content;
`;

const QuantityButton = styled.button`
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const QuantityValue = styled.span`
  padding: 0 1rem;
  min-width: 40px;
  text-align: center;
`;

// Action Button Components
const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AddToCartButton = styled.button`
  flex: 2;
  padding: 1rem;
  background-color: #000;
  color: white;
  border: none;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #333;
  }
`;

const WishlistButton = styled.button`
  flex: 1;
  padding: 1rem;
  background-color: white;
  color: #000;
  border: 1px solid #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ShareButton = styled.button`
  flex: 1;
  padding: 1rem;
  background-color: white;
  color: #000;
  border: 1px solid #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ProductAvailability = styled.div`
  padding: 0.5rem 1rem;
  background-color: ${props => props.available ? '#e8f5e9' : '#ffebee'};
  color: ${props => props.available ? '#2e7d32' : '#c62828'};
  border-radius: 4px;
  display: inline-block;
  font-weight: bold;
  font-size: 0.9rem;
`;

// Tab Components
const ProductTabs = styled.div`
  margin-top: 3rem;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
`;

const TabButton = styled.button`
  padding: 1rem 2rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#000' : 'transparent'};
  color: ${props => props.active ? '#000' : '#666'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: #000;
  }
`;

const TabContent = styled.div`
  padding: 2rem 0;
`;

const TabPanel = styled.div`
  line-height: 1.6;
  
  p {
    margin-bottom: 1rem;
  }
  
  pre {
    white-space: pre-wrap;
    font-family: inherit;
  }
`;

// Review Components
const ReviewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewCard = styled.div`
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ReviewUser = styled.span`
  font-weight: bold;
`;

const ReviewDate = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const ReviewComment = styled.p`
  margin-top: 0.5rem;
`;

// Loading and Error Components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  
  p {
    margin-top: 1rem;
    color: #666;
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #000;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  
  h2 {
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #000;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #333;
  }
`;

export default ProductDetailPage;
