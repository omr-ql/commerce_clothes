// src/components/Footer.js
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterLogo>STYLISH</FooterLogo>
          <FooterDescription>
            Your premier destination for trendy and high-quality clothing. We offer the latest fashion styles for men, women, and accessories.
          </FooterDescription>
          <ContactInfo>
            <ContactItem>
              <FiMapPin />
              <span>123 Fashion Street, Style City, SC 12345</span>
            </ContactItem>
            <ContactItem>
              <FiPhone />
              <span>+1 (555) 123-4567</span>
            </ContactItem>
            <ContactItem>
              <FiMail />
              <span>support@stylish.com</span>
            </ContactItem>
          </ContactInfo>
        </FooterSection>

        <FooterLinksContainer>
          <FooterLinkSection>
            <FooterLinkTitle>Shop</FooterLinkTitle>
            <FooterLink to="/products?category=men">Men's Clothing</FooterLink>
            <FooterLink to="/products?category=women">Women's Clothing</FooterLink>
            <FooterLink to="/products?category=accessories">Accessories</FooterLink>
            <FooterLink to="/products?sale=true">Sale Items</FooterLink>
            <FooterLink to="/products?new=true">New Arrivals</FooterLink>
          </FooterLinkSection>

          <FooterLinkSection>
            <FooterLinkTitle>Customer Service</FooterLinkTitle>
            <FooterLink to="/contact">Contact Us</FooterLink>
            <FooterLink to="/faq">FAQs</FooterLink>
            <FooterLink to="/shipping">Shipping & Returns</FooterLink>
            <FooterLink to="/size-guide">Size Guide</FooterLink>
            <FooterLink to="/track-order">Track Order</FooterLink>
          </FooterLinkSection>

          <FooterLinkSection>
            <FooterLinkTitle>About Us</FooterLinkTitle>
            <FooterLink to="/about">Our Story</FooterLink>
            <FooterLink to="/careers">Careers</FooterLink>
            <FooterLink to="/sustainability">Sustainability</FooterLink>
            <FooterLink to="/press">Press</FooterLink>
            <FooterLink to="/blog">Blog</FooterLink>
          </FooterLinkSection>
        </FooterLinksContainer>

        <NewsletterSection>
          <FooterLinkTitle>Stay Connected</FooterLinkTitle>
          <NewsletterText>
            Subscribe to our newsletter to receive updates on new arrivals, special offers, and fashion tips.
          </NewsletterText>
          <NewsletterForm>
            <NewsletterInput 
              type="email" 
              placeholder="Your email address" 
            />
            <SubscribeButton>Subscribe</SubscribeButton>
          </NewsletterForm>
          <SocialMediaIcons>
            <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FiInstagram />
            </SocialIcon>
            <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FiFacebook />
            </SocialIcon>
            <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FiTwitter />
            </SocialIcon>
            <SocialIcon href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FiYoutube />
            </SocialIcon>
          </SocialMediaIcons>
        </NewsletterSection>
      </FooterContent>

      <FooterBottom>
        <Divider />
        <FooterBottomContent>
          <Copyright>
            © {currentYear} STYLISH. All rights reserved.
          </Copyright>
          <FooterBottomLinks>
            <FooterBottomLink to="/privacy-policy">Privacy Policy</FooterBottomLink>
            <FooterBottomLink to="/terms">Terms of Service</FooterBottomLink>
            <FooterBottomLink to="/accessibility">Accessibility</FooterBottomLink>
          </FooterBottomLinks>
          <PaymentMethods>
            <PaymentIcon src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" />
            <PaymentIcon src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" />
            <PaymentIcon src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" />
            <PaymentIcon src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="American Express" />
          </PaymentMethods>
        </FooterBottomContent>
      </FooterBottom>
    </FooterContainer>
  );
};

// Styled Components
const FooterContainer = styled.footer`
  background-color: #1a1a1a;
  color: #fff;
  padding: 4rem 2rem 2rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  @media (max-width: 1024px) {
    grid-column: span 2;
  }
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const FooterLogo = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
`;

const FooterDescription = styled.p`
  color: #b3b3b3;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ContactInfo = styled.div`
  margin-top: 1.5rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #b3b3b3;
  
  svg {
    margin-right: 0.75rem;
  }
`;

const FooterLinksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-column: span 2;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-column: span 1;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FooterLinkSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLinkTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #fff;
`;

const FooterLink = styled(Link)`
  color: #b3b3b3;
  text-decoration: none;
  margin-bottom: 0.75rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: #fff;
  }
`;

const NewsletterSection = styled.div`
  @media (max-width: 1024px) {
    grid-column: span 2;
  }
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const NewsletterText = styled.p`
  color: #b3b3b3;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #333;
  background-color: #333;
  color: #fff;
  border-radius: 4px 0 0 4px;
  
  &::placeholder {
    color: #b3b3b3;
  }
  
  &:focus {
    outline: none;
    border-color: #666;
  }
  
  @media (max-width: 480px) {
    border-radius: 4px;
    margin-bottom: 0.75rem;
  }
`;

const SubscribeButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 0 4px 4px 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  @media (max-width: 480px) {
    border-radius: 4px;
  }
`;

const SocialMediaIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #333;
  border-radius: 50%;
  color: #fff;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #fff;
    color: #000;
    transform: translateY(-3px);
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #333;
  margin: 2rem 0;
`;

const FooterBottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #b3b3b3;
  font-size: 0.9rem;
`;

const FooterBottomLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const FooterBottomLink = styled(Link)`
  color: #b3b3b3;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: #fff;
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const PaymentIcon = styled.img`
  height: 24px;
  width: auto;
  filter: grayscale(100%) brightness(70%);
  transition: filter 0.2s ease;
  
  &:hover {
    filter: grayscale(0%) brightness(100%);
  }
`;

export default Footer;
