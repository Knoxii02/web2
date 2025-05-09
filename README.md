# Erziehen-Lernen-Fördern E-Commerce Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Overview

This is the codebase for the Erziehen-Lernen-Fördern e-commerce platform, an educational materials shop specializing in teaching resources, workbooks, and learning materials. The platform features a dynamic shopping cart system, product management, and a clean, responsive user interface.

## Features

- Responsive design for all devices
- Dynamic product catalog with search and filters
- Interactive product pages with image galleries
- Shopping cart with persistent local storage
- Checkout process with order management
- Consistent UI/UX across all pages

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) (v6.x or higher)

## Installation

1. Clone the repository:
   ```powershell
   git clone https://github.com/your-repo/web2.git
   cd web2
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Initialize the database:
   ```powershell
   node initializeDatabase.js
   ```

## Running the Server

Start the development server:
```powershell
node server.js
```

The application will be available at `http://localhost:3000`.

For production environments, consider using a process manager like PM2:
```powershell
npm install -g pm2
pm2 start server.js --name "elf-shop"
```

## Project Structure

- `/server.js` - Main application server
- `/database.sqlite` - SQLite database for product information
- `/Website/` - Front-end assets
  - `/css/` - Stylesheets
  - `/html/` - HTML templates
  - `/js/` - JavaScript files
  - `/pictures/` - Product images and assets

## API Endpoints

- `GET /api/products` - Returns all products
- `GET /api/products/:id` - Returns a specific product by ID
- `POST /api/orders` - Creates a new order

## Development

The site uses vanilla JavaScript with Bootstrap 4 for styling. The server is built on Node.js with Express.

To modify the product database:
```powershell
node initializeDatabase.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Maintainer - [Your Name](mailto:your.email@example.com)
