// src/pages/LoginPage.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserContext } from '../context/UserContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // Field focus states for animation
  const [focusedField, setFocusedField] = useState(null);
  
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
    
    // Clear error when user starts typing
    if (error) setError('');
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
  
  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        // Redirect will happen automatically due to the useEffect that watches isAuthenticated
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Login error:', err);
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
        <LoginContainer
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
                Welcome to STYLISH
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Your premier destination for fashion and style
              </motion.p>
            </BrandMessage>
          </LeftPanel>
          
          <RightPanel>
            <LoginHeader>
              <h1>Welcome Back</h1>
              <p>Sign in to your account</p>
            </LoginHeader>
            
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
            
            <LoginForm onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel 
                  htmlFor="email"
                  focused={focusedField === 'email'}
                >
                  Email Address
                </FormLabel>
                <InputContainer focused={focusedField === 'email'}>
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
                    placeholder="your.email@example.com"
                    autoComplete="email"
                    required
                  />
                </InputContainer>
              </FormGroup>
              
              <FormGroup>
                <FormLabel 
                  htmlFor="password"
                  focused={focusedField === 'password'}
                >
                  Password
                </FormLabel>
                <InputContainer focused={focusedField === 'password'}>
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
                    autoComplete="current-password"
                    required
                  />
                  <PasswordToggle 
                    type="button" 
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </InputContainer>
              </FormGroup>
              
              <FormOptions>
                <RememberMeContainer>
                  <CustomCheckbox>
                    <HiddenCheckbox
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <CheckboxIndicator checked={formData.rememberMe}>
                      {formData.rememberMe && <CheckMark />}
                    </CheckboxIndicator>
                  </CustomCheckbox>
                  <CheckboxLabel htmlFor="rememberMe">Remember me</CheckboxLabel>
                </RememberMeContainer>
                
                <ForgotPassword to="/forgot-password">
                  Forgot password?
                </ForgotPassword>
              </FormOptions>
              
              <LoginButton 
                type="submit" 
                disabled={isLoading}
                as={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <ButtonContent>
                    <Spinner />
                    <span>Signing In...</span>
                  </ButtonContent>
                ) : (
                  <span>Sign In</span>
                )}
              </LoginButton>
              
              <Divider>
                <DividerLine />
                <DividerText>OR</DividerText>
                <DividerLine />
              </Divider>
              
              <SocialLoginContainer>
                <SocialButton 
                  type="button"
                  as={motion.button}
                  whileHover={{ y: -2, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                  whileTap={{ y: 0, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </SocialButton>
              </SocialLoginContainer>
              
              <RegisterPrompt>
                Don't have an account? <Link to="/register">Create one</Link>
              </RegisterPrompt>
            </LoginForm>
          </RightPanel>
        </LoginContainer>
      </PageContainer>
      <Footer />
    </>
  );
};

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 10rem 2rem 10rem; /* Increased top padding from 3rem to 6rem */
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginContainer = styled.div`
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

const LoginHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  p {
    color: #666;
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
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

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-weight: 500;
  color: ${props => props.focused ? '#000' : '#555'};
  transition: color 0.2s ease;
`;

const InputContainer = styled.div`
  position: relative;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: #000;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px; // Consistent positioning
  top: 50%;
  transform: translateY(-50%);
  color: #777;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px; // Fixed width for consistency
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 44px; // 44px provides good spacing after the icon
  border: none;
  border-radius: 4px;
  font-size: 16px;
  background: transparent;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #aaa;
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

const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  border: 1px solid ${props => props.checked ? '#000' : '#ccc'};
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

const CheckboxLabel = styled.label`
  cursor: pointer;
  user-select: none;
`;

const ForgotPassword = styled(Link)`
  color: #000;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled.button`
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;

const DividerLine = styled.div`
  flex-grow: 1;
  height: 1px;
  background-color: #eee;
`;

const DividerText = styled.span`
  padding: 0 1rem;
  color: #777;
  font-size: 0.9rem;
`;

const SocialLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.9rem;
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f8f8;
  }
`;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const RegisterPrompt = styled.div`
  text-align: center;
  font-size: 0.95rem;
  margin-top: 1rem;
  
  a {
    color: #000;
    font-weight: 600;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default LoginPage;