document.addEventListener('DOMContentLoaded', function () {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const row = document.querySelector('.row');

    dropdownItems.forEach(item => {
        item.addEventListener('click', function (e) {
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

    // Product click navigation - only apply to card-body and card-img-top
    const productCards = document.querySelectorAll('[data-category]');

    productCards.forEach(productContainer => {
        const card = productContainer.querySelector('.card');
        const cardBody = card.querySelector('.card-body');
        const cardImage = card.querySelector('.card-img-top');

        // Make only the card body and image trigger navigation
        if (cardBody) {
            cardBody.style.cursor = 'pointer';
            cardBody.addEventListener('click', function () {
                const productId = productContainer.dataset.productId;
                window.location.href = `product.html?id=${productId}`;
            });
        }

        if (cardImage) {
            cardImage.style.cursor = 'pointer';
            cardImage.addEventListener('click', function () {
                const productId = productContainer.dataset.productId;
                window.location.href = `product.html?id=${productId}`;
            });
        }

        // Make buttons stop event propagation to prevent navigation
        const button = card.querySelector('button');
        if (button) {
            button.addEventListener('click', function (event) {
                // Stop the event from triggering the card navigation
                event.stopPropagation();
                // No action needs to be performed
            });
        }
    });
});