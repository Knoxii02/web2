//Warenkorb-Script
async function fetchProductsByIds(productIds) {
            const products = [];
            
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
        }

        function formatPriceGerman(price) {
            const numericPrice = Number(price);
            if (isNaN(numericPrice)) {
                return "N/A"; 
            }
            return numericPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        document.addEventListener('DOMContentLoaded', () => {
            const cartContainer = document.querySelector('.col-12.col-lg-8');
            const summaryContainer = document.querySelector('.col-12.col-lg-4 .card-body');

            const cart = JSON.parse(localStorage.getItem('cart')) || [];            async function renderCartItems() {
                cartContainer.innerHTML = '';
                const summaryCard = document.querySelector('.col-12.col-lg-4 .card');

                if (cart.length === 0) {
                    cartContainer.innerHTML = '<p class="text-center">Ihr Warenkorb ist leer.</p>';
                    summaryCard.style.display = 'none';
                    return;
                }

                summaryCard.style.display = 'block';

                const productIds = cart.map(item => item.productId);
                const products = await fetchProductsByIds(productIds);

                cart.forEach((item, index) => {
                    const product = products.find(p => p.id === item.productId);

                    if (!product) {
                        console.error(`Produkt mit ID ${item.productId} nicht gefunden.`);
                        return;
                    }

                    const gross_price_item = product.net_price * (1 + product.vat_percentage / 100);

                    const productCard = document.createElement('div');
                    productCard.className = 'card mb-3';
                    productCard.innerHTML = `
                        <div class="row no-gutters">
                            <div class="col-md-2">                                <a href="product.html?id=${product.id}" style="display: block;">
                                    <div class="product-img-container" style="height: 120px;">
                                        <img src="${product.firstImage}" class="card-img" alt="${product.name}">
                                    </div>
                                </a>
                            </div>
                            <div class="col-md-10">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 class="card-title"><a href="product.html?id=${product.id}" style="color: inherit; text-decoration: none;">${product.name}</a></h5>
                                            <p class="card-text">
                                                <small class="text-muted">Kategorie: ${product.category_name || 'Unbekannt'}</small>
                                            </p>
                                        </div>
                                        <div class="text-right">
                                            <p class="h5"><strong>${formatPriceGerman(gross_price_item)} €</strong></p>
                                            <div class="input-group input-group-sm mt-2" style="width: 120px;">
                                                <div class="input-group-prepend">
                                                    <button class="btn btn-outline-secondary" type="button" data-action="decrement" data-index="${index}">-</button>
                                                </div>
                                                <input type="text" class="form-control text-center" value="${item.quantity}" min="1" readonly>
                                                <div class="input-group-append">
                                                    <button class="btn btn-outline-secondary" type="button" data-action="increment" data-index="${index}">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-end mt-3">
                                        <button class="btn btn-sm btn-outline-danger" data-action="remove" data-index="${index}">
                                            <i class="bi bi-trash"></i> Entfernen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    cartContainer.appendChild(productCard);
                });
            }            async function updateSummary() {
                if (cart.length === 0) {
                    return;
                }

                const productIds = cart.map(item => item.productId);
                const products = await fetchProductsByIds(productIds);

                let subtotal_net = 0;
                const vat_amounts_by_rate = {};

                cart.forEach(item => {
                    const product = products.find(p => p.id === item.productId);
                    if (product) {
                        const item_total_net = product.net_price * item.quantity;
                        subtotal_net += item_total_net;

                        const vat_rate = product.vat_percentage;
                        const item_vat_amount = item_total_net * (vat_rate / 100);

                        if (vat_amounts_by_rate[vat_rate]) {
                            vat_amounts_by_rate[vat_rate] += item_vat_amount;
                        } else {
                            vat_amounts_by_rate[vat_rate] = item_vat_amount;
                        }
                    }
                });

                let total_vat_amount = 0;
                for (const rate in vat_amounts_by_rate) {
                    total_vat_amount += vat_amounts_by_rate[rate];
                }

                const total_gross_subtotal = subtotal_net + total_vat_amount;
                const shipping = 5.95;
                const final_total = total_gross_subtotal + shipping;

                let vatDetailsHTML = '';
                for (const rate in vat_amounts_by_rate) {
                    vatDetailsHTML += `
                        <div class="text-right">
                            <small class="text-muted">enthält ${rate}% MwSt.: ${formatPriceGerman(vat_amounts_by_rate[rate])} €</small>
                        </div>
                    `;
                }

                summaryContainer.innerHTML = `
                    <h5 class="card-title">Zusammenfassung</h5>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Zwischensumme:</span>
                        <span>${formatPriceGerman(total_gross_subtotal)} €</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Versandkosten:</span>
                        <span>${formatPriceGerman(shipping)} €</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between mb-2">
                        <strong>Gesamtsumme:</strong>
                        <strong>${formatPriceGerman(final_total)} €</strong>
                    </div>
                    ${vatDetailsHTML}
                    <div class="text-right mt-3">
                        <a href="checkout.html" class="btn btn-primary">Zur Kasse</a>
                    </div>
                `;
            }

            cartContainer.addEventListener('click', (event) => {
                const action = event.target.dataset.action;
                const index = parseInt(event.target.dataset.index, 10);

                if (action === 'increment') {
                    cart[index].quantity++;
                } else if (action === 'decrement' && cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else if (action === 'remove') {
                    cart.splice(index, 1);
                }                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
                updateSummary();
            });

            renderCartItems();
            updateSummary();

            const cartProductIds = cart.map(item => item.productId);
            loadAndDisplayRelatedProducts('related-products-container', cartProductIds, 4);
        });