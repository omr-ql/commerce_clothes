// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { FiGrid, FiList, FiAlertCircle } from 'react-icons/fi';

const ProductList = ({ 
  products, 
  isLoading = false, 
  error = null,
  title = null,
  showViewOptions = true
}) => {
  const [viewMode, setViewMode] = useState('grid');
  const [columns, setColumns] = useState(4);
  
  // Adjust columns based on window width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setColumns(1);
      } else if (width < 900) {
        setColumns(2);
      } else if (width < 1200) {
        setColumns(3);
      } else {
        setColumns(4);
      }
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Loading state
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading products...</LoadingText>
      </LoadingContainer>
    );
  }
  
  // Error state
  if (error) {
    return (
      <ErrorContainer>
        <FiAlertCircle size={40} />
        <ErrorText>Error loading products: {error}</ErrorText>
      </ErrorContainer>
    );
  }
  
  // Empty state
  if (!products || products.length === 0) {
    return (
      <EmptyContainer>
        <EmptyIcon>
          <FiGrid size={40} />
        </EmptyIcon>
        <EmptyText>No products found</EmptyText>
        <EmptySubtext>Try adjusting your filters or search criteria</EmptySubtext>
      </EmptyContainer>
    );
  }
  
  return (
    <ProductListContainer>
      {title && <ListTitle>{title}</ListTitle>}
      
      {showViewOptions && (
        <ViewOptions>
          <ResultCount>{products.length} Products</ResultCount>
          <ViewModeButtons>
            <ViewModeButton 
              active={viewMode === 'grid'} 
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <FiGrid />
            </ViewModeButton>
            <ViewModeButton 
              active={viewMode === 'list'} 
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <FiList />
            </ViewModeButton>
          </ViewModeButtons>
        </ViewOptions>
      )}
      
      <AnimatePresence>
        {viewMode === 'grid' ? (
          <ProductGrid 
            columns={columns}
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {products.map(product => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </ProductGrid>
        ) : (
          <ProductListView
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {products.map(product => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductListItem product={product} />
              </motion.div>
            ))}
          </ProductListView>
        )}
      </AnimatePresence>
    </ProductListContainer>
  );
};

// List view version of the product card
const ProductListItem = ({ product }) => {
  const { addToCart } = React.useContext(require('../context/CartContext').CartContext);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Calculate discounted price if product is on sale
  const discountedPrice = product.onSale 
    ? product.price * (1 - product.discount / 100) 
    : null;
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add first available size or default to first size in array
    const defaultSize = product.sizes ? product.sizes[0] : 'M';
    
    addToCart({
      id: product.id,
      name: product.name,
      price: discountedPrice || product.price,
      image: product.image || product.images[0],
      size: defaultSize,
      color: product.colors ? product.colors[0] : null,
      quantity: 1
    });
  };
  
  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  return (
    <ListItemContainer>
      <ListItemImage>
        <img src={product.image || product.images[0]} alt={product.name} />
        {product.onSale && <SaleBadge>{product.discount}% OFF</SaleBadge>}
        {product.isNew && <NewBadge>NEW</NewBadge>}
      </ListItemImage>
      
      <ListItemContent>
        <ListItemCategory>{product.category}</ListItemCategory>
        <ListItemName to={`/product/${product.id}`}>{product.name}</ListItemName>
        
        <PriceContainer>
          {discountedPrice ? (
            <>
              <OriginalPrice>${product.price.toFixed(2)}</OriginalPrice>
              <CurrentPrice>${discountedPrice.toFixed(2)}</CurrentPrice>
            </>
          ) : (
            <CurrentPrice>${product.price.toFixed(2)}</CurrentPrice>
          )}
        </PriceContainer>
        
        {product.rating && (
          <RatingContainer>
            <Stars rating={product.rating} />
            {product.reviewCount && (
              <ReviewCount>({product.reviewCount})</ReviewCount>
            )}
          </RatingContainer>
        )}
        
        {product.description && (
          <ProductDescription>
            {product.description.length > 150 
              ? `${product.description.substring(0, 150)}...` 
              : product.description}
          </ProductDescription>
        )}
        
        {product.colors && (
          <ColorOptions>
            <ColorLabel>Colors:</ColorLabel>
            {product.colors.map((color, index) => (
              <ColorOption 
                key={index} 
                color={color.toLowerCase()}
                title={color}
              />
            ))}
          </ColorOptions>
        )}
        
        {product.sizes && (
          <SizeOptions>
            <SizeLabel>Sizes:</SizeLabel>
            {product.sizes.map((size, index) => (
              <SizeOption key={index}>{size}</SizeOption>
            ))}
          </SizeOptions>
        )}
      </ListItemContent>
      
      <ListItemActions>
        <ActionButton onClick={handleToggleFavorite} isFavorite={isFavorite}>
          {isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </ActionButton>
        <ActionButton primary onClick={handleAddToCart}>
          Add to Cart
        </ActionButton>
        <ViewDetailsButton to={`/product/${product.id}`}>
          View Details
        </ViewDetailsButton>
      </ListItemActions>
    </ListItemContainer>
  );
};

