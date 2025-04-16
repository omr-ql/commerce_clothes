const products = [
    {
      id: '1',
      name: 'Classic White T-Shirt',
      description: 'A timeless white t-shirt made from premium cotton for everyday comfort and style.',
      price: 29.99,
      originalPrice: null,
      images: [
        '/images/products/white-tshirt-1.jpg',
        '/images/products/white-tshirt-2.jpg',
      ],
      colors: ['White', 'Black', 'Gray'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      category: 'men',
      isNew: false,
      isSale: false,
      rating: 4.5,
      reviewCount: 42
    },
    {
      id: '2',
      name: 'Slim Fit Jeans',
      description: 'Modern slim fit jeans with a comfortable stretch. Perfect for any casual occasion.',
      price: 59.99,
      originalPrice: 79.99,
      images: [
        '/images/products/slim-jeans-1.jpg',
        '/images/products/slim-jeans-2.jpg',
      ],
      colors: ['Blue', 'Black'],
      sizes: ['30x30', '32x30', '34x30', '36x30'],
      category: 'men',
      isNew: false,
      isSale: true,
      rating: 4.2,
      reviewCount: 28
    },
    {
      id: '3',
      name: 'Floral Summer Dress',
      description: 'A beautiful floral dress perfect for summer days and special occasions.',
      price: 49.99,
      originalPrice: null,
      images: [
        '/images/products/floral-dress-1.jpg',
        '/images/products/floral-dress-2.jpg',
      ],
      colors: ['Blue', 'Pink'],
      sizes: ['XS', 'S', 'M', 'L'],
      category: 'women',
      isNew: true,
      isSale: false,
      rating: 4.8,
      reviewCount: 16
    },
    {
      id: '4',
      name: 'Leather Jacket',
      description: 'Classic leather jacket with a modern twist. Made from premium materials for durability and style.',
      price: 199.99,
      originalPrice: 249.99,
      images: [
        '/images/products/leather-jacket-1.jpg',
        '/images/products/leather-jacket-2.jpg',
      ],
      colors: ['Brown', 'Black'],
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'women',
      isNew: false,
      isSale: true,
      rating: 4.6,
      reviewCount: 35
    },
    {
      id: '5',
      name: 'Wool Sweater',
      description: 'Cozy wool sweater for those chilly days. Features a classic design that never goes out of style.',
      price: 89.99,
      originalPrice: null,
      images: [
        '/images/products/wool-sweater-1.jpg',
        '/images/products/wool-sweater-2.jpg',
      ],
      colors: ['Gray', 'Navy', 'Beige'],
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'men',
      isNew: false,
      isSale: false,
      rating: 4.7,
      reviewCount: 20
    },
    {
      id: '6',
      name: 'Casual Sneakers',
      description: 'Comfortable and stylish sneakers perfect for everyday wear.',
      price: 69.99,
      originalPrice: 89.99,
      images: [
        '/images/products/sneakers-1.jpg',
        '/images/products/sneakers-2.jpg',
      ],
      colors: ['White', 'Black', 'Red'],
      sizes: ['7', '8', '9', '10', '11'],
      category: 'accessories',
      isNew: true,
      isSale: true,
      rating: 4.4,
      reviewCount: 50
    },
    {
      id: '7',
      name: 'Denim Jacket',
      description: 'Classic denim jacket with a relaxed fit, perfect for layering.',
      price: 79.99,
      originalPrice: null,
      images: [
        '/images/products/denim-jacket-1.jpg',
        '/images/products/denim-jacket-2.jpg',
      ],
      colors: ['Blue', 'Black'],
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'men',
      isNew: true,
      isSale: false,
      rating: 4.3,
      reviewCount: 33
    },
    {
      id: '8',
      name: 'Silk Scarf',
      description: 'Elegant silk scarf with vibrant patterns to complement any outfit.',
      price: 39.99,
      originalPrice: null,
      images: [
        '/images/products/silk-scarf-1.jpg',
        '/images/products/silk-scarf-2.jpg',
      ],
      colors: ['Red', 'Blue', 'Green'],
      sizes: ['One Size'],
      category: 'accessories',
      isNew: false,
      isSale: false,
      rating: 4.9,
      reviewCount: 12
    }
  ];
  
  export default products;
  