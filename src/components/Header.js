// src/components/Header.js
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const location = useLocation();
  const { cart } = useContext(CartContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Handle scroll event to change header style when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location]);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (searchOpen) setSearchOpen(false);
  };
  
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };
  
  return (
    <HeaderContainer scrolled={isScrolled}>
      <HeaderContent>
        <LogoContainer>
          <Link to="/">
            <Logo>STYLISH</Logo>
          </Link>
        </LogoContainer>
        
        <NavContainer isOpen={mobileMenuOpen}>
          <CloseButton onClick={toggleMobileMenu}>
            <FiX size={24} />
          </CloseButton>
          
          <NavList>
            <NavItem active={location.pathname === '/'}>
              <NavLink to="/">Home</NavLink>
            </NavItem>
            <NavItem active={location.pathname === '/products'}>
              <NavLink to="/products">All Products</NavLink>
            </NavItem>
            <NavItem active={location.pathname.includes('/products') && location.search.includes('category=men')}>
              <NavLink to="/products?category=men">Men</NavLink>
            </NavItem>
            <NavItem active={location.pathname.includes('/products') && location.search.includes('category=women')}>
              <NavLink to="/products?category=women">Women</NavLink>
            </NavItem>
            <NavItem active={location.pathname.includes('/products') && location.search.includes('category=accessories')}>
              <NavLink to="/products?category=accessories">Accessories</NavLink>
            </NavItem>
            <NavItem active={location.pathname === '/sale'}>
              <NavLink to="/products?sale=true">
                <SaleTag>Sale</SaleTag>
              </NavLink>
            </NavItem>
          </NavList>
        </NavContainer>
        
        <ActionContainer>
          <ActionButton onClick={toggleSearch}>
            <FiSearch size={20} />
          </ActionButton>
          
          <ActionButton as={Link} to="/profile">
            <FiUser size={20} />
          </ActionButton>
          
          <ActionButton as={Link} to="/wishlist">
            <FiHeart size={20} />
          </ActionButton>
          
          <CartButton as={Link} to="/cart">
            <FiShoppingBag size={20} />
            {cartItemCount > 0 && <CartCount>{cartItemCount}</CartCount>}
          </CartButton>
          
          <MobileMenuButton onClick={toggleMobileMenu}>
            <FiMenu size={24} />
          </MobileMenuButton>
        </ActionContainer>
      </HeaderContent>
      
      <SearchContainer isOpen={searchOpen}>
        <SearchForm onSubmit={handleSearchSubmit}>
          <SearchInput 
            type="text" 
            placeholder="Search for products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton type="submit">
            <FiSearch size={18} />
          </SearchButton>
        </SearchForm>
      </SearchContainer>
      
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && <Overlay onClick={toggleMobileMenu} />}
    </HeaderContainer>
  );
};

// Styled Components
const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: ${props => props.scrolled ? 'white' : 'transparent'};
  box-shadow: ${props => props.scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  transition: all 0.3s ease;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LogoContainer = styled.div`
  flex: 1;
  
  @media (max-width: 768px) {
    flex: 0;
  }
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
  color: #000;
`;

const NavContainer = styled.nav`
  flex: 2;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${props => props.isOpen ? '0' : '-300px'};
    width: 280px;
    height: 100vh;
    background-color: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    z-index: 1001;
    padding: 2rem;
  }
`;

const CloseButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 1rem;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavList = styled.ul`
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 2rem;
  }
`;

const NavItem = styled.li`
  margin: 0 1.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 2px;
    background-color: #000;
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
  
  @media (max-width: 768px) {
    margin: 1rem 0;
    
    &::after {
      bottom: -2px;
    }
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #000;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SaleTag = styled.span`
  color: #e53935;
  font-weight: 600;
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  margin-left: 1.5rem;
  cursor: pointer;
  color: #000;
  position: relative;
  
  &:hover {
    opacity: 0.7;
  }
  
  @media (max-width: 768px) {
    margin-left: 1rem;
  }
`;

const CartButton = styled(ActionButton)`
  position: relative;
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #e53935;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  margin-left: 1rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const SearchContainer = styled.div`
  max-height: ${props => props.isOpen ? '60px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  background-color: white;
  border-top: ${props => props.isOpen ? '1px solid #eee' : 'none'};
`;

const SearchForm = styled.form`
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  padding: 0.75rem 2rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 4px 0 0 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const SearchButton = styled.button`
  background-color: #000;
  color: white;
  border: none;
  padding: 0 1rem;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  
  &:hover {
    background-color: #333;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

export default Header;
