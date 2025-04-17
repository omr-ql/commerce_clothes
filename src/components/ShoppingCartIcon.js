import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';

// SVG icon for shopping cart
const CartSvg = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ShoppingCartIcon = ({ size = 24 }) => {
  const { cart } = useContext(CartContext);
  const [bounce, setBounce] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  
  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Trigger animation when cart count changes
  useEffect(() => {
    if (cartItemCount > prevCount) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 500);
      return () => clearTimeout(timer);
    }
    setPrevCount(cartItemCount);
  }, [cartItemCount, prevCount]);
  
  return (
    <CartIconContainer to="/cart">
      <IconWrapper bounce={bounce}>
        <CartSvg width={size} height={size} />
        
        <AnimatePresence>
          {cartItemCount > 0 && (
            <CartCount
              as={motion.div}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              key="count"
            >
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </CartCount>
          )}
        </AnimatePresence>
      </IconWrapper>
    </CartIconContainer>
  );
};

// Styled Components
const CartIconContainer = styled(Link)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  text-decoration: none;
`;

const IconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${props => props.bounce ? 'bounce 0.5s' : 'none'};
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const CartCount = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #e53935;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
`;

export default ShoppingCartIcon;
