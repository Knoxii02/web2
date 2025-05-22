async function loadAndDisplayRelatedProducts(containerId, excludeProductId = null, excludeProductIds = [], limit = 4) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container mit ID "${containerId}" nicht gefunden.`);
            return;
        }

        const response = await fetch('/api/products');
        const products = await response.json();

        let filteredProducts = products;

        if (excludeProductId !== null) {
            filteredProducts = filteredProducts.filter(product => product.id !== excludeProductId);
        }

        if (excludeProductIds.length > 0) {
            filteredProducts = filteredProducts.filter(product => !excludeProductIds.includes(product.id));
        }

        const randomProducts = filteredProducts.sort(() => 0.5 - Math.random()).slice(0, limit);

        container.innerHTML = '';

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
                            <p class="card-text flex-grow-1">${product.short_description}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between align-items-center">
                            <strong>${(product.price * 1.07).toFixed(2)} €</strong>
                            <a href="${productURL}" class="btn btn-primary btn-sm">Details</a>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', productHTML);
        });

        addClickEventsToProductCards();
    } catch (error) {
        console.error('Fehler beim Laden der Produkte:', error);
    }
}


function addClickEventsToProductCards() {
    document.querySelectorAll('.col-md-3.mb-4').forEach(card => {
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
