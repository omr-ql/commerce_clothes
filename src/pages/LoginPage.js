// src/pages/LoginPage.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LoginPage = () => {
  return (
    <>
      <Header />
      <LoginContainer>
        <h1>Login</h1>
        <p>This page is under construction</p>
        <Link to="/">Go back to home</Link>
      </LoginContainer>
      <Footer />
    </>
  );
};

const LoginContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default LoginPage;
