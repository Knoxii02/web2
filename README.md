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
- **Related Products**: Intelligente Produktempfehlungen mit SQL-basierter Zufallsauswahl

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
- **express**: Web-Framework für Node.js
- **sqlite3**: Leichtgewichtige SQL-Datenbank
- **cors**: Cross-Origin Resource Sharing
- **path**: Native Node.js Modul für Pfadverwaltung
- **fs**: Native Node.js Modul für Dateisystem-Operationen

## Installation

1. Clone the repository:
   ```powershell
   git clone https://github.com/Knoxii02/web2.git
   cd web2
   ```

2. Install required dependencies:
   ```powershell
   cd Website/backend
   npm install express sqlite3 cors
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

The backend server will be available at `http://localhost:3000/`.

## Project Structure

```
Website/
├── backend/
│   ├── server.js              # Hauptserver mit Express.js und allen APIs
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
│   │   └── related-products.js # Produktempfehlungen
│   └── pictures/             # Produktbilder und Assets
│       ├── book_1/           # Produktbilder für Buch 1
│       ├── book_2/           # Produktbilder für Buch 2
│       └── ...
└── Mockup.pdf                # Design-Mockups
```

## API Endpoints

### Produkt-APIs
- **`GET /api/products`** - Alle Produkte abrufen
  - Optional: `?category_id=X` für Kategoriefilterung
  - Liefert: Produktliste mit Bruttopreisen und erstem Bild
  
- **`GET /api/products/:id`** - Spezifisches Produkt nach ID
  - Parameter: `id` (Produkt-ID)
  - Liefert: Vollständige Produktdetails mit Bruttopreis
  
- **`GET /api/products/related`** - Zufällige Produktauswahl (Related Products)
  - Optional: `?limit=X` (Standard: 4)
  - Liefert: Zufällig ausgewählte Produkte für "Das könnte Sie auch interessieren"
  
- **`GET /api/products/firstImage/:folder`** - Erstes Bild eines Produktordners
  - Parameter: `folder` (Ordnername)
  - Liefert: Pfad zum ersten verfügbaren Bild
  
- **`GET /api/products/images/:folder`** - Alle Bilder eines Produktordners
  - Parameter: `folder` (Ordnername)
  - Liefert: Array aller verfügbaren Bilder für Bildergalerie

### Kategorie-APIs
- **`GET /api/categories`** - Alle verfügbaren Produktkategorien
  - Liefert: Liste aller Kategorien für Dropdown-Filter

### Statische Inhalte
- **`GET /pictures/*`** - Produktbilder und Assets
  - Statische Auslieferung aus `frontend/pictures/`
  
- **`GET /*`** - Frontend-Dateien (HTML, CSS, JS)
  - Automatische Auslieferung aller Frontend-Dateien

## Database Schema

Die SQLite-Datenbank verwendet folgende Haupttabellen:

### products
- **id**: Primärschlüssel
- **name**: Produktname
- **short_description**: Kurzbeschreibung
- **long_description**: Detaillierte Beschreibung
- **net_price**: Nettopreis
- **image_folder**: Ordner für Produktbilder
- **category_id**: Referenz zur Kategorie
- **vat_rate_id**: Referenz zum MwSt-Satz

### categories
- **id**: Primärschlüssel
- **name**: Kategoriename

### vat_rates
- **id**: Primärschlüssel
- **name**: MwSt-Bezeichnung
- **rate_percentage**: MwSt-Prozentsatz

Siehe [database_setup.sql](Website/backend/db/database_setup.sql) für das vollständige Schema.