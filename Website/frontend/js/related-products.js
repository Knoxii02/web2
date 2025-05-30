async function loadAndDisplayRelatedProducts(containerId, excludeProductId = null, limit = 4) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container mit ID "${containerId}" nicht gefunden.`);
            return;
        }

        let fetchLimit = limit;
        if (excludeProductId !== null) {
            fetchLimit = limit + 1; // Fetch one more to allow filtering
        }

        const response = await fetch(`http://localhost:3000/api/products/related?limit=${fetchLimit}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let relatedProducts = await response.json();

        if (excludeProductId !== null) {
            relatedProducts = relatedProducts.filter(product => product.id !== excludeProductId);
        }
        
        // Ensure we have the correct number of products after filtering
        relatedProducts = relatedProducts.slice(0, limit);

        container.innerHTML = ''; // Clear existing content

        if (relatedProducts.length === 0) {
            // Optionally, display a message if no related products are found
            // container.innerHTML = '<p>Keine ähnlichen Produkte gefunden.</p>';
            return;
        }

        relatedProducts.forEach(product => {
            const productURL = `product.html?id=${product.id}`;
            // Ensure getBadgeClass is defined or imported if this script is modular
            const badgeClass = getBadgeClass(product.category_name); 

            const productHTML = `
                <div class="col-md-3 mb-4" data-category="${product.category_name}" data-product-id="${product.id}" data-product-url="${productURL}">
                    <div class="card h-100">
                        <div class="product-img-container card-clickable">
                            <img src="${product.firstImage}" class="card-img-top" alt="${product.name}">
                        </div>
                        <div class="card-body card-clickable d-flex flex-column">
                            <span class="badge ${badgeClass} mb-2">${product.category_name}</span>
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text flex-grow-1">${product.short_description || ''}</p>
                        </div>
                        <div class="card-footer">
                            <div class="d-flex justify-content-between align-items-center">
                                <strong>${formatPriceGerman(product.gross_price)} €</strong>
                                <a href="${productURL}" class="btn btn-primary btn-sm">Details</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', productHTML);
        });

        addClickEventsToProductCards(); // Ensure this function is defined or imported
    } catch (error) {
        console.error('Fehler beim Laden der ähnlichen Produkte:', error);
    }
}

// This function might be duplicated if not managed by a module system.
// Ensure it's available, or consider moving it to a shared utility script.
function getBadgeClass(categoryName) {
    switch (categoryName) {
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

// Ensure addClickEventsToProductCards is defined.
// If it's identical to the one in shop.html, consider a shared utility script.
function addClickEventsToProductCards() {
    // Assuming the related products container might have a different ID or class structure,
    // this selector might need to be more specific or passed as an argument if necessary.
    document.querySelectorAll('#' + (document.getElementById('related-products-container') ? 'related-products-container' : document.getElementById('product-cards-container') ? 'product-cards-container' : '') + ' .col-md-3.mb-4').forEach(card => {
        const productURL = card.getAttribute('data-product-url');

        card.querySelectorAll('.card-clickable').forEach(element => {
            element.style.cursor = 'pointer';
            element.addEventListener('click', () => {
                window.location.href = productURL;
            });
        });

        const cardTitle = card.querySelector('.card-title');
        if (cardTitle) {
            cardTitle.style.cursor = 'pointer';
            cardTitle.addEventListener('click', () => {
                window.location.href = productURL;
            });
        }
    });
}

function formatPriceGerman(price) {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
        // console.error("Invalid price input for formatPriceGerman:", price);
        return "N/A"; // Or some other placeholder
    }
    return numericPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
