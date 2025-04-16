// src/pages/CheckoutPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShoppingBag, FiCreditCard, FiLock } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || 'United States',
    phoneNumber: user?.phoneNumber || '',
    saveInfo: true,
  });
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  
  // Order summary states
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  
  // Form validation
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Calculate order totals whenever cart changes
  useEffect(() => {
    if (cart.length === 0 && !orderCompleted) {
      navigate('/cart');
      return;
    }
    
    const itemsSubtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    
    // Set shipping cost (free for orders over $100)
    const shippingCost = itemsSubtotal > 100 ? 0 : 10;
    
    // Calculate tax (8.5%)
    const taxAmount = itemsSubtotal * 0.085;
    
    // Calculate total
    const orderTotal = itemsSubtotal + shippingCost + taxAmount;
    
    setSubtotal(itemsSubtotal);
    setShipping(shippingCost);
    setTax(taxAmount);
    setTotal(orderTotal);
  }, [cart, navigate, orderCompleted]);
  
  // Validate form on input change
  useEffect(() => {
    validateForm();
  }, [formData, cardInfo, paymentMethod]);
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate shipping info
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    
    // Validate payment info if credit card is selected
    if (paymentMethod === 'credit-card') {
      if (!cardInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!cardInfo.cardName.trim()) newErrors.cardName = 'Name on card is required';
      if (!cardInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!cardInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
    }
    
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardInfo({
      ...cardInfo,
      [name]: value,
    });
  };
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      document.getElementsByName(firstErrorField)[0].focus();
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call to process payment and create order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a random order ID
      const generatedOrderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setOrderId(generatedOrderId);
      
      // Clear cart and set order as completed
      clearCart();
      setOrderCompleted(true);
      
      // Save user info if checkbox is checked
      if (formData.saveInfo) {
        // In a real app, you would save this to user profile in database
        console.log('Saving user info for future checkouts');
      }
    } catch (error) {
      console.error('Error processing order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // If order is completed, show order confirmation
  if (orderCompleted) {
    return (
      <>
        <Header />
        <OrderConfirmationContainer>
          <ConfirmationIcon>
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" stroke="#4CAF50" strokeWidth="4"/>
              <path d="M30 50L45 65L70 35" stroke="#4CAF50" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ConfirmationIcon>
          <h1>Order Confirmed!</h1>
          <p>Your order has been placed successfully.</p>
          <OrderDetails>
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ${total.toFixed(2)}</p>
            <p><strong>Shipping Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zipCode}</p>
          </OrderDetails>
          <p>A confirmation email has been sent to {formData.email}</p>
          <ButtonGroup>
            <ContinueShoppingButton to="/products">
              Continue Shopping
            </ContinueShoppingButton>
            <ViewOrderButton to="/profile/orders">
              View My Orders
            </ViewOrderButton>
          </ButtonGroup>
        </OrderConfirmationContainer>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <CheckoutContainer>
        <CheckoutTitle>Checkout</CheckoutTitle>
        
        <BackToCartLink onClick={() => navigate('/cart')}>
          <FiArrowLeft /> Back to Cart
        </BackToCartLink>
        
        <CheckoutContent>
          <CheckoutForm onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>
                <SectionNumber>1</SectionNumber>
                Shipping Information
              </SectionTitle>
              
              <FormRow>
                <FormGroup half>
                  <FormLabel htmlFor="firstName">First Name</FormLabel>
                  <FormInput
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                  />
                  {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup half>
                  <FormLabel htmlFor="lastName">Last Name</FormLabel>
                  <FormInput
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                  />
                  {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="address">Street Address</FormLabel>
                <FormInput
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={errors.address}
                />
                {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
              </FormGroup>
              
              <FormRow>
                <FormGroup half>
                  <FormLabel htmlFor="city">City</FormLabel>
                  <FormInput
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={errors.city}
                  />
                  {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup half>
                  <FormLabel htmlFor="state">State</FormLabel>
                  <FormInput
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    error={errors.state}
                  />
                  {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup half>
                  <FormLabel htmlFor="zipCode">ZIP Code</FormLabel>
                  <FormInput
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    error={errors.zipCode}
                  />
                  {errors.zipCode && <ErrorMessage>{errors.zipCode}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup half>
                  <FormLabel htmlFor="country">Country</FormLabel>
                  <FormSelect
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                  </FormSelect>
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                <FormInput
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  error={errors.phoneNumber}
                />
                {errors.phoneNumber && <ErrorMessage>{errors.phoneNumber}</ErrorMessage>}
              </FormGroup>
              
              <FormCheckbox>
                <input
                  type="checkbox"
                  id="saveInfo"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleInputChange}
                />
                <label htmlFor="saveInfo">Save this information for next time</label>
              </FormCheckbox>
            </FormSection>
            
            <FormSection>
              <SectionTitle>
                <SectionNumber>2</SectionNumber>
                Payment Method
              </SectionTitle>
              
              <PaymentMethods>
                <PaymentMethod
                  selected={paymentMethod === 'credit-card'}
                  onClick={() => handlePaymentMethodChange('credit-card')}
                >
                  <FiCreditCard />
                  <span>Credit Card</span>
                </PaymentMethod>
                
                <PaymentMethod
                  selected={paymentMethod === 'paypal'}
                  onClick={() => handlePaymentMethodChange('paypal')}
                >
                  <span className="paypal-icon">PayPal</span>
                </PaymentMethod>
                
                <PaymentMethod
                  selected={paymentMethod === 'apple-pay'}
                  onClick={() => handlePaymentMethodChange('apple-pay')}
                >
                  <span className="apple-pay-icon">Apple Pay</span>
                </PaymentMethod>
              </PaymentMethods>
              
              {paymentMethod === 'credit-card' && (
                <CreditCardForm>
                  <FormGroup>
                    <FormLabel htmlFor="cardNumber">Card Number</FormLabel>
                    <FormInput
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardInfo.cardNumber}
                      onChange={handleCardInputChange}
                      error={errors.cardNumber}
                    />
                    {errors.cardNumber && <ErrorMessage>{errors.cardNumber}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="cardName">Name on Card</FormLabel>
                    <FormInput
                      type="text"
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      value={cardInfo.cardName}
                      onChange={handleCardInputChange}
                      error={errors.cardName}
                    />
                    {errors.cardName && <ErrorMessage>{errors.cardName}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormRow>
                    <FormGroup half>
                      <FormLabel htmlFor="expiryDate">Expiry Date</FormLabel>
                      <FormInput
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={cardInfo.expiryDate}
                        onChange={handleCardInputChange}
                        error={errors.expiryDate}
                      />
                      {errors.expiryDate && <ErrorMessage>{errors.expiryDate}</ErrorMessage>}
                    </FormGroup>
                    
                    <FormGroup half>
                      <FormLabel htmlFor="cvv">CVV</FormLabel>
                      <FormInput
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={cardInfo.cvv}
                        onChange={handleCardInputChange}
                        error={errors.cvv}
                      />
                      {errors.cvv && <ErrorMessage>{errors.cvv}</ErrorMessage>}
                    </FormGroup>
                  </FormRow>
                </CreditCardForm>
              )}
              
              {paymentMethod === 'paypal' && (
                <PaymentInstructions>
                  <p>You will be redirected to PayPal to complete your payment after reviewing your order.</p>
                </PaymentInstructions>
              )}
              
              {paymentMethod === 'apple-pay' && (
                <PaymentInstructions>
                  <p>You will be prompted to confirm your payment with Apple Pay after placing your order.</p>
                </PaymentInstructions>
              )}
              
              <SecurePaymentNote>
                <FiLock /> Your payment information is secure and encrypted
              </SecurePaymentNote>
            </FormSection>
            
            <PlaceOrderButton
              type="submit"
              disabled={!isFormValid || isProcessing}
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner /> Processing...
                </>
              ) : (
                'Place Order'
              )}
            </PlaceOrderButton>
          </CheckoutForm>
          
          <OrderSummary>
            <SummaryTitle>Order Summary</SummaryTitle>
            
            <SummaryItems>
              {cart.map((item) => (
                <SummaryItem key={`${item.id}-${item.size}-${item.color}`}>
                  <ItemImageContainer>
                    <ItemQuantity>{item.quantity}</ItemQuantity>
                    <ItemImage src={item.image} alt={item.name} />
                  </ItemImageContainer>
                  <ItemDetails>
                    <ItemName>{item.name}</ItemName>
                    <ItemMeta>
                      {item.color && <span>Color: {item.color}</span>}
                      {item.size && <span>Size: {item.size}</span>}
                    </ItemMeta>
                    <ItemPrice>${(item.price * item.quantity).toFixed(2)}</ItemPrice>
                  </ItemDetails>
                </SummaryItem>
              ))}
            </SummaryItems>
            
            <SummaryDivider />
            
            <SummaryDetails>
              <SummaryRow>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </SummaryRow>
              
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
            
            <AcceptedPaymentMethods>
              <span>We Accept:</span>
              <PaymentIcons>
                <PaymentIcon src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" />
                <PaymentIcon src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" />
                <PaymentIcon src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" />
                <PaymentIcon src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="American Express" />
              </PaymentIcons>
            </AcceptedPaymentMethods>
          </OrderSummary>
        </CheckoutContent>
      </CheckoutContainer>
      <Footer />
    </>
  );
};

// Styled Components
const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const CheckoutTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const BackToCartLink = styled.button`
  background: none;
  border: none;
  color: #000;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 2rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormSection = styled.section`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const SectionNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #000;
  color: white;
  border-radius: 50%;
  font-size: 0.9rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  flex: ${props => props.half ? 1 : 'auto'};
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.error ? '#e53935' : '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const FormCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  
  input {
    cursor: pointer;
  }
  
  label {
    font-size: 0.9rem;
    cursor: pointer;
  }
`;

const ErrorMessage = styled.div`
  color: #e53935;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const PaymentMethod = styled.div`
  flex: 1;
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#000' : '#ddd'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.selected ? '#f9f9f9' : 'white'};
  
  &:hover {
    border-color: #000;
  }
  
  .paypal-icon, .apple-pay-icon {
    font-weight: bold;
  }
`;

const CreditCardForm = styled.div`
  margin-top: 1.5rem;
`;

const PaymentInstructions = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

const SecurePaymentNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  color: #43a047;
  font-size: 0.9rem;
`;

const PlaceOrderButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => props.disabled ? '#000' : '#333'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const OrderSummary = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SummaryItems = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const ItemImageContainer = styled.div`
  position: relative;
  margin-right: 1rem;
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemQuantity = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #000;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const ItemMeta = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
  
  span {
    display: block;
  }
`;

const ItemPrice = styled.div`
  font-weight: bold;
  font-size: 0.9rem;
`;

const SummaryDivider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 1.5rem 0;
`;

const SummaryDetails = styled.div``;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const TotalRow = styled(SummaryRow)`
  font-weight: bold;
  font-size: 1.2rem;
  border-top: 2px solid #eee;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-bottom: none;
`;

const TotalAmount = styled.span`
  color: #000;
`;

const AcceptedPaymentMethods = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  
  span {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }
`;

const PaymentIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const PaymentIcon = styled.img`
  width: 40px;
  height: 25px;
  object-fit: contain;
`;

// Order Confirmation Styles
const OrderConfirmationContainer = styled.div`
  max-width: 800px;
  margin: 3rem auto;
  padding: 2rem;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h1 {
    font-size: 2rem;
    margin: 1rem 0;
  }
  
  p {
    color: #666;
    margin-bottom: 1.5rem;
  }
`;

const ConfirmationIcon = styled.div`
  margin: 0 auto 1.5rem;
`;

const OrderDetails = styled.div`
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
  text-align: left;
  
  h2 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 0.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ContinueShoppingButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #000;
  border: 2px solid #000;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ViewOrderButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: #000;
  color: white;
  border: none;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #333;
  }
`;

export default CheckoutPage;
