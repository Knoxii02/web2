/**
 * Gemeinsame Funktion zum Laden und Anzeigen verwandter Produkte
 * 
 * @param {string} containerId - ID des Containers, in dem die verwandten Produkte angezeigt werden sollen
 * @param {number|null} excludeProductId - ID des aktuellen Produkts, das nicht in den Empfehlungen angezeigt werden soll (optional)
 * @param {number[]|null} excludeProductIds - Array von Produkt-IDs, die nicht in den Empfehlungen angezeigt werden sollen (optional)
 * @param {number} limit - Anzahl der anzuzeigenden Produkte (Standard: 4)
 */
async function loadAndDisplayRelatedProducts(containerId, excludeProductId = null, excludeProductIds = [], limit = 4) {
    try {
        // Container finden
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container mit ID "${containerId}" nicht gefunden.`);
            return;
        }

        // Produkte vom Server abrufen
        const response = await fetch('/api/products');
        const products = await response.json();

        // Produkte filtern
        let filteredProducts = products;

        // Einzelnes Produkt ausschließen (z.B. aktuelle Produktseite)
        if (excludeProductId !== null) {
            filteredProducts = filteredProducts.filter(product => product.id !== excludeProductId);
        }

        // Mehrere Produkte ausschließen (z.B. Produkte, die bereits im Warenkorb sind)
        if (excludeProductIds.length > 0) {
            filteredProducts = filteredProducts.filter(product => !excludeProductIds.includes(product.id));
        }

        // Zufällige Produkte auswählen
        const randomProducts = filteredProducts.sort(() => 0.5 - Math.random()).slice(0, limit);

        // Container leeren
        container.innerHTML = '';

        // Produkte hinzufügen
        randomProducts.forEach(product => {
            const productURL = `/product?id=${product.id}`;
            const badgeClass = getBadgeClass(product.category);

            const productHTML = `
                <div class="col-md-3 mb-4" data-category="${product.category}" data-product-id="${product.id}" data-product-url="${productURL}">
                    <div class="card h-100">
                        <div class="product-img-container card-clickable">
                            <img src="../pictures/${product.image_folder}/${product.firstImage}" class="card-img-top" alt="${product.name}">
                        </div>
                        <div class="card-body card-clickable d-flex flex-column">
                            <span class="badge ${badgeClass} mb-2">${product.category}</span>
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text flex-grow-1">${product.short_description || product.long_description}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between align-items-center">
                            <strong>${product.price.toFixed(2)} €</strong>
                            <a href="${productURL}" class="btn btn-primary btn-sm">Details</a>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', productHTML);
        });

        // Klick-Events hinzufügen
        addClickEventsToProductCards();
    } catch (error) {
        console.error('Fehler beim Laden der Produkte:', error);
    }
}

/**
 * Fügt Klick-Events zu allen Produktkarten hinzu
 */
function addClickEventsToProductCards() {
    document.querySelectorAll('.col-md-3.mb-4').forEach(card => {
        const productURL = card.getAttribute('data-product-url');

        // Klickbare Elemente zur Produktseite navigieren lassen
        card.querySelectorAll('.card-clickable').forEach(element => {
            element.style.cursor = 'pointer';
            element.addEventListener('click', () => {
                window.location.href = productURL;
            });
        });

        // Auch den Kartentitel klickbar machen
        const cardTitle = card.querySelector('.card-title');
        if (cardTitle) {
            cardTitle.style.cursor = 'pointer';
            cardTitle.addEventListener('click', () => {
                window.location.href = productURL;
            });
        }
    });
}

/**
 * Gibt die passende Bootstrap-Badge-Klasse für eine Kategorie zurück
 * 
 * @param {string} category - Produktkategorie
 * @returns {string} Badge-Klasse
 */
function getBadgeClass(category) {
    switch (category) {
        case 'Arbeitsheft':
            return 'badge-primary';
        case 'Buch':
            return 'badge-success';
        case 'Arbeitsmaterial':
            return 'badge-warning';
        default:
            return 'badge-secondary';
    }
}
