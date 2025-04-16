  // Produktvarianten
  const variants = {
    buch: {
        description: "Dieser praxisorientierte Ratgeber bietet Ihnen bewährte Methoden und Strategien für eine erfolgreiche Erziehung. Mit zahlreichen Beispielen aus dem Alltag und konkreten Handlungsempfehlungen unterstützt Sie dieses Werk dabei, Kinder altersgerecht zu fördern und eine vertrauensvolle Beziehung aufzubauen.",
        price: "24,95 €",
        delivery: "Lieferbar ab 15.04.2025",
        images: [
            "../pictures/book_1/book_1_1.jpg",
            "../pictures/book_1/book_1_2.jpg",
            "../pictures/book_1/book_1_3.jpg",
            "../pictures/book_1/book_1_4.jpg",

        ]
    },
    cd: {
        description: "Die Audio-CD-Version enthält die wichtigsten Inhalte des Ratgebers als Hörbuch, gesprochen von professionellen Sprechern. Ideal zum Anhören unterwegs oder für Personen, die Informationen lieber auditiv aufnehmen.",
        price: "19,95 €",
        delivery: "Lieferbar ab 01.05.2025",
        images: [
            "../pictures/workbook_1/workbook_1_1.jpg",
            "../pictures/workbook_1/workbook_1_2.png",
            "../pictures/workbook_1/workbook_1_3.jpg",
            "../pictures/workbook_1/workbook_1_4.jpg",
            "../pictures/workbook_1/workbook_1_5.jpg",
        ]
    }
};

// Aktuelle Variante
let currentVariant = 'buch';

// Bilder-Navigation
let currentImageIndex = 0;

// Beim Seitenaufbau das erste Bild laden
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('mainProductImage').src = variants[currentVariant].images[0];
});

function nextImage() {
    const images = variants[currentVariant].images;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    document.getElementById('mainProductImage').src = images[currentImageIndex];
}

function previousImage() {
    const images = variants[currentVariant].images;
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    document.getElementById('mainProductImage').src = images[currentImageIndex];
}

// Funktion zum Umschalten der Varianten
function switchVariant(variant) {
    // Variante aktualisieren
    currentVariant = variant;
    currentImageIndex = 0;

    // UI-Elemente aktualisieren
    document.getElementById('productDescription').textContent = variants[variant].description;
    document.getElementById('deliveryInfo').textContent = variants[variant].delivery;
    document.getElementById('productPrice').textContent = variants[variant].price;
    document.getElementById('mainProductImage').src = variants[variant].images[0];

    // Button-Styling aktualisieren
    document.getElementById('buchVariant').classList.toggle('active', variant === 'buch');
    document.getElementById('cdVariant').classList.toggle('active', variant === 'cd');
}

// Funktionalität für die Mengenbuttons
document.addEventListener('DOMContentLoaded', function () {
    const quantityInput = document.getElementById('quantityInput');
    const incrementButton = document.getElementById('incrementButton');
    const decrementButton = document.getElementById('decrementButton');

    // Erhöhen der Menge
    incrementButton.addEventListener('click', function () {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });

    // Verringern der Menge, aber nicht unter 1
    decrementButton.addEventListener('click', function () {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });

    // Stellt sicher, dass der Wert nicht unter 1 fallen kann, wenn manuell geändert
    quantityInput.addEventListener('change', function () {
        if (this.value < 1) {
            this.value = 1;
        }
    });
});