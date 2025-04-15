document.addEventListener('DOMContentLoaded', function() {
    // Product click navigation - apply to all product cards
    const productCards = document.querySelectorAll('[data-category]');
    
    productCards.forEach(productContainer => {
        const card = productContainer.querySelector('.card');
        if (!card) return;

        // Nur card-img-top und card-body sind klickbar (wie auf der Shopseite)
        const cardBody = card.querySelector('.card-body');
        const cardImage = card.querySelector('.card-img-top');

        if (cardBody) {
            cardBody.style.cursor = 'pointer';
            cardBody.addEventListener('click', function() {
                const productId = productContainer.dataset.productId;
                window.location.href = `product.html?id=${productId}`;
            });
        }
        if (cardImage) {
            cardImage.style.cursor = 'pointer';
            cardImage.addEventListener('click', function() {
                const productId = productContainer.dataset.productId;
                window.location.href = `product.html?id=${productId}`;
            });
        }

        // Buttons sollen Navigation verhindern
        const buttons = card.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        });
    });
});
