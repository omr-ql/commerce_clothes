// src/components/FilterBar.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi';

const FilterBar = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    color: true,
    size: true,
    brand: false,
    rating: false,
    discount: false,
  });
  
  // Available filter options
  const categories = ['All', 'Men', 'Women', 'Accessories', 'Dresses', 'Shirts', 'Pants', 'Jackets', 'Shoes'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Gray', 'Brown'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const brands = ['Nike', 'Adidas', 'Zara', 'H&M', 'Gucci', 'Levi\'s', 'Calvin Klein', 'Ralph Lauren'];
  
  // Close mobile filter when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };
  
  const handleCategoryChange = (category) => {
    onFilterChange({ category: category === 'All' ? 'all' : category.toLowerCase() });
  };
  
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const priceRange = [...filters.priceRange];
    
    if (name === 'minPrice') {
      priceRange[0] = Number(value);
    } else {
      priceRange[1] = Number(value);
    }
    
    onFilterChange({ priceRange });
  };
  
  const handleSortChange = (e) => {
    onFilterChange({ sortBy: e.target.value });
  };
  
  const handleColorChange = (color) => {
    onFilterChange({ color: color.toLowerCase() });
  };
  
  const handleSizeChange = (size) => {
    onFilterChange({ size });
  };
  
  const handleSaleChange = (e) => {
    onFilterChange({ onSale: e.target.checked });
  };
  
  const handleRatingChange = (rating) => {
    onFilterChange({ minRating: rating });
  };
  
  const clearAllFilters = () => {
    onFilterChange({
      category: 'all',
      priceRange: [0, 500],
      color: null,
      size: null,
      sortBy: 'newest',
      onSale: false,
      minRating: 0,
    });
  };
  
  const toggleMobileFilter = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <MobileFilterButton onClick={toggleMobileFilter}>
        <FiFilter /> Filters
      </MobileFilterButton>
      
      <FilterContainer isOpen={isOpen}>
        <FilterHeader>
          <FilterTitle>Filters</FilterTitle>
          <CloseButton onClick={toggleMobileFilter}>
            <FiX />
          </CloseButton>
        </FilterHeader>
        
        <FilterContent>
          <SortByContainer>
            <SortByLabel>Sort By:</SortByLabel>
            <SortBySelect value={filters.sortBy} onChange={handleSortChange}>
              <option value="newest">Newest</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="popularity">Popularity</option>
            </SortBySelect>
          </SortByContainer>
          
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('category')}>
              <SectionTitle>Category</SectionTitle>
              {expandedSections.category ? <FiChevronUp /> : <FiChevronDown />}
            </FilterSectionHeader>
            
            <AnimatePresence>
              {expandedSections.category && (
                <SectionContent
                  as={motion.div}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CategoryOptions>
                    {categories.map((category) => (
                      <CategoryOption 
                        key={category}
                        selected={filters.category === (category === 'All' ? 'all' : category.toLowerCase())}
                        onClick={() => handleCategoryChange(category)}
                      >
                        {category}
                        {filters.category === (category === 'All' ? 'all' : category.toLowerCase()) && (
                          <FiCheck />
                        )}
                      </CategoryOption>
                    ))}
                  </CategoryOptions>
                </SectionContent>
              )}
            </AnimatePresence>
          </FilterSection>
          
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('price')}>
              <SectionTitle>Price Range</SectionTitle>
              {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
            </FilterSectionHeader>
            
            <AnimatePresence>
              {expandedSections.price && (
                <SectionContent
                  as={motion.div}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PriceRangeContainer>
                    <PriceInputGroup>
                      <PriceInput
                        type="number"
                        name="minPrice"
                        placeholder="Min"
                        value={filters.priceRange[0]}
                        onChange={handlePriceChange}
                        min="0"
                      />
                      <PriceSeparator>to</PriceSeparator>
                      <PriceInput
                        type="number"
                        name="maxPrice"
                        placeholder="Max"
                        value={filters.priceRange[1]}
                        onChange={handlePriceChange}
                        min="0"
                      />
                    </PriceInputGroup>
                  </PriceRangeContainer>
                </SectionContent>
              )}
            </AnimatePresence>
          </FilterSection>
          
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('color')}>
              <SectionTitle>Color</SectionTitle>
              {expandedSections.color ? <FiChevronUp /> : <FiChevronDown />}
            </FilterSectionHeader>
            
            <AnimatePresence>
              {expandedSections.color && (
                <SectionContent
                  as={motion.div}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ColorOptions>
                    {colors.map((color) => (
                      <ColorOption 
                        key={color}
                        color={color.toLowerCase()}
                        selected={filters.color === color.toLowerCase()}
                        onClick={() => handleColorChange(color)}
                      >
                        {filters.color === color.toLowerCase() && <FiCheck />}
                      </ColorOption>
                    ))}
                  </ColorOptions>
                </SectionContent>
              )}
            </AnimatePresence>
          </FilterSection>
          
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('size')}>
              <SectionTitle>Size</SectionTitle>
              {expandedSections.size ? <FiChevronUp /> : <FiChevronDown />}
            </FilterSectionHeader>
            
            <AnimatePresence>
              {expandedSections.size && (
                <SectionContent
                  as={motion.div}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SizeOptions>
                    {sizes.map((size) => (
                      <SizeOption 
                        key={size}
                        selected={filters.size === size}
                        onClick={() => handleSizeChange(size)}
                      >
                        {size}
                      </SizeOption>
                    ))}
                  </SizeOptions>
                </SectionContent>
              )}
            </AnimatePresence>
          </FilterSection>
          
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('brand')}>
              <SectionTitle>Brand</SectionTitle>
              {expandedSections.brand ? <FiChevronUp /> : <FiChevronDown />}
            </FilterSectionHeader>
            
            <AnimatePresence>
              {expandedSections.brand && (
                <SectionContent
                  as={motion.div}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckboxList>
                    {brands.map((brand) => (
                      <CheckboxItem key={brand}>
                        <CheckboxInput
                          type="checkbox"
                          id={`brand-${brand}`}
                          checked={filters.brand === brand}
                          onChange={() => onFilterChange({ brand: filters.brand === brand ? null : brand })}
                        />
                        <CheckboxLabel htmlFor={`brand-${brand}`}>{brand}</CheckboxLabel>
                      </CheckboxItem>
                    ))}
                  </CheckboxList>
                </SectionContent>
              )}
            </AnimatePresence>
          </FilterSection>
          
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('rating')}>
              <SectionTitle>Rating</SectionTitle>
              {expandedSections.rating ? <FiChevronUp /> : <FiChevronDown />}
            </FilterSectionHeader>
            
            <AnimatePresence>
              {expandedSections.rating && (
                <SectionContent
                  as={motion.div}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RatingOptions>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <RatingOption 
                        key={rating}
                        selected={filters.minRating === rating}
                        onClick={() => handleRatingChange(rating)}
                      >
                        <Stars rating={rating} /> & Up
                      </RatingOption>
                    ))}
                  </RatingOptions>
                </SectionContent>
              )}
            </AnimatePresence>
          </FilterSection>
          
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('discount')}>
              <SectionTitle>Discount</SectionTitle>
              {expandedSections.discount ? <FiChevronUp /> : <FiChevronDown />}
            </FilterSectionHeader>
            
            <AnimatePresence>
              {expandedSections.discount && (
                <SectionContent
                  as={motion.div}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SaleFilter>
                    <CheckboxItem>
                      <CheckboxInput
                        type="checkbox"
                        id="on-sale"
                        checked={filters.onSale}
                        onChange={handleSaleChange}
                      />
                      <CheckboxLabel htmlFor="on-sale">On Sale</CheckboxLabel>
                    </CheckboxItem>
                  </SaleFilter>
                </SectionContent>
              )}
            </AnimatePresence>
          </FilterSection>
          
          <ClearFiltersButton onClick={clearAllFilters}>
            Clear All Filters
          </ClearFiltersButton>
        </FilterContent>
      </FilterContainer>
      
      {isOpen && <Overlay onClick={toggleMobileFilter} />}
    </>
  );
};

