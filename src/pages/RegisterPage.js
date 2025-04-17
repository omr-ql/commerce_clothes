// src/pages/RegisterPage.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [focusedField, setFocusedField] = useState(null);
  
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
  
  const handleFocus = (field) => {
    setFocusedField(field);
  };
  
  const handleBlur = () => {
    setFocusedField(null);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const validateStep1 = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateStep2 = () => {
    const errors = {};
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }
    
    if (!formData.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevStep = () => {
    setCurrentStep(1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error and success messages
    setError('');
    setSuccess('');
    
    // Validate form
    if (currentStep === 1) {
      if (!validateStep1()) return;
      handleNextStep();
      return;
    }
    
    if (!validateStep2()) return;
    
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
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <>
      <Header />
      <PageContainer>
        <RegisterContainer
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <LeftPanel>
            <BrandMessage>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Join STYLISH Today
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Create your account and discover the latest fashion trends
              </motion.p>
            </BrandMessage>
          </LeftPanel>
          
          <RightPanel>
            <RegisterHeader>
              <h1>Create an Account</h1>
              <p>Step {currentStep} of 2</p>
              <StepIndicator>
                <StepDot active={currentStep === 1} />
                <StepDot active={currentStep === 2} />
              </StepIndicator>
            </RegisterHeader>
            
            <AnimatePresence>
              {error && (
                <ErrorMessage
                  as={motion.div}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FiAlertCircle /> {error}
                </ErrorMessage>
              )}
              
              {success && (
                <SuccessMessage
                  as={motion.div}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FiCheckCircle /> {success}
                </SuccessMessage>
              )}
            </AnimatePresence>
            
            <RegisterForm onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <FormStep
                    as={motion.div}
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormRow>
                      <FormGroup>
                        <FormLabel 
                          htmlFor="firstName"
                          focused={focusedField === 'firstName'}
                        >
                          First Name
                        </FormLabel>
                        <InputContainer focused={focusedField === 'firstName'} error={formErrors.firstName}>
                          <InputIcon focused={focusedField === 'firstName'}>
                            <FiUser />
                          </InputIcon>
                          <FormInput
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus('firstName')}
                            onBlur={handleBlur}
                            placeholder="John"
                          />
                        </InputContainer>
                        {formErrors.firstName && <InputError>{formErrors.firstName}</InputError>}
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel 
                          htmlFor="lastName"
                          focused={focusedField === 'lastName'}
                        >
                          Last Name
                        </FormLabel>
                        <InputContainer focused={focusedField === 'lastName'} error={formErrors.lastName}>
                          <InputIcon focused={focusedField === 'lastName'}>
                            <FiUser />
                          </InputIcon>
                          <FormInput
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus('lastName')}
                            onBlur={handleBlur}
                            placeholder="Doe"
                          />
                        </InputContainer>
                        {formErrors.lastName && <InputError>{formErrors.lastName}</InputError>}
                      </FormGroup>
                    </FormRow>
                    
                    <FormGroup>
                      <FormLabel 
                        htmlFor="email"
                        focused={focusedField === 'email'}
                      >
                        Email Address
                      </FormLabel>
                      <InputContainer focused={focusedField === 'email'} error={formErrors.email}>
                        <InputIcon focused={focusedField === 'email'}>
                          <FiMail />
                        </InputIcon>
                        <FormInput
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onFocus={() => handleFocus('email')}
                          onBlur={handleBlur}
                          placeholder="john.doe@example.com"
                        />
                      </InputContainer>
                      {formErrors.email && <InputError>{formErrors.email}</InputError>}
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel 
                        htmlFor="password"
                        focused={focusedField === 'password'}
                      >
                        Password
                      </FormLabel>
                      <InputContainer focused={focusedField === 'password'} error={formErrors.password}>
                        <InputIcon focused={focusedField === 'password'}>
                          <FiLock />
                        </InputIcon>
                        <FormInput
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          onFocus={() => handleFocus('password')}
                          onBlur={handleBlur}
                          placeholder="••••••••"
                        />
                        <PasswordToggle 
                          type="button" 
                          onClick={togglePasswordVisibility}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </PasswordToggle>
                      </InputContainer>
                      {formErrors.password && <InputError>{formErrors.password}</InputError>}
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel 
                        htmlFor="confirmPassword"
                        focused={focusedField === 'confirmPassword'}
                      >
                        Confirm Password
                      </FormLabel>
                      <InputContainer focused={focusedField === 'confirmPassword'} error={formErrors.confirmPassword}>
                        <InputIcon focused={focusedField === 'confirmPassword'}>
                          <FiLock />
                        </InputIcon>
                        <FormInput
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          onFocus={() => handleFocus('confirmPassword')}
                          onBlur={handleBlur}
                          placeholder="••••••••"
                        />
                        <PasswordToggle 
                          type="button" 
                          onClick={toggleConfirmPasswordVisibility}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </PasswordToggle>
                      </InputContainer>
                      {formErrors.confirmPassword && <InputError>{formErrors.confirmPassword}</InputError>}
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel 
                        htmlFor="phoneNumber"
                        focused={focusedField === 'phoneNumber'}
                      >
                        Phone Number
                      </FormLabel>
                      <InputContainer focused={focusedField === 'phoneNumber'} error={formErrors.phoneNumber}>
                        <InputIcon focused={focusedField === 'phoneNumber'}>
                          <FiPhone />
                        </InputIcon>
                        <FormInput
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          onFocus={() => handleFocus('phoneNumber')}
                          onBlur={handleBlur}
                          placeholder="(123) 456-7890"
                        />
                      </InputContainer>
                      {formErrors.phoneNumber && <InputError>{formErrors.phoneNumber}</InputError>}
                    </FormGroup>
                    
                    <NextButton 
                      type="button" 
                      onClick={handleNextStep}
                      as={motion.button}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue to Shipping Details
                    </NextButton>
                  </FormStep>
                )}
                
                {currentStep === 2 && (
                  <FormStep
                    as={motion.div}
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormGroup>
                      <FormLabel 
                        htmlFor="address"
                        focused={focusedField === 'address'}
                      >
                        Street Address
                      </FormLabel>
                      <InputContainer focused={focusedField === 'address'} error={formErrors.address}>
                        <InputIcon focused={focusedField === 'address'}>
                          <FiMapPin />
                        </InputIcon>
                        <FormInput
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          onFocus={() => handleFocus('address')}
                          onBlur={handleBlur}
                          placeholder="123 Main St"
                        />
                      </InputContainer>
                      {formErrors.address && <InputError>{formErrors.address}</InputError>}
                    </FormGroup>
                    
                    <FormRow>
                      <FormGroup>
                        <FormLabel 
                          htmlFor="city"
                          focused={focusedField === 'city'}
                        >
                          City
                        </FormLabel>
                        <InputContainer focused={focusedField === 'city'} error={formErrors.city}>
                          <InputIcon focused={focusedField === 'city'}>
                            <FiMapPin />
                          </InputIcon>
                          <FormInput
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus('city')}
                            onBlur={handleBlur}
                            placeholder="New York"
                          />
                        </InputContainer>
                        {formErrors.city && <InputError>{formErrors.city}</InputError>}
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel 
                          htmlFor="state"
                          focused={focusedField === 'state'}
                        >
                          State
                        </FormLabel>
                        <InputContainer focused={focusedField === 'state'} error={formErrors.state}>
                          <InputIcon focused={focusedField === 'state'}>
                            <FiMapPin />
                          </InputIcon>
                          <FormInput
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus('state')}
                            onBlur={handleBlur}
                            placeholder="NY"
                          />
                        </InputContainer>
                        {formErrors.state && <InputError>{formErrors.state}</InputError>}
                      </FormGroup>
                    </FormRow>
                    
                    <FormRow>
                      <FormGroup>
                        <FormLabel 
                          htmlFor="zipCode"
                          focused={focusedField === 'zipCode'}
                        >
                          ZIP Code
                        </FormLabel>
                        <InputContainer focused={focusedField === 'zipCode'} error={formErrors.zipCode}>
                          <InputIcon focused={focusedField === 'zipCode'}>
                            <FiMapPin />
                          </InputIcon>
                          <FormInput
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus('zipCode')}
                            onBlur={handleBlur}
                            placeholder="10001"
                          />
                        </InputContainer>
                        {formErrors.zipCode && <InputError>{formErrors.zipCode}</InputError>}
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel 
                          htmlFor="country"
                          focused={focusedField === 'country'}
                        >
                          Country
                        </FormLabel>
                        <SelectContainer focused={focusedField === 'country'}>
                          <SelectIcon focused={focusedField === 'country'}>
                            <FiMapPin />
                          </SelectIcon>
                          <FormSelect
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus('country')}
                            onBlur={handleBlur}
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                          </FormSelect>
                        </SelectContainer>
                      </FormGroup>
                    </FormRow>
                    
                    <TermsCheckboxContainer>
                      <CustomCheckbox>
                        <HiddenCheckbox
                          type="checkbox"
                          id="agreeToTerms"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                        />
                        <CheckboxIndicator checked={formData.agreeToTerms} error={formErrors.agreeToTerms}>
                          {formData.agreeToTerms && <CheckMark />}
                        </CheckboxIndicator>
                      </CustomCheckbox>
                      <TermsLabel htmlFor="agreeToTerms">
                        I agree to the <Link to="/terms">Terms and Conditions</Link> and <Link to="/privacy-policy">Privacy Policy</Link>
                      </TermsLabel>
                    </TermsCheckboxContainer>
                    {formErrors.agreeToTerms && <InputError>{formErrors.agreeToTerms}</InputError>}
                    
                    <ButtonsContainer>
                      <BackButton 
                        type="button" 
                        onClick={handlePrevStep}
                        as={motion.button}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Back
                      </BackButton>
                      
                      <SubmitButton 
                        type="submit" 
                        disabled={isLoading}
                        as={motion.button}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isLoading ? (
                          <ButtonContent>
                            <Spinner />
                            <span>Creating Account...</span>
                          </ButtonContent>
                        ) : (
                          <span>Create Account</span>
                        )}
                      </SubmitButton>
                    </ButtonsContainer>
                  </FormStep>
                )}
              </AnimatePresence>
              
              <LoginPrompt>
                Already have an account? <Link to="/login">Log in</Link>
              </LoginPrompt>
            </RegisterForm>
          </RightPanel>
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
  padding: 6rem 2rem 3rem;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RegisterContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  width: 100%;
  max-width: 900px;
  overflow: hidden;
  display: flex;
  
  @media (max-width: 768px) {
    flex-direction: column;
    max-width: 450px;
  }
