document.addEventListener('DOMContentLoaded', function() {
    // Product click navigation - apply to all product cards
    const productCards = document.querySelectorAll('[data-category]');
    
    productCards.forEach(productContainer => {
        const card = productContainer.querySelector('.card');
        if (!card) return;
        
        // Make the entire card clickable
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(event) {
            if (!event.target.closest('button')) {
                const productId = productContainer.dataset.productId;
                window.location.href = `product.html?id=${productId}`;
            }
        });
        
        // Make buttons stop event propagation to prevent navigation
        const buttons = card.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', function(event) {
                // Stop the event from triggering the card navigation
                event.stopPropagation();
            });
        });
    });
});
