// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <NotFoundContainer
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ErrorIcon>
        <FiAlertCircle size={80} />
      </ErrorIcon>
      
      <ErrorTitle>404</ErrorTitle>
      <ErrorSubtitle>Page Not Found</ErrorSubtitle>
      
      <ErrorMessage>
        Oops! The page you're looking for doesn't exist or has been moved.
      </ErrorMessage>
      
      <SuggestionsContainer>
        <p>You might want to:</p>
        <ul>
          <li>Check the URL for typos</li>
          <li>Go back to the previous page</li>
          <li>Visit our homepage</li>
        </ul>
      </SuggestionsContainer>
      
      <ButtonsContainer>
        <BackButton onClick={() => window.history.back()}>
          Go Back
        </BackButton>
        
        <HomeButton to="/">
          Go to Homepage
        </HomeButton>
      </ButtonsContainer>
    </NotFoundContainer>
  );
};

// Styled Components
const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const ErrorIcon = styled.div`
  color: #e53935;
  margin-bottom: 1.5rem;
`;

const ErrorTitle = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
  color: #e53935;
`;

const ErrorSubtitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const SuggestionsContainer = styled.div`
  margin-bottom: 2rem;
  
  ul {
    list-style-type: disc;
    text-align: left;
    display: inline-block;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const HomeButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #333;
  }
`;

export default NotFoundPage;
