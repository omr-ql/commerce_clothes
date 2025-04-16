// src/components/Modal.js
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title = null,
  maxWidth = '600px',
  closeOnOutsideClick = true,
  showCloseButton = true,
  position = 'center' // 'center', 'top', 'bottom'
}) => {
  const modalRef = useRef(null);
  
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    // Prevent scrolling on body when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'visible';
    };
  }, [isOpen, onClose]);
  
  // Handle outside click
  const handleOutsideClick = (e) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  // Determine animation based on position
  const getAnimationVariants = () => {
    switch (position) {
      case 'top':
        return {
          hidden: { y: '-100%', opacity: 0 },
          visible: { y: 0, opacity: 1 },
          exit: { y: '-100%', opacity: 0 }
        };
      case 'bottom':
        return {
          hidden: { y: '100%', opacity: 0 },
          visible: { y: 0, opacity: 1 },
          exit: { y: '100%', opacity: 0 }
        };
      case 'center':
      default:
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 }
        };
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOutsideClick}
        >
          <ModalContainer
            as={motion.div}
            ref={modalRef}
            variants={getAnimationVariants()}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            maxWidth={maxWidth}
            position={position}
          >
            {(title || showCloseButton) && (
              <ModalHeader>
                {title && <ModalTitle>{title}</ModalTitle>}
                {showCloseButton && (
                  <CloseButton onClick={onClose}>
                    <FiX size={24} />
                  </CloseButton>
                )}
              </ModalHeader>
            )}
            
            <ModalContent>
              {children}
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

// Quick View Product Modal - Example of a specialized modal
export const QuickViewModal = ({ isOpen, onClose, product }) => {
  const { addToCart } = React.useContext(require('../context/CartContext').CartContext);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);
  
  if (!product) return null;
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.onSale ? product.price * (1 - product.discount / 100) : product.price,
      image: product.image || product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    
    onClose();
  };
  
  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };
  
  // Calculate discounted price if product is on sale
  const discountedPrice = product.onSale 
    ? product.price * (1 - product.discount / 100) 
    : null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="900px">
      <QuickViewContainer>
        <ProductImageSection>
          <ProductImage src={product.image || product.images[0]} alt={product.name} />
          {product.onSale && (
            <SaleBadge>{product.discount}% OFF</SaleBadge>
          )}
        </ProductImageSection>
        
        <ProductDetailsSection>
          <ProductCategory>{product.category}</ProductCategory>
          <ProductName>{product.name}</ProductName>
          
          <PriceContainer>
            {discountedPrice ? (
              <>
                <OriginalPrice>${product.price.toFixed(2)}</OriginalPrice>
                <CurrentPrice>${discountedPrice.toFixed(2)}</CurrentPrice>
              </>
            ) : (
              <CurrentPrice>${product.price.toFixed(2)}</CurrentPrice>
            )}
          </PriceContainer>
          
          {product.rating && (
            <RatingContainer>
              <Stars rating={product.rating} />
              <ReviewCount>({product.reviewCount} reviews)</ReviewCount>
            </RatingContainer>
          )}
          
          <ProductDescription>
            {product.description}
          </ProductDescription>
          
          {product.colors && (
            <OptionSection>
              <OptionTitle>Color: {selectedColor}</OptionTitle>
              <ColorOptions>
                {product.colors.map(color => (
                  <ColorOption 
                    key={color}
                    color={color.toLowerCase()}
                    selected={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </ColorOptions>
            </OptionSection>
          )}
          
          {product.sizes && (
            <OptionSection>
              <OptionTitle>Size:</OptionTitle>
              <SizeOptions>
                {product.sizes.map(size => (
                  <SizeOption 
                    key={size}
                    selected={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </SizeOption>
                ))}
              </SizeOptions>
            </OptionSection>
          )}
          
          <QuantitySection>
            <OptionTitle>Quantity:</OptionTitle>
            <QuantitySelector>
              <QuantityButton onClick={() => handleQuantityChange(-1)}>-</QuantityButton>
              <QuantityValue>{quantity}</QuantityValue>
              <QuantityButton onClick={() => handleQuantityChange(1)}>+</QuantityButton>
            </QuantitySelector>
          </QuantitySection>
          
          <ActionButtons>
            <AddToCartButton onClick={handleAddToCart}>
              Add to Cart
            </AddToCartButton>
            <ViewDetailsButton href={`/product/${product.id}`}>
              View Full Details
            </ViewDetailsButton>
          </ActionButtons>
        </ProductDetailsSection>
      </QuickViewContainer>
    </Modal>
  );
};

// Confirmation Modal - Another example of a specialized modal
export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default' // 'default', 'delete', 'warning'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="400px">
      <ConfirmationContent>
        <ConfirmationMessage>{message}</ConfirmationMessage>
        
        <ConfirmationButtons>
          <CancelButton onClick={onClose}>
            {cancelText}
          </CancelButton>
          <ConfirmButton onClick={onConfirm} type={type}>
            {confirmText}
          </ConfirmButton>
        </ConfirmationButtons>
      </ConfirmationContent>
    </Modal>
  );
};

// Helper component for star ratings
const Stars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <StarsContainer>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) return <StarFull key={i} />;
        if (i === fullStars && hasHalfStar) return <StarHalf key={i} />;
        return <StarEmpty key={i} />;
      })}
    </StarsContainer>
  );
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  max-width: ${props => props.maxWidth};
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  
  ${props => props.position === 'top' && `
    margin-top: 5vh;
    align-self: flex-start;
  `}
  
  ${props => props.position === 'bottom' && `
    margin-bottom: 5vh;
    align-self: flex-end;
  `}
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  margin: -0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
    color: #000;
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
`;

// Quick View Modal Styles
const QuickViewContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImageSection = styled.div`
  position: relative;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const SaleBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #e53935;
  color: white;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 4px;