// Helper component for star ratings
const Stars = ({ rating }) => {
  return (
    <StarsContainer>
      {[...Array(5)].map((_, i) => (
        <Star key={i} filled={i < rating} />
      ))}
    </StarsContainer>
  );
};

const Star = ({ filled }) => (
  <StarIcon filled={filled}>★</StarIcon>
);

// Styled Components
const FilterContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 300px;
    z-index: 1000;
    border-radius: 0;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease;
    overflow-y: auto;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  
  @media (min-width: 769px) {
    padding: 1rem 1.5rem;
  }
`;

const FilterTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0;
  
  @media (min-width: 769px) {
    font-size: 1rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const FilterContent = styled.div`
  padding: 1.5rem;
`;

const SortByContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SortByLabel = styled.label`
  margin-right: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
`;

const SortBySelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  flex: 1;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

const FilterSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
`;

const SectionContent = styled.div`
  overflow: hidden;
  padding-top: 0.75rem;
`;

const CategoryOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CategoryOption = styled.div`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.selected ? '#000' : '#ddd'};
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.selected ? '#000' : 'transparent'};
  color: ${props => props.selected ? 'white' : 'inherit'};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #000;
  }
`;

const PriceRangeContainer = styled.div``;

const PriceInputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const PriceInput = styled.input`
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const PriceSeparator = styled.span`
  margin: 0 0.5rem;
  color: #666;
`;

const ColorOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const ColorOption = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color};
  cursor: pointer;
  border: 2px solid ${props => props.selected ? '#000' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    // Determine if text should be white or black based on background color
    const color = props.color.toLowerCase();
    return ['white', 'yellow', 'pink'].includes(color) ? '#000' : '#fff';
  }};
  
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
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.selected ? '#000' : '#ddd'};
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  background-color: ${props => props.selected ? '#000' : 'transparent'};
  color: ${props => props.selected ? 'white' : 'inherit'};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #000;
  }
`;

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
`;

const CheckboxInput = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  cursor: pointer;
`;

const RatingOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RatingOption = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.selected ? '#f5f5f5' : 'transparent'};
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const StarsContainer = styled.div`
  display: flex;
  margin-right: 0.5rem;
`;

const StarIcon = styled.span`
  color: ${props => props.filled ? '#ffc107' : '#ddd'};
  font-size: 1rem;
`;

const SaleFilter = styled.div`
  margin-top: 0.5rem;
`;

const ClearFiltersButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  
  &:hover {
    background-color: #f5f5f5;
    color: #000;
    border-color: #999;
  }
`;

const MobileFilterButton = styled.button`
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

export default FilterBar;