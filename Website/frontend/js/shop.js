
function getBadgeClass(categoryName) {
    switch (categoryName) {
        case 'Arbeitsheft':
            return 'badge-info';
        case 'Buch':
            return 'badge-success';
        case 'Arbeitsmaterial':
            return 'badge-warning';
        default:
            return 'badge-success';
    }
}

async function fetchProducts(categoryId = null) {
    let url = 'http://localhost:3000/api/products';
    if (categoryId) {
        url += `/byCategory/${categoryId}`;
    }
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Laden der Produkte:', error);
        return [];
    }
}

function renderProducts(products) {
    const productContainer = document.getElementById('product-cards-container');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const badgeClass = getBadgeClass(product.category_name);
        const displayPrice = typeof formatPriceGerman === 'function' 
                             ? formatPriceGerman(product.gross_price) + ' €' 
                             : (product.gross_price.toFixed(2) + ' €');

        const productHTML = `
            <div class="col-md-3 mb-4" data-category="${product.category_name}" data-product-id="${product.id}" data-product-url="product.html?id=${product.id}">
                <div class="card h-100">                                    
                    <div class="product-img-container card-clickable">
                        <img src="${product.firstImage}" class="card-img-top" alt="${product.name}">
                    </div>
                    <div class="card-body card-clickable d-flex flex-column">                                        
                        <span class="badge ${badgeClass} mb-2">${product.category_name}</span>
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text flex-grow-1">${product.short_description || product.long_description}</p>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-between align-items-center w-100">
                            <strong>${displayPrice}</strong> 
                            <a href="product.html?id=${product.id}" class="btn btn-primary btn-sm">Details</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productContainer.insertAdjacentHTML('beforeend', productHTML);
    });
    addClickEventsToCards();
}

function addClickEventsToCards() {
    document.querySelectorAll('#product-cards-container .col-md-3').forEach(card => {
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

async function populateCategoryDropdown() {
    const dropdownMenu = document.querySelector('.dropdown-menu[aria-labelledby="kategorieDropdown"]');
    const dropdownButton = document.getElementById('kategorieDropdown');
    dropdownMenu.innerHTML = '';

    try {
        const response = await fetch('http://localhost:3000/api/categories');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categories = await response.json();

        const allOption = document.createElement('a');
        allOption.classList.add('dropdown-item', 'active');
        allOption.href = '#';
        allOption.textContent = 'Alle';
        allOption.dataset.categoryId = '';
        dropdownMenu.appendChild(allOption);

        const divider = document.createElement('div');
        divider.classList.add('dropdown-divider');
        dropdownMenu.appendChild(divider);

        categories.forEach(category => {
            const item = document.createElement('a');
            item.classList.add('dropdown-item');
            item.href = '#';
            item.textContent = category.name;
            item.dataset.categoryId = category.id;
            dropdownMenu.appendChild(item);
        });
        
        dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', async (event) => {
                event.preventDefault();
                const selectedCategoryName = item.textContent;
                const categoryId = item.dataset.categoryId;
                
                if (dropdownButton) {
                    dropdownButton.textContent = selectedCategoryName;
                }
                
                dropdownMenu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const products = await fetchProducts(categoryId);
                renderProducts(products);
            });
        });

    } catch (error) {
        console.error('Fehler beim Laden der Kategorien:', error);
        if (dropdownMenu.children.length === 0) {
            const allOption = document.createElement('a');
            allOption.classList.add('dropdown-item', 'active');
            allOption.href = '#';
            allOption.textContent = 'Alle';
            allOption.dataset.categoryId = '';
            dropdownMenu.appendChild(allOption);
             allOption.addEventListener('click', async (event) => {
                event.preventDefault();
                if (dropdownButton) {
                    dropdownButton.textContent = 'Alle';
                }
                dropdownMenu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
                allOption.classList.add('active');
                const products = await fetchProducts();
                renderProducts(products);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    
    await populateCategoryDropdown();
    const initialProducts = await fetchProducts();
    renderProducts(initialProducts);
});