`;

const ProductDetailsSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductCategory = styled.div`
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const ProductName = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const CurrentPrice = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
`;

const OriginalPrice = styled.span`
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StarsContainer = styled.div`
  display: flex;
  color: #ffc107;
`;

const StarFull = styled.div`
  &:before {
    content: "★";
  }
`;

const StarHalf = styled.div`
  &:before {
    content: "★";
    clip-path: inset(0 50% 0 0);
  }
`;

const StarEmpty = styled.div`
  &:before {
    content: "☆";
  }
`;

const ReviewCount = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const ProductDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1.5rem;
`;

const OptionSection = styled.div`
  margin-bottom: 1.5rem;
`;

const OptionTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.75rem 0;
  font-weight: 500;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ColorOption = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color};
  cursor: pointer;
  border: 2px solid ${props => props.selected ? '#000' : 'transparent'};
  
  &:hover {
    border-color: #000;
  }
`;

const SizeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SizeOption = styled.div`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.selected ? '#000' : '#ddd'};
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  background-color: ${props => props.selected ? '#000' : 'transparent'};
  color: ${props => props.selected ? 'white' : 'inherit'};
  
  &:hover {
    border-color: #000;
  }
`;

const QuantitySection = styled.div`
  margin-bottom: 1.5rem;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  width: fit-content;
`;

const QuantityButton = styled.button`
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const QuantityValue = styled.span`
  padding: 0 1rem;
  min-width: 40px;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #333;
  }
`;

const ViewDetailsButton = styled.a`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #000;
  border: 1px solid #000;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

// Confirmation Modal Styles
const ConfirmationContent = styled.div`
  text-align: center;
`;

const ConfirmationMessage = styled.p`
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
`;

const ConfirmationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #000;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ConfirmButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => {
    switch(props.type) {
      case 'delete': return '#e53935';
      case 'warning': return '#ff9800';
      default: return '#000';
    }
  }};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => {
      switch(props.type) {
        case 'delete': return '#c62828';
        case 'warning': return '#f57c00';
        default: return '#333';
      }
    }};
  }
`;

export default Modal;
