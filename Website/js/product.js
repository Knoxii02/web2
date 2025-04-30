// Product images array
const productImages = [
    "../pictures/book_1/book_1_1.jpg",
    "../pictures/book_1/book_1_2.jpg",
    "../pictures/book_1/book_1_3.jpg",
    "../pictures/book_1/book_1_4.jpg"
];

// Current image index tracker
let currentImageIndex = 0;

// Load the first image when the page loads
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('mainProductImage').src = productImages[0];
});

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