document.addEventListener('DOMContentLoaded', function() {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const row = document.querySelector('.row');
    
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedCategory = this.textContent.toLowerCase();
            
            // Update dropdown button text
            document.getElementById('kategorieDropdown').textContent = this.textContent;
            
            // Filter products
            document.querySelectorAll('[data-category]').forEach(product => {
                if (selectedCategory === 'alle' || product.dataset.category === selectedCategory) {
                    product.style.display = 'block';
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