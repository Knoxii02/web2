let productImages = [];

let currentImageIndex = 0;

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % productImages.length;
    document.getElementById('mainProductImage').src = productImages[currentImageIndex];
}

function previousImage() {
    currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
    document.getElementById('mainProductImage').src = productImages[currentImageIndex];
}

document.addEventListener('DOMContentLoaded', function () {
    const quantityInput = document.getElementById('quantityInput');
    const incrementButton = document.getElementById('incrementButton');
    const decrementButton = document.getElementById('decrementButton');

    incrementButton.addEventListener('click', function () {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });

    decrementButton.addEventListener('click', function () {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });

    quantityInput.addEventListener('change', function () {
        if (this.value < 1) {
            this.value = 1;
        }
    });
});

function formatPrice(price) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
}

function formatPriceGerman(price) {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
        return "N/A";
    }
    return numericPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

//Script für das Laden von Produktdetails und Bildergalerie
document.addEventListener('DOMContentLoaded', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');

            if (!productId) {
                console.error('Keine Produkt-ID in der URL gefunden.');
                return;
            } try {
                const response = await fetch(`http://localhost:3000/api/products/${productId}`);
                const product = await response.json();

                document.querySelector('h1').textContent = product.name;
                document.getElementById('mainProductImage').src = product.firstImage;
                document.getElementById('productCategory').textContent = product.category_name;
                document.getElementById('productCategory').className = `badge ${getBadgeClass(product.category_name)}`;
                document.getElementById('productPrice').textContent = formatPriceGerman(product.gross_price) + " €";
                document.getElementById('vatInfo').textContent = `inkl. ${product.vat_percentage}% MwSt.`;

                const descriptionElement = document.getElementById('productDescription');
                if (product.long_description) {
                    const paragraphs = product.long_description.split('\n').filter(p => p.trim() !== '');
                    descriptionElement.innerHTML = '';

                    paragraphs.forEach(paragraph => {
                        const p = document.createElement('p');
                        p.textContent = paragraph;
                        descriptionElement.appendChild(p);
                    });
                } else {
                    descriptionElement.innerHTML = '<p>Keine Beschreibung verfügbar</p>';
                }

                try {
                    const imagesResponse = await fetch(`http://localhost:3000/api/products/images/${product.image_folder}`);

                    if (imagesResponse.ok) {
                        const imageData = await imagesResponse.json();
                        productImages = imageData.images;
                    } else {
                        productImages = product.firstImage ? [product.firstImage] : []; 
                    }
                } catch (imageError) {
                    console.error('Error loading product images:', imageError);
                    productImages = product.firstImage ? [product.firstImage] : [];
                }
            } catch (error) {
                console.error('Fehler beim Laden des Produkts:', error);
            }
        });

//Warenkorb-Funktionalität Script
document.addEventListener('DOMContentLoaded', () => {
            const addToCartButton = document.getElementById('addToCartButton');

            addToCartButton.addEventListener('click', () => {
                const urlParams = new URLSearchParams(window.location.search);
                const productId = parseInt(urlParams.get('id'), 10);
                const quantityInput = document.querySelector('#quantityInput');
                const quantity = parseInt(quantityInput?.value, 10) || 1;

                if (!productId) {
                    console.error('Keine Produkt-ID gefunden.');
                    return;
                }

                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItem = cart.find(item => item.productId === productId);

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({ productId, quantity });
                }
                localStorage.setItem('cart', JSON.stringify(cart));

                const btnOriginalText = addToCartButton.innerHTML;
                addToCartButton.innerHTML = '<i class="bi bi-check"></i> Hinzugefügt';
                addToCartButton.classList.add('btn-success');
                addToCartButton.classList.remove('btn-primary');

                setTimeout(() => {
                    addToCartButton.innerHTML = btnOriginalText;
                    addToCartButton.classList.remove('btn-success');
                    addToCartButton.classList.add('btn-primary');
                }, 2000);
            });
        });

//Das könnte Sie auch interessieren Script
document.addEventListener('DOMContentLoaded', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = parseInt(urlParams.get('id'), 10);

            if (productId) {
                loadAndDisplayRelatedProducts('related-products-container', [productId], 4);
            } else {
                loadAndDisplayRelatedProducts('related-products-container', null, 4);
            }
        });
