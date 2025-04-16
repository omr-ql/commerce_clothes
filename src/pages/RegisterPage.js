// src/pages/RegisterPage.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserContext } from '../context/UserContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    agreeToTerms: false
  });
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    // Validate first name
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    // Validate last name
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate phone number
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    
    // Validate address
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    // Validate city
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    
    // Validate state
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }
    
    // Validate zip code
    if (!formData.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    }
    
    // Validate terms agreement
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error and success messages
    setError('');
    setSuccess('');
    
    // Validate form
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = Object.keys(formErrors)[0];
      const errorElement = document.getElementsByName(firstError)[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Remove confirmPassword and agreeToTerms from data sent to API
      const { confirmPassword, agreeToTerms, ...registerData } = formData;
      
      const result = await register(registerData);
      
      if (result.success) {
        setSuccess('Registration successful! Redirecting to your account...');
        // Redirect will happen automatically due to the useEffect that watches isAuthenticated
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Header />
      <PageContainer>
        <RegisterContainer
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RegisterHeader>
            <h1>Create an Account</h1>
            <p>Join STYLISH to enjoy a personalized shopping experience</p>
          </RegisterHeader>
          
          {error && (
            <ErrorMessage>
              <FiAlertCircle /> {error}
            </ErrorMessage>
          )}
          
          {success && (
            <SuccessMessage>
              <FiCheckCircle /> {success}
            </SuccessMessage>
          )}
          
          <RegisterForm onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>Personal Information</SectionTitle>
              
              <FormRow>
                <FormGroup half>
                  <FormLabel htmlFor="firstName">First Name</FormLabel>
                  <FormInput
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={formErrors.firstName}
                    placeholder="John"
                  />
                  {formErrors.firstName && <InputError>{formErrors.firstName}</InputError>}
                </FormGroup>
                
                <FormGroup half>
                  <FormLabel htmlFor="lastName">Last Name</FormLabel>
                  <FormInput
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={formErrors.lastName}
                    placeholder="Doe"
                  />
                  {formErrors.lastName && <InputError>{formErrors.lastName}</InputError>}
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
                  error={formErrors.email}
                  placeholder="john.doe@example.com"
                />
                {formErrors.email && <InputError>{formErrors.email}</InputError>}
              </FormGroup>
              
              <FormRow>
                <FormGroup half>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormInput
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={formErrors.password}
                    placeholder="••••••••"
                  />
                  {formErrors.password && <InputError>{formErrors.password}</InputError>}
                </FormGroup>
                
                <FormGroup half>
                  <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                  <FormInput
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={formErrors.confirmPassword}
                    placeholder="••••••••"
                  />
                  {formErrors.confirmPassword && <InputError>{formErrors.confirmPassword}</InputError>}
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
                  error={formErrors.phoneNumber}
                  placeholder="(123) 456-7890"
                />
                {formErrors.phoneNumber && <InputError>{formErrors.phoneNumber}</InputError>}
              </FormGroup>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Shipping Address</SectionTitle>
              
              <FormGroup>
                <FormLabel htmlFor="address">Street Address</FormLabel>
                <FormInput
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={formErrors.address}
                  placeholder="123 Main St"
                />
                {formErrors.address && <InputError>{formErrors.address}</InputError>}
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
                    error={formErrors.city}
                    placeholder="New York"
                  />
                  {formErrors.city && <InputError>{formErrors.city}</InputError>}
                </FormGroup>
                
                <FormGroup half>
                  <FormLabel htmlFor="state">State</FormLabel>
                  <FormInput
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    error={formErrors.state}
                    placeholder="NY"
                  />
                  {formErrors.state && <InputError>{formErrors.state}</InputError>}
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
                    error={formErrors.zipCode}
                    placeholder="10001"
                  />
                  {formErrors.zipCode && <InputError>{formErrors.zipCode}</InputError>}
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
            </FormSection>
            
            <TermsCheckbox>
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
              />
              <label htmlFor="agreeToTerms">
                I agree to the <Link to="/terms">Terms and Conditions</Link> and <Link to="/privacy-policy">Privacy Policy</Link>
              </label>
              {formErrors.agreeToTerms && <InputError>{formErrors.agreeToTerms}</InputError>}
            </TermsCheckbox>
            
            <RegisterButton type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </RegisterButton>
            
            <LoginPrompt>
              Already have an account? <Link to="/login">Log in</Link>
            </LoginPrompt>
          </RegisterForm>
        </RegisterContainer>
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
`;

const RegisterContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin: 2rem 0;
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormSection = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const FormGroup = styled.div`
  flex: ${props => props.half ? 1 : 'auto'};
  margin-bottom: 1rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.error ? '#c62828' : '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#c62828' : '#000'};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const InputError = styled.div`
  color: #c62828;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const TermsCheckbox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  input {
    margin-top: 0.25rem;
  }
  
  label {
    font-size: 0.9rem;
    
    a {
      color: #000;
      text-decoration: underline;
    }
  }
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #333;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  font-size: 0.9rem;
  
  a {
    color: #000;
    font-weight: bold;
    text-decoration: underline;
  }
`;

export default RegisterPage;
