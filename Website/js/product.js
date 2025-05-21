// Dynamic product images array - will be populated from API
let productImages = [];

// Current image index tracker
let currentImageIndex = 0;

// The productImages array will be populated in the product.html script that fetches the product data
// No need to load the first image here as it's handled in product.html

// Navigation functions for the image gallery
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % productImages.length;
    document.getElementById('mainProductImage').src = productImages[currentImageIndex];
}

function previousImage() {
    currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
    document.getElementById('mainProductImage').src = productImages[currentImageIndex];
}

// Functionality for quantity buttons
document.addEventListener('DOMContentLoaded', function () {
    const quantityInput = document.getElementById('quantityInput');
    const incrementButton = document.getElementById('incrementButton');
    const decrementButton = document.getElementById('decrementButton');

    // Increase quantity
    incrementButton.addEventListener('click', function () {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });

    // Decrease quantity, but not below 1
    decrementButton.addEventListener('click', function () {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });

    // Ensure the value doesn't fall below 1 when changed manually
    quantityInput.addEventListener('change', function () {
        if (this.value < 1) {
            this.value = 1;
        }
    });
});