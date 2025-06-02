# Erziehen-Lernen-Fördern E-Commerce Platform

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)

## Overview
Projekt für das WEBAnwendungen-2 Praktikum.

Eine vollständige E-Commerce-Plattform für pädagogische Materialien mit modernem Frontend, robustem Backend und umfassender Datenbankverwaltung.

### Technologiestack
- **Backend**: Node.js mit Express.js
- **Datenbank**: SQLite3 mit strukturierter Schema-Verwaltung
- **Frontend**: HTML5, CSS3, JavaScript (ES6+) mit Bootstrap 4
- **Icons**: Bootstrap Icons
- **Persistenz**: LocalStorage für Warenkorbdaten
- **API**: RESTful Services für Produktverwaltung und Kategoriefilterung

## Features

### Frontend
- **Responsive Design**: Mobile-first Bootstrap 4 Layout
- **Produktkatalog**: Dynamische Produktanzeige mit Kategoriefilterung
- **Warenkorb**: Persistente Warenkorbfunktionalität mit LocalStorage
- **Produktdetails**: Detailseiten mit Bildergalerie und umfassenden Produktinformationen
- **Checkout-Prozess**: Vollständiger Bestellablauf mit Formularvalidierung
- **Navigation**: Responsive Navbar mit Warenkorb-Integration

### Backend
- **RESTful API**: Strukturierte Endpunkte für alle Funktionalitäten
- **Datenbankmanagement**: Automatisierte SQLite-Datenbankinitialisierung
- **Kategorieverwaltung**: Dynamische Kategoriefilterung
- **Produktverwaltung**: CRUD-Operationen für Produkte
- **Bilderverwaltung**: Strukturierte Bildordner-Organisation
- **Related Products**: Intelligente Produktempfehlungen

### Seiten
- **[index.html](Website/frontend/index.html)**: Startseite mit Carousel und Featured Products
- **[shop.html](Website/frontend/shop.html)**: Produktkatalog mit Kategoriefilterung
- **[product.html](Website/frontend/product.html)**: Detailansicht mit Bildergalerie
- **[shopping-cart.html](Website/frontend/shopping-cart.html)**: Warenkorbverwaltung
- **[checkout.html](Website/frontend/checkout.html)**: Bestellprozess
- **[confirmation.html](Website/frontend/confirmation.html)**: Bestellbestätigung
- **[contact.html](Website/frontend/contact.html)**: Kontaktformular und Unternehmensinformationen
- **[imprint.html](Website/frontend/imprint.html)**: Impressum
- **[privacy-policy.html](Website/frontend/privacy-policy.html)**: Datenschutzerklärung
- **[payment-terms.html](Website/frontend/payment-terms.html)**: Liefer- und Zahlungsbedingungen

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) (v6.x or higher)

### Notwendige NPM Pakete
- **Express.js**: Web-Framework für Node.js
- **SQLite3**: Leichtgewichtige SQL-Datenbank
- **Path**: Native Node.js Modul für Pfadverwaltung

## Installation

1. Clone the repository:
   ```powershell
   git clone https://github.com/Knoxii02/web2.git
   cd web2
   ```

2. Install required dependencies:
   ```powershell
   cd Website/backend
   npm install
   ```

3. Initialize the database:
   ```powershell
   node scripts/setup_db.js
   ```

## Running the Server

Start the development server:
```powershell
cd Website/backend
node server.js
```

The application will be available at `http://localhost:3000/index.html`.

## Project Structure

```
Website/
├── backend/
│   ├── server.js              # Hauptserver mit Express.js
│   ├── package.json           # NPM Abhängigkeiten
│   ├── db/
│   │   ├── database_setup.sql # Datenbankschema
│   │   └── database.sqlite    # SQLite Datenbankdatei
│   └── scripts/
│       └── setup_db.js        # Datenbankinitialisierung
├── frontend/
│   ├── *.html                 # HTML-Seiten
│   ├── css/
│   │   ├── base.css          # Basis-Styles
│   │   ├── index.css         # Startseiten-Styles
│   │   ├── shop.css          # Shop-Styles
│   │   ├── product.css       # Produktdetail-Styles
│   │   ├── shopping-cart.css # Warenkorb-Styles
│   │   └── checkout.css      # Checkout-Styles
│   ├── js/
│   │   ├── product.js        # Produktfunktionalitäten
│   │   ├── shop.js           # Shop- und Kategorielogik
│   │   ├── cart.js           # Warenkorbmanagement
│   │   ├── checkout.js       # Checkout-Prozess
│   │   └── related-products.js # Produktempfehlungen
│   └── pictures/             # Produktbilder und Assets
└── Mockup.pdf                # Design-Mockups
```

## API Endpoints

### Produkte
- `GET /api/products` - Alle Produkte (optional: `?categoryId=X` für Filterung)
- `GET /api/products/:id` - Spezifisches Produkt nach ID
- `GET /api/products/random/:count` - Zufällige Produktauswahl
- `GET /api/products/images/:folder` - Produktbilder nach Ordner

### Kategorien
- `GET /api/categories` - Alle verfügbaren Kategorien

### Statische Inhalte
- `GET /pictures/:folder/:filename` - Bildauslieferung
- `GET /*` - Frontend-Dateien (HTML, CSS, JS)

## Database Schema

Die Datenbank verwendet ein strukturiertes Schema mit folgenden Haupttabellen:
- **products**: Produktinformationen mit Kategoriezuordnung
- **categories**: Produktkategorien
- **vat_rates**: Mehrwertsteuersätze

Siehe [database_setup.sql](Website/backend/db/database_setup.sql) für das vollständige Schema.

## Development

### JavaScript Modules
- **Modulare Architektur**: Getrennte JS-Module für verschiedene Funktionalitäten
- **ES6 Features**: Moderne JavaScript-Syntax mit async/await
- **Error Handling**: Umfassende Fehlerbehandlung in allen Modulen
- **LocalStorage Integration**: Persistente Datenspecherung im Browser

### CSS Architecture
- **Bootstrap 4**: Responsive Grid-System und Komponenten
- **Custom Styles**: Spezifische Anpassungen pro Seite
- **Mobile-First**: Responsive Design für alle Bildschirmgrößen

### Backend Features
- **CORS Support**: Cross-Origin Resource Sharing aktiviert
- **Static File Serving**: Automatische Auslieferung von Frontend-Assets
- **Database Connection Management**: Sichere SQLite-Verbindungen
- **Error Middleware**: Zentrale Fehlerbehandlung

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## License

This project is licensed under the MIT License.