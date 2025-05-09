# Erziehen-Lernen-Fördern E-Commerce Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

## Overview

Projekt für das WEBAnwendungen-2 Praktikum.

### Technologiestack
- **Backend**: Node.js mit Express
- **Datenbank**: SQLite3
- **Frontend**: HTML, CSS, JavaScript mit Bootstrap 4
- **Persistenz**: LocalStorage für Warenkorbdaten



## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) (v6.x or higher)

### Notwendige NPM Pakete
- **Express.js**: Web-Framework für Node.js
- **SQLite3**: Leichtgewichtige SQL-Datenbank

## Installation

1. Clone the repository:
   ```powershell
   git clone https://github.com/Knoxii02/web2.git
   cd web2
   ```

2. Install required dependencies:
   ```powershell
   npm install express sqlite3
   ```

   Dieses Projekt benötigt Express.js als Web-Framework und SQLite3 für die Datenbankfunktionalität. Beide werden mit dem obigen Befehl installiert.

3. Initialize the database:
   ```powershell
   node initializeDatabase.js
   ```

## Running the Server

Start the development server:
```powershell
node server.js
```

The application will be available at `http://localhost:3000/index`.


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
