This e-commerce platform, built with Node.js, Express, and PostgreSQL, empowers shops to manage their product inventory by adding, modifying, and removing items. Buyers can curate their shopping experience by adding, updating, deleting, and viewing products within their cart. Both buyers and shops can access a comprehensive view of all available products. Additionally, shops can oversee their specific product listings and track order histories.

## Features

- User authentication and authorization
- Product listing and management
- Shopping cart functionality
- Order processing

## Technologies Used

- Node.js
- Express
- PostgreSQL
- TypeScript
- UUID

## Prerequisites

- Node.js and npm
- PostgreSQL

## Installation

1. Clone the repository:
   - git clone https://github.com/G-Gakii/ecommerce1-backend.git
   - cd ecommerce1-backend
2. Install dependencies:
   - npm start
3. create tables
4. Create a .env file and add your environment variables
5. Start the server:
   - npm run dev

## API Endpoints

main url:localhost:3000/api/ecommerce

### Authentication

- register:/register
- log in: /login
- log out :/logout

### Products

- get Products: /product
- get one product:/product/:id
- get products by shop: /seller
- Add Products: /product
- update product: /product/:id
- delete product:/product/:id

### Cart

- add to cart:/cart
- get cart items:/cart
- update cart items:/cart:id
- delete cart items:/cart:id
- checkout :/cart/checkout

### Orders

get order by shop:/orders
delete orders:/orders/:id

NB: item are added to order table during checkout
