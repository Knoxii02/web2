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
        // console.error("Invalid price input for formatPriceGerman:", price);
        return "N/A"; // Or some other placeholder
    }
    return numericPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}