document.addEventListener('DOMContentLoaded', function() {
    // Produktkarten-Navigation für alle Karten mit data-category Attribut
    const productCards = document.querySelectorAll('[data-category]');
    
    productCards.forEach(productContainer => {
        const card = productContainer.querySelector('.card');
        if (!card) return;

        // Nur Bild und Textbereich sind klickbar für Navigation
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

        // Buttons und Links mit btn-Klasse sollen nicht zur Produktdetailseite führen
        const clickableElements = card.querySelectorAll('button, a.btn');
        clickableElements.forEach(element => {
            element.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        });
    });
});
