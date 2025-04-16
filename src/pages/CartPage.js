// src/pages/CartPage.js
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Calculate totals whenever cart changes
  useEffect(() => {
    const calculateTotals = () => {
      const itemsSubtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      
      // Set shipping cost (free for orders over $100)
      const shippingCost = itemsSubtotal > 100 ? 0 : 10;
      
      // Calculate tax (8.5%)
      const taxAmount = itemsSubtotal * 0.085;
      
      // Calculate total
      const orderTotal = itemsSubtotal + shippingCost + taxAmount - discount;
      
      setSubtotal(itemsSubtotal);
      setShipping(shippingCost);
      setTax(taxAmount);
      setTotal(orderTotal);
    };
    
    calculateTotals();
  }, [cart, discount]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleApplyPromo = () => {
    // Reset previous messages
    setPromoError('');
    setPromoSuccess('');
    
    // Check if promo code is valid (example promo codes)
    if (promoCode === 'WELCOME20') {
      setDiscount(subtotal * 0.2);
      setPromoSuccess('20% discount applied successfully!');
    } else if (promoCode === 'FREESHIP') {
      setShipping(0);
      setPromoSuccess('Free shipping applied successfully!');
    } else {
      setPromoError('Invalid promo code. Please try again.');
    }
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate('/checkout');
  };

  return (
    <>
      <Header />
      <CartContainer>
        <PageTitle>Your Shopping Cart</PageTitle>
        
        {cart.length === 0 ? (
          <EmptyCartContainer>
            <EmptyCartIcon>
              <FiShoppingBag size={60} />
            </EmptyCartIcon>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <ContinueShoppingButton to="/products">
              Continue Shopping
            </ContinueShoppingButton>
          </EmptyCartContainer>
        ) : (
          <CartContent>
            <CartItemsSection>
              <CartHeader>
                <HeaderCell flex={3}>Product</HeaderCell>
                <HeaderCell flex={1}>Price</HeaderCell>
                <HeaderCell flex={1}>Quantity</HeaderCell>
                <HeaderCell flex={1}>Total</HeaderCell>
                <HeaderCell flex={0.5}></HeaderCell>
              </CartHeader>
              
              {cart.map((item) => (
                <CartItem 
                  key={`${item.id}-${item.size}-${item.color}`}
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ItemCell flex={3}>
                    <ItemImage src={item.image} alt={item.name} />
                    <ItemDetails>
                      <ItemName>{item.name}</ItemName>
                      <ItemMeta>
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </ItemMeta>
                    </ItemDetails>
                  </ItemCell>
                  
                  <ItemCell flex={1}>
                    <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                  </ItemCell>
                  
                  <ItemCell flex={1}>
                    <QuantitySelector>
                      <QuantityButton 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </QuantityButton>
                      <QuantityValue>{item.quantity}</QuantityValue>
                      <QuantityButton 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 10}
                      >
                        +
                      </QuantityButton>
                    </QuantitySelector>
                  </ItemCell>
                  
                  <ItemCell flex={1}>
                    <ItemTotal>${(item.price * item.quantity).toFixed(2)}</ItemTotal>
                  </ItemCell>
                  
                  <ItemCell flex={0.5}>
                    <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                      <FiTrash2 />
                    </RemoveButton>
                  </ItemCell>
                </CartItem>
              ))}
              
              <CartActions>
                <ContinueShopping to="/products">
                  <FiArrowLeft /> Continue Shopping
                </ContinueShopping>
                <ClearCartButton onClick={clearCart}>
                  Clear Cart
                </ClearCartButton>
              </CartActions>
            </CartItemsSection>
            
            <OrderSummarySection>
              <SummaryTitle>Order Summary</SummaryTitle>
              
              <PromoCodeSection>
                <PromoInput
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <PromoButton onClick={handleApplyPromo}>Apply</PromoButton>
              </PromoCodeSection>
              
              {promoError && <PromoError>{promoError}</PromoError>}
              {promoSuccess && <PromoSuccess>{promoSuccess}</PromoSuccess>}
              
              <SummaryDetails>
                <SummaryRow>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </SummaryRow>
                
                {discount > 0 && (
                  <SummaryRow>
                    <span>Discount</span>
                    <DiscountAmount>-${discount.toFixed(2)}</DiscountAmount>
                  </SummaryRow>
                )}
                
                <SummaryRow>
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </SummaryRow>
                
                <SummaryRow>
                  <span>Tax (8.5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </SummaryRow>
                
                <TotalRow>
                  <span>Total</span>
                  <TotalAmount>${total.toFixed(2)}</TotalAmount>
                </TotalRow>
              </SummaryDetails>
              
              <CheckoutButton onClick={handleCheckout}>
                Proceed to Checkout
              </CheckoutButton>
              
              <SecureCheckout>
                <span>🔒 Secure Checkout</span>
                <PaymentMethods>
                  <PaymentIcon src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" />
                  <PaymentIcon src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" />
                  <PaymentIcon src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" />
                  <PaymentIcon src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="American Express" />
                </PaymentMethods>
              </SecureCheckout>
            </OrderSummarySection>
          </CartContent>
        )}
      </CartContainer>
      <Footer />
    </>
  );
};

