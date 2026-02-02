export const mockAdmin = {
  id: 1,
  email: 'admin@test.com',
  name: 'Admin Test',
  role: 'admin',
  password_hash: '$2b$10$TESTHASHEDPASSWORD'
};

export const mockProduct = {
  id: 1,
  category_id: 1,
  brand_id: 1,
  name: 'Test Product',
  slug: 'test-product',
  description: 'Description du produit test',
  price: 99.99,
  stock_quantity: 10,
  sku: 'TEST-001',
  created_at: new Date(),
  updated_at: new Date()
};

export const mockProducts = [
  mockProduct,
  {
    id: 2,
    category_id: 1,
    brand_id: 1,
    name: 'Test Product 2',
    slug: 'test-product-2',
    description: 'Description du produit test 2',
    price: 149.99,
    stock_quantity: 5,
    sku: 'TEST-002',
    created_at: new Date(),
    updated_at: new Date()
  }
];

export const mockOrder = {
  id: 1,
  order_number: 'ORD-20260130-001',
  customer_email: 'customer@test.com',
  customer_name: 'Client Test',
  customer_phone: '0123456789',
  shipping_address: '123 Rue Test',
  shipping_city: 'Paris',
  shipping_postal_code: '75001',
  shipping_country: 'France',
  total_amount: 199.98,
  payment_status: 'pending',
  order_status: 'pending',
  payment_intent_id: null,
  created_at: new Date(),
  updated_at: new Date()
};

export const mockOrderItems = [
  {
    id: 1,
    order_id: 1,
    product_id: 1,
    product_name: 'Test Product',
    quantity: 2,
    unit_price: 99.99,
    subtotal: 199.98
  }
];

export const mockOrderWithItems = {
  ...mockOrder,
  items: mockOrderItems
};

export const mockCreateOrderData = {
  customer_email: 'customer@test.com',
  customer_name: 'Client Test',
  customer_phone: '0123456789',
  shipping_address: '123 Rue Test',
  shipping_city: 'Paris',
  shipping_postal_code: '75001',
  shipping_country: 'France',
  items: [
    {
      product_id: 1,
      quantity: 2
    }
  ]
};

export const mockBrand = {
  id: 1,
  name: 'Test Brand',
  slug: 'test-brand',
  logo_url: '/images/brands/test-brand.png',
  created_at: new Date()
};
