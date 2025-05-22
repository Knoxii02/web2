document.addEventListener('DOMContentLoaded', function () {
    const productCards = document.querySelectorAll('[data-category]');

    productCards.forEach(productContainer => {
        const card = productContainer.querySelector('.card');
        if (!card) return;

        const cardBody = card.querySelector('.card-body');
        const cardImage = card.querySelector('.card-img-top');

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

        const clickableElements = card.querySelectorAll('button, a.btn');
        clickableElements.forEach(element => {
            element.addEventListener('click', function (event) {
                event.stopPropagation();
            });
        });
    });
});
