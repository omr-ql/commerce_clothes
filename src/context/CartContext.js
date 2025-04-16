// src/context/CartContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create context
export const CartContext = createContext();

// Create provider component
export const CartProvider = ({ children }) => {
  // Initialize cart state from localStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Add item to cart
  const addToCart = (item) => {
    setCart(prevCart => {
      // Check if item already exists in cart (matching id, size, and color)
      const existingItemIndex = prevCart.findIndex(
        cartItem => 
          cartItem.id === item.id && 
          cartItem.size === item.size && 
          cartItem.color === item.color
      );
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + item.quantity
        };
        return updatedCart;
      } else {
        // Item doesn't exist, add new item
        return [...prevCart, item];
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };
  
  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
  };
  
  // Calculate cart totals
  const getCartTotals = () => {
    return cart.reduce(
      (totals, item) => {
        const itemTotal = item.price * item.quantity;
        return {
          subtotal: totals.subtotal + itemTotal,
          itemCount: totals.itemCount + item.quantity,
        };
      },
      { subtotal: 0, itemCount: 0 }
    );
  };
  
  // Context value
  const contextValue = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotals,
  };
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
