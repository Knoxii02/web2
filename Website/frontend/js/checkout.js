//Script für Formularvalidierung und Zahlungsmethoden
function showPaymentDetails(method) {
    document.querySelectorAll('.payment-details').forEach(el => {
        el.style.display = 'none';
    });

    if (method !== 'paypal') {
        document.getElementById(method + 'Details').style.display = 'block';
    }
}        async function fetchProductsByIds(productIds) {
            const promises = productIds.map(async (id) => {
                try {
                    const response = await fetch(`http://localhost:3000/api/products/${id}`);
                    if (response.ok) {
                        return await response.json();
                    } else {
                        console.error(`Produkt mit ID ${id} nicht gefunden`);
                        return null;
                    }
                } catch (error) {
                    console.error(`Fehler beim Laden von Produkt ${id}:`, error);
                    return null;
                }
            });
            
            const results = await Promise.all(promises);
            return results.filter(product => product !== null);
        }        function formatPriceGerman(price) {
            const numericPrice = Number(price);
            if (isNaN(numericPrice)) {
                return "N/A"; 
            }
            return numericPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        function initializeFormValidation() {
            const forms = document.getElementsByClassName('needs-validation');
            
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', (event) => {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                });
            });
        }        document.addEventListener('DOMContentLoaded', async () => {
            initializeFormValidation();
            
            let products = [];
            let cart = [];
            let subtotal_net = 0;
            let total_gross_subtotal = 0;
            let final_total = 0;
            const shippingCost = 5.95;
            let vat_amounts_by_rate = {};try {
                cart = JSON.parse(localStorage.getItem('cart')) || [];
                
                if (cart.length === 0) {
                    const productContainer = document.querySelector('.card-body');
                    productContainer.innerHTML = '<p class="text-warning">Ihr Warenkorb ist leer.</p>';
                    return;
                }
                
                const productIds = cart.map(item => item.productId);
                products = await fetchProductsByIds(productIds);

                const productContainer = document.querySelector('.card-body');
                productContainer.innerHTML = '';

                subtotal_net = 0;
                vat_amounts_by_rate = {};

                cart.forEach(item => {
                    const product = products.find(p => p.id === item.productId);
                    if (product) {
                        const productHTML = `
                            <h6 class="my-0">${product.name}</h6>
                            <small class="text-muted">${item.quantity} Stück</small>
                            <div class="mt-2 mb-2"></div>
                        `;
                        productContainer.insertAdjacentHTML('beforeend', productHTML);
                        subtotal_net += product.net_price * item.quantity;
                        const item_vat_amount = (product.net_price * item.quantity) * (product.vat_percentage / 100);
                        if (!vat_amounts_by_rate[product.vat_percentage]) {
                            vat_amounts_by_rate[product.vat_percentage] = 0;
                        }
                        vat_amounts_by_rate[product.vat_percentage] += item_vat_amount;
                    }
                });
                let total_vat_amount = 0;
                for (const rate in vat_amounts_by_rate) {
                    total_vat_amount += vat_amounts_by_rate[rate];
                }

                total_gross_subtotal = subtotal_net + total_vat_amount;
                final_total = total_gross_subtotal + shippingCost;

                // Erstelle MwSt-Details HTML
                let vatDetailsHtml = '';
                for (const rate in vat_amounts_by_rate) {
                    if (vat_amounts_by_rate[rate] > 0) {
                        vatDetailsHtml += `<small class="text-muted">enthält ${rate}% MwSt.: ${formatPriceGerman(vat_amounts_by_rate[rate])} €</small><br>`;
                    }
                }
                vatDetailsHtml = vatDetailsHtml.replace(/<br>$/, '');

                productContainer.insertAdjacentHTML('beforeend', `
                    <div class="d-flex justify-content-between mt-3 mb-2">
                        <span>Zwischensumme:</span>
                        <span>${formatPriceGerman(total_gross_subtotal)} €</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Versandkosten:</span>
                        <span>${formatPriceGerman(shippingCost)} €</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between mb-2">
                        <strong>Gesamtsumme:</strong>
                        <strong>${formatPriceGerman(final_total)} €</strong>
                    </div>
                    <div class="text-right">
                        ${vatDetailsHtml}
                    </div>
                `);
            } catch (error) {
                console.error('Fehler beim Laden der Produkte für die Zusammenfassung:', error);
                const productContainer = document.querySelector('.card-body');
                productContainer.innerHTML = '<p class="text-danger">Fehler beim Laden der Bestellübersicht.</p>';
            }
            const submitButton = document.querySelector('button[type="submit"]');
            const form = document.querySelector('.needs-validation');

            submitButton.addEventListener('click', async (event) => {
                event.preventDefault();

                // Prüfe Zahlungsmethode
                const paymentMethod = getSelectedPaymentMethod();
                if (!paymentMethod) {
                    alert('Bitte wählen Sie eine Zahlungsmethode aus.');
                    form.classList.add('was-validated');
                    return;
                }

                // Prüfe Formular-Validierung
                if (!form.checkValidity()) {
                    form.classList.add('was-validated');
                    return;
                }
                form.classList.add('was-validated');

                // Sammle Kundendaten
                const customerDetails = collectCustomerDetails();
                
                // Bereite Bestellartikel vor
                const itemsToSubmit = prepareOrderItems(cart, products);
                
                // Bereite Bestellsummen vor
                const orderTotals = {
                    subtotal_net,
                    shippingCost,
                    vat_amounts_by_rate,
                    final_total
                };

                await submitOrder(customerDetails, paymentMethod, itemsToSubmit, orderTotals);
            });
        });

        function getSelectedPaymentMethod() {
            const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
            for (const radio of paymentMethodRadios) {
                if (radio.checked) {
                    return radio.id;
                }
            }
            return '';
        }

        function collectCustomerDetails() {
            return {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                zip: document.getElementById('zip').value,
                city: document.getElementById('city').value,
                country: document.getElementById('country').value
            };
        }

        function prepareOrderItems(cart, products) {
            return cart.map(item => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    net_price: product.net_price,
                    vat_percentage: product.vat_percentage
                };
            }).filter(item => item !== null);
        }

        async function submitOrder(customerDetails, paymentMethod, cartItems, totals) {
            try {
                const response = await fetch('http://localhost:3000/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        customerDetails,
                        paymentMethod,
                        cartItems,
                        totals
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ 
                        error: 'Unbekannter Fehler oder keine JSON-Antwort.' 
                    }));
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                localStorage.removeItem('cart');
                window.location.href = `confirmation.html?orderNumber=${result.orderNumber}`;

            } catch (error) {
                console.error('Failed to submit order:', error);
                showOrderError(error.message);
            }
        }

        function showOrderError(message) {
            let errorDiv = document.getElementById('checkout-error-message');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.id = 'checkout-error-message';
                errorDiv.className = 'alert alert-danger mt-3';
                
                const submitButton = document.querySelector('button[type="submit"]');
                const buttonContainer = submitButton.parentNode;
                buttonContainer.parentNode.insertBefore(errorDiv, buttonContainer.nextSibling);
            }
            errorDiv.textContent = 'Fehler beim Absenden der Bestellung: ' + message;
        }