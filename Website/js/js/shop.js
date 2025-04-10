document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const products = document.querySelectorAll('[data-category]');
    
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedCategory = this.textContent.toLowerCase();
            
            // Update dropdown button text
            document.getElementById('kategorieDropdown').textContent = this.textContent;
            
            products.forEach(product => {
                if (selectedCategory === 'alle' || product.dataset.category === selectedCategory) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    // Product click navigation
    const productCards = document.querySelectorAll('.card');
    productCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const productId = this.closest('[data-category]').dataset.productId;
            window.location.href = `product.html?id=${productId}`;
        });
    });
});