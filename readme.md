This e-commerce API, built with Node.js, Express, and PostgreSQL. 

Shops manage their product inventory by adding, modifying, and removing items. Buyers can curate their shopping experience by adding, updating, deleting, and viewing products within their cart. Both buyers and shops can access a comprehensive view of all available products. Additionally, shops can oversee their specific product listings and track order histories.

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
3. Create database tables

### users
```
 user_id      | character varying(255)      |           | not null | primary key
 email        | character varying(255)      |           | not null | 
 password     | character varying(255)      |           | not null | 
 refreshtoken | character varying(255)      |           |          | 
 created_at   | timestamp without time zone |           | not null | 
 role         | myrole                      |           | not null | 
```
- Create enum for myrole: values  are (buyer, shop)
### products
```
 product_id  | character varying(255)      |           | not null | primary key
 name        | character varying(255)      |           | not null | 
 category    | mycategory                  |           | not null | 
 description | text                        |           | not null         | 
 price       | numeric(10,2)               |           | not null        | 
 quantity    | integer                     |           | not null | 
 owner_id    | character varying(255)      |           |          | foreign key
 created_at  | timestamp without time zone |           | not null | 
 updated_at  | timestamp without time zone |           | not null | 
```
- Create enum for mycategory : values  are (electronics, arts, kitchen, garden, office, beauty, game, garden, exercise)
### cart
```
 cart_id    | character varying(255)      |           | not null | primary key
 product_id | character varying(255)      |           |          | foreign key
 quantity   | integer                     |           | not null | 
 created_at | timestamp without time zone |           | not null | 
 updated_at | timestamp without time zone |           | not null | 
 buyer_id   | character varying(255)      |           |          | 
```
### orders
```
-------------+-----------------------------+-----------+----------+---------
 order_id    | character varying(255)      |           | not null | primary key
 product_id  | character varying(255)      |           | not null | foreign key
 quantity    | integer                     |           | not null | 
 price       | numeric(10,2)               |           | not null | 
 description | text                        |           |          | 
 category    | mycategory                  |           | not null | 
 created_at  | timestamp without time zone |           | not null | 
 updated_at  | timestamp without time zone |           | not null | 
 buyer_id    | character varying(255)      |           |          | 
 owner_id    | character varying(255)      |           |          | 


```
5. Create a .env file and add your environment variables
```
PORT=<Add PORT>
PG_USER=<Add PG_USER>
PG_HOST=<Add PG_HOST>
PG_DATABASE=<Add PG_DATABASE>
PG_PASSWORD=<Add PG_PASSWORD>
PG_PORT=<Add PG_PORT>
SECRET_TOKEN=<Add SECRET_TOKEN>
REFRESH_TOKEN=<Add REFRESH_TOKEN>
DATABASE_URL=<Add DATABASE_URL>
```
   
7. Start the server:
   - npm run dev

## API Endpoints

main URL: `localhost:3000/api/ecommerce`

### Authentication

- register: `POST: /register`
- login: `POST: /login`
- log out: `   POST: /logout`

### Products

- get Products: `GET: /product`
- get one product: `GET: /product/:id`
- get products by shop: `GET: /seller`
- Add Products: `POST: /product`
- update product: `PUT: /product/:id`
- delete product: `DELETE: /product/:id`

### Cart

- add to cart: `POST: /cart`
- get cart items: `GET: /cart`
- update cart items:`UPDATE: /cart:id`
- delete cart items: `DELETE: /cart:id`
- checkout: `POST: /cart/checkout`

### Orders

- get order by shop: `GET: /orders`
- delete orders: `DELETE: /orders/:id`

NB: item are added to the order table during checkout