// Helper component for star ratings (same as in ProductCard)
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

// Styled Components
const ProductListContainer = styled.div`
  width: 100%;
`;

const ListTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const ViewOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const ResultCount = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ViewModeButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewModeButton = styled.button`
  background: ${props => props.active ? '#000' : '#fff'};
  color: ${props => props.active ? '#fff' : '#000'};
  border: 1px solid #000;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#333' : '#f5f5f5'};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ProductListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ListItemContainer = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: 1.5rem;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 900px) {
    grid-template-columns: 150px 1fr;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ListItemImage = styled.div`
  position: relative;
  height: 100%;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 600px) {
    height: 200px;
  }
`;

const ListItemContent = styled.div`
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 600px) {
    padding: 0 1.5rem;
  }
`;

const ListItemActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem;
  
  @media (max-width: 900px) {
    grid-column: 1 / span 2;
    flex-direction: row;
    padding-top: 0;
  }
  
  @media (max-width: 600px) {
    grid-column: 1;
    padding: 0 1.5rem 1.5rem;
  }
`;

const ListItemCategory = styled.div`
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const ListItemName = styled.a`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: #000;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProductDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin: 0.75rem 0;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.5rem;
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

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 0.5rem;
`;

const StarsContainer = styled.div`
  display: flex;
  color: #ffc107;
  font-size: 0.9rem;
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
  font-size: 0.8rem;
  color: #666;
`;

const ColorOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 0.75rem;
`;

const ColorLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const ColorOption = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 1px solid #ddd;
`;

const SizeOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 0.5rem;
`;

const SizeLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const SizeOption = styled.span`
  font-size: 0.8rem;
  padding: 2px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: ${props => props.primary ? '#000' : '#fff'};
  color: ${props => props.primary ? '#fff' : '#000'};
  border: 1px solid #000;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.primary ? '#333' : '#f5f5f5'};
    transform: translateY(-2px);
  }
  
  ${props => props.isFavorite && `
    background-color: #fff;
    color: #e53935;
    border-color: #e53935;
    
    &:hover {
      background-color: #ffebee;
    }
  `}
`;

const ViewDetailsButton = styled.a`
  padding: 0.75rem 1rem;
  background-color: #f5f5f5;
  color: #000;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e0e0e0;
    transform: translateY(-2px);
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

const NewBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #4caf50;
  color: white;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 4px;
`;

// Loading state components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #000;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #666;
`;

// Error state components
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: #fff3f3;
  border-radius: 8px;
  color: #e53935;
`;

const ErrorText = styled.p`
  margin-top: 1rem;
  text-align: center;
`;

// Empty state components
const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const EmptyIcon = styled.div`
  color: #ccc;
  margin-bottom: 1rem;
`;

const EmptyText = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
`;

const EmptySubtext = styled.p`
  color: #666;
  text-align: center;
`;

export default ProductList;
