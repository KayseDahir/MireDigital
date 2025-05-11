# Miredigital E-Commerce Platform

Miredigital is a full-stack e-commerce platform built using the MERN stack (MongoDB, Express, React, Node.js). This repository contains both the frontend (client) and backend (server) code.

## Features

- **User Authentication**: Secure login and registration system.
- **Product Management**: Add, edit, and delete products.
- **Shopping Cart**: Add products to the cart and proceed to checkout.
- **Order Management**: Track orders and manage inventory.
- **Admin Dashboard**: Manage categories, products, and orders.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Frontend**: React, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **State Management**: Context API
- **Other Tools**: Axios, JWT for authentication

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/miredigital.git
   cd miredigital
   ```
2. Install dependencies for both the client and server:
   cd client
   npm install
   cd ../server
   npm install

3. Create a .env file in the server directory and add the following:
   MONGO_URI=your-mongodb-uri
   JWT_SECRET=your-jwt-secret

4. Start the development servers:

- Frontend:
  cd client
  npm start

- Backend:
  cd server
  npm start

5. Open your browser and navigate to http://localhost:3000.

Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

License
This project is licensed under the MIT License.