`;

const LeftPanel = styled.div`
  background: linear-gradient(135deg, #000000 0%, #434343 100%);
  color: white;
  padding: 3rem;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2xvdGhpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60') center/cover;
    opacity: 0.2;
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
    display: none;
  }
`;

const BrandMessage = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  
  h2 {
    font-size: 2.2rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

const RightPanel = styled.div`
  padding: 3rem;
  flex: 1;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const RegisterHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  p {
    color: #666;
    margin-bottom: 1rem;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const StepDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#000' : '#ddd'};
  transition: background-color 0.3s ease;
`;



const ErrorMessage = styled.div`
  color: var(--error-color, #d32f2f);
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormStep = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
  color: var(--label-color, #555);
  
  ${props => props.required && `
    &::after {
      content: "*";
      color: var(--required-color, #d32f2f);
      margin-left: 4px;
    }
  `}
`;

const InputContainer = styled.div`
  position: relative;
  border: 1px solid var(--border-color, #ddd);
  border-radius: var(--border-radius, 4px);
  transition: all 0.2s ease-in-out;
  margin-bottom: 1rem;
  
  &:focus-within {
    border-color: var(--focus-color, #000);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
  }
  
  &:hover:not(:focus-within) {
    border-color: var(--hover-color, #aaa);
  }
  
  ${props => props.error && `
    border-color: var(--error-color, #d32f2f);
    
    &:focus-within {
      border-color: var(--error-color, #d32f2f);
      box-shadow: 0 0 0 2px rgba(211, 47, 47, 0.1);
    }
  `}
  
  ${props => props.disabled && `
    opacity: 0.7;
    background-color: var(--disabled-bg, #f5f5f5);
    cursor: not-allowed;
  `}
`;

const SelectContainer = styled(InputContainer)`
  background-color: white;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--icon-color, #777);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  pointer-events: none; /* Ensures clicks pass through to the input */
  transition: color 0.2s ease;
  
  ${InputContainer}:focus-within & {
    color: var(--focus-icon-color, #000);
  }
  
  ${props => props.error && `
    color: var(--error-color, #d32f2f);
  `}
`;

const SelectIcon = styled(InputIcon)``;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: none;
  border-radius: inherit;
  font-size: 16px;
  font-family: inherit;
  background: transparent;
  color: var(--text-color, #333);
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: var(--placeholder-color, #aaa);
    opacity: 1; /* Firefox fix */
  }
  
  &:disabled {
    cursor: not-allowed;
  }
  
  /* Better autofill styling */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px white inset;
    transition: background-color 5000s ease-in-out 0s;
  }
  
  /* Hide browser-specific styling for number inputs */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 2.8rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  background: transparent;
  appearance: none;
  
  &:focus {
    outline: none;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #777;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  
  &:hover {
    color: #000;
  }
`;

const InputError = styled.div`
  color: #c62828;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const TermsCheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const CustomCheckbox = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: middle;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const CheckboxIndicator = styled.div`
  width: 18px;
  height: 18px;
  background-color: ${props => props.checked ? '#000' : 'white'};
  border: 1px solid ${props => props.error ? '#c62828' : props.checked ? '#000' : '#ccc'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #000;
  }
`;

const CheckMark = styled.div`
  width: 10px;
  height: 10px;
  background-color: white;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E") no-repeat center / contain;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E") no-repeat center / contain;
`;

const TermsLabel = styled.label`
  font-size: 0.9rem;
  cursor: pointer;
  
  a {
    color: #000;
    text-decoration: underline;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const NextButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: #333;
  }
`;

const BackButton = styled.button`
  flex: 1;
  padding: 0.9rem;
  background-color: white;
  color: #000;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
    border-color: #000;
  }
`;

const SubmitButton = styled.button`
  flex: 2;
  padding: 0.9rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #333;
  }
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  font-size: 0.95rem;
  margin-top: 1.5rem;
  
  a {
    color: #000;
    font-weight: 600;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default RegisterPage;