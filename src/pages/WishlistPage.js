// src/pages/WishlistPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, removeFromWishlist } = useContext(UserContext);
  const { addToCart } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(true);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/wishlist' } });
    } else {
      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);
  
  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };
  
  const handleAddToCart = (product) => {
    // Add first available size or default to first size in array
    const defaultSize = product.sizes ? product.sizes[0] : 'M';
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.onSale ? product.price * (1 - product.discount / 100) : product.price,
      image: product.image || product.images[0],
      size: defaultSize,
      color: product.colors ? product.colors[0] : null,
      quantity: 1
    });
  };
  
  // If loading
  if (isLoading) {
    return (
      <>
        <Header />
        <PageContainer>
          <LoadingContainer>
            <LoadingSpinner />
            <p>Loading your wishlist...</p>
          </LoadingContainer>
        </PageContainer>
        <Footer />
      </>
    );
  }
  
  // If wishlist is empty
  if (!user?.wishlist || user.wishlist.length === 0) {
    return (
      <>
        <Header />
        <PageContainer>
          <EmptyWishlistContainer>
            <EmptyWishlistIcon>
              <FiHeart size={60} />
            </EmptyWishlistIcon>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love to your wishlist and review them anytime.</p>
            <ShopNowButton to="/products">
              Start Shopping
            </ShopNowButton>
          </EmptyWishlistContainer>
        </PageContainer>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <PageContainer>
        <WishlistHeader>
          <h1>My Wishlist</h1>
          <p>{user.wishlist.length} {user.wishlist.length === 1 ? 'item' : 'items'}</p>
        </WishlistHeader>
        
        <WishlistContent>
          <AnimatePresence>
            {user.wishlist.map((product) => (
              <WishlistItem
                key={product.id}
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <ItemImage>
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image || product.images[0]} alt={product.name} />
                  </Link>
                  {product.onSale && (
                    <SaleBadge>{product.discount}% OFF</SaleBadge>
                  )}
                </ItemImage>
                
                <ItemDetails>
                  <ItemCategory>{product.category}</ItemCategory>
                  <ItemName to={`/product/${product.id}`}>
                    {product.name}
                  </ItemName>
                  
                  <PriceContainer>
                    {product.onSale ? (
                      <>
                        <OriginalPrice>${product.price.toFixed(2)}</OriginalPrice>
                        <CurrentPrice>
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </CurrentPrice>
                      </>
                    ) : (
                      <CurrentPrice>${product.price.toFixed(2)}</CurrentPrice>
                    )}
                  </PriceContainer>
                  
                  {product.inStock ? (
                    <InStockLabel>In Stock</InStockLabel>
                  ) : (
                    <OutOfStockLabel>Out of Stock</OutOfStockLabel>
                  )}
                </ItemDetails>
                
                <ItemActions>
                  <AddToCartButton 
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    <FiShoppingBag />
                    Add to Cart
                  </AddToCartButton>
                  
                  <RemoveButton onClick={() => handleRemoveFromWishlist(product.id)}>
                    <FiTrash2 />
                    Remove
                  </RemoveButton>
                </ItemActions>
              </WishlistItem>
            ))}
          </AnimatePresence>
        </WishlistContent>
        
        <WishlistFooter>
          <ContinueShoppingLink to="/products">
            Continue Shopping
          </ContinueShoppingLink>
          
          <ClearWishlistButton onClick={() => {
            if (window.confirm('Are you sure you want to clear your wishlist?')) {
              user.wishlist.forEach(product => removeFromWishlist(product.id));
            }
          }}>
            Clear Wishlist
          </ClearWishlistButton>
        </WishlistFooter>
      </PageContainer>
      <Footer />
    </>
  );
};

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 60vh;
`;

const WishlistHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
  }
`;

const WishlistContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const WishlistItem = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  padding: 1.5rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 150px 1fr;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ItemImage = styled.div`
  position: relative;
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const SaleBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #e53935;
  color: white;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 4px;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 600px) {
    padding: 1rem 0;
  }
`;

const ItemCategory = styled.div`
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const ItemName = styled(Link)`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: #000;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const CurrentPrice = styled.span`
  font-weight: bold;
  font-size: 1.1rem;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #999;
  font-size: 0.9rem;
`;

const InStockLabel = styled.div`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const OutOfStockLabel = styled.div`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ItemActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.75rem;
  
  @media (max-width: 900px) {
    grid-column: span 2;
    flex-direction: row;
  }
  
  @media (max-width: 600px) {
    grid-column: 1;
    padding-top: 0.5rem;
  }
`;

const AddToCartButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #333;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const RemoveButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: white;
  color: #e53935;
  border: 1px solid #e53935;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #ffebee;
  }
`;

const WishlistFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ContinueShoppingLink = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #000;
  border: 1px solid #000;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ClearWishlistButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: #e53935;
    border-color: #e53935;
  }
`;

// Empty Wishlist Components
const EmptyWishlistContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  
  h2 {
    margin: 1rem 0;
    font-size: 1.5rem;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const EmptyWishlistIcon = styled.div`
  color: #ccc;
  margin-bottom: 1rem;
`;

const ShopNowButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #000;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #333;
    transform: translateY(-2px);
  }
`;

// Loading Components
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

export default WishlistPage;
