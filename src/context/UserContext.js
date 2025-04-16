// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create context
export const UserContext = createContext();

// Create provider component
export const UserProvider = ({ children }) => {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Initialize authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('user');
      localStorage.setItem('isAuthenticated', 'false');
    }
  }, [user, isAuthenticated]);
  
  // Login function
  const login = async (email, password) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login with mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: email,
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        phoneNumber: '555-123-4567',
        wishlist: [],
        orders: [
          {
            id: 'ORD-123456',
            date: '2023-04-15',
            total: 129.99,
            status: 'Delivered',
            items: [
              { id: 1, name: 'Summer Dress', quantity: 1, price: 49.99 },
              { id: 4, name: 'Leather Jacket', quantity: 1, price: 79.99 }
            ]
          },
          {
            id: 'ORD-789012',
            date: '2023-03-22',
            total: 59.98,
            status: 'Processing',
            items: [
              { id: 3, name: 'Cotton T-Shirt', quantity: 2, price: 19.99 },
              { id: 7, name: 'Striped Shirt', quantity: 1, price: 29.99 }
            ]
          }
        ]
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };
  
  // Register function
  const register = async (userData) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful registration
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock new user data
      const newUser = {
        id: Math.floor(Math.random() * 1000) + 1,
        ...userData,
        wishlist: [],
        orders: []
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };
  
  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful update
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        ...updatedData
      };
      
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message || 'Update failed' };
    }
  };
  
  // Add item to wishlist
  const addToWishlist = (product) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    setUser(prevUser => {
      // Check if item already exists in wishlist
      const existingItem = prevUser.wishlist.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevUser; // Item already in wishlist
      } else {
        // Add item to wishlist
        return {
          ...prevUser,
          wishlist: [...prevUser.wishlist, product]
        };
      }
    });
    
    return { success: true };
  };
  
  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    setUser(prevUser => ({
      ...prevUser,
      wishlist: prevUser.wishlist.filter(item => item.id !== productId)
    }));
    
    return { success: true };
  };
  
  // Context value
  const contextValue = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    addToWishlist,
    removeFromWishlist
  };
  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
