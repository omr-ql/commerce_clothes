// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import CartProvider from './context/CartContext';
import UserProvider from './context/UserContext';
import ScrollToTop from './utils/ScrollToTop';
import './assets/styles/main.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <UserProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