// Styled Components
const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-top: 4rem; /* Add this line to create space */
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  
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

const EmptyCartContainer = styled.div`
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

const EmptyCartIcon = styled.div`
  color: #ccc;
  margin-bottom: 1rem;
`;

const ContinueShoppingButton = styled(Link)`
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

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CartHeader = styled.div`
  display: flex;
  padding: 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
  font-weight: bold;
  
  @media (max-width: 600px) {
    display: none;
  }
`;

const HeaderCell = styled.div`
  flex: ${props => props.flex};
  padding: 0 0.5rem;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #eee;
  
  @media (max-width: 600px) {
    flex-wrap: wrap;
    position: relative;
  }
`;

const ItemCell = styled.div`
  flex: ${props => props.flex};
  padding: 0 0.5rem;
  
  @media (max-width: 600px) {
    flex: ${props => props.flex === 3 ? '100%' : '1'};
    margin-bottom: ${props => props.flex === 3 ? '1rem' : '0'};
    text-align: ${props => props.flex === 1 ? 'center' : 'left'};
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

const ItemDetails = styled.div`
  display: inline-block;
  vertical-align: top;
`;

const ItemName = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ItemMeta = styled.div`
  font-size: 0.9rem;
  color: #666;
  
  span {
    display: inline-block;
    margin-right: 1rem;
  }
`;

const ItemPrice = styled.div`
  font-weight: bold;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: fit-content;
  margin: 0 auto;
`;

const QuantityButton = styled.button`
  background: none;
  border: none;
  width: 30px;
  height: 30px;
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover {
    background-color: ${props => props.disabled ? 'transparent' : '#f5f5f5'};
  }
`;

const QuantityValue = styled.span`
  padding: 0 0.5rem;
  min-width: 30px;
  text-align: center;
`;

const ItemTotal = styled.div`
  font-weight: bold;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: #e53935;
  }
  
  @media (max-width: 600px) {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
`;

const CartActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ContinueShopping = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #000;
  text-decoration: none;
  font-weight: bold;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.7;
  }
`;

const ClearCartButton = styled.button`
  background: none;
  border: none;
  color: #e53935;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.7;
  }
`;

const OrderSummarySection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const PromoCodeSection = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const PromoInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const PromoButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #333;
  }
`;

const PromoError = styled.div`
  color: #e53935;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PromoSuccess = styled.div`
  color: #43a047;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const SummaryDetails = styled.div`
  margin-bottom: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DiscountAmount = styled.span`
  color: #e53935;
`;

const TotalRow = styled(SummaryRow)`
  font-weight: bold;
  font-size: 1.2rem;
  border-top: 2px solid #eee;
  margin-top: 0.5rem;
  padding-top: 1rem;
`;

const TotalAmount = styled.span`
  color: #000;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #333;
    transform: translateY(-2px);
  }
`;

const SecureCheckout = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  
  span {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const PaymentIcon = styled.img`
  width: 40px;
  height: 25px;
  object-fit: contain;
`;

export default CartPage;
