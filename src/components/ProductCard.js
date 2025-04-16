// src/components/ProductCard.js
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [isHovered, setIsHovered] = useState(false);
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
    // Here you would typically call a function to add/remove from wishlist
  };
  
  return (
    <CardContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      as={motion.div}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/product/${product.id}`}>
        <ImageContainer>
          <ProductImage 
            src={product.image || product.images[0]} 
            alt={product.name}
          />
          
          {product.onSale && (
            <SaleBadge>
              {product.discount}% OFF
            </SaleBadge>
          )}
          
          {product.isNew && (
            <NewBadge>
              NEW
            </NewBadge>
          )}
          
          <ActionButtons isVisible={isHovered}>
            <ActionButton onClick={handleToggleFavorite}>
              <FiHeart fill={isFavorite ? "#e53935" : "none"} color={isFavorite ? "#e53935" : "white"} />
            </ActionButton>
            <ActionButton onClick={handleAddToCart}>
              <FiShoppingBag />
            </ActionButton>
            <ActionButton as={Link} to={`/product/${product.id}`}>
              <FiEye />
            </ActionButton>
          </ActionButtons>
        </ImageContainer>
        
        <ProductInfo>
          <ProductCategory>{product.category}</ProductCategory>
          <ProductName>{product.name}</ProductName>
          
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
          
          {product.colors && (
            <ColorOptions>
              {product.colors.map((color, index) => (
                <ColorOption 
                  key={index} 
                  color={color.toLowerCase()}
                  title={color}
                />
              ))}
            </ColorOptions>
          )}
        </ProductInfo>
      </Link>
    </CardContainer>
  );
};

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

// Styled Components
const CardContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 3/4;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
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
  left: ${props => props.theme.onSale ? '80px' : '10px'};
  background-color: #4caf50;
  color: white;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 4px;
`;

const ActionButtons = styled.div`
  position: absolute;
  bottom: ${props => props.isVisible ? '10px' : '-50px'};
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  transition: bottom 0.3s ease;
`;

const ActionButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #000;
    transform: translateY(-3px);
  }
`;

const ProductInfo = styled.div`
  padding: 15px;
`;

const ProductCategory = styled.div`
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 5px;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const CurrentPrice = styled.span`
  font-weight: bold;
  font-size: 1rem;
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
  margin-bottom: 8px;
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
  gap: 5px;
`;

const ColorOption = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 1px solid #ddd;
`;

export default ProductCard;
