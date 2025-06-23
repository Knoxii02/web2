//Laden der Bestellbestätigung und Bestelldetails
document.addEventListener('DOMContentLoaded', async () => {
            const params = new URLSearchParams(window.location.search);
            const orderNumber = params.get('orderNumber');
            const pageContentContainer = document.querySelector('.page-content .container');

            if (!orderNumber) {
                pageContentContainer.innerHTML =
                    '<p class="text-center">Keine Bestellnummer gefunden. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.</p>';
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/orders/${orderNumber}`);
                if (!response.ok) {
                    let errorText = `Fehler beim Laden der Bestelldetails: ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorText = errorData.error || errorText;
                    } catch (e) {}
                    throw new Error(errorText);
                }
                const orderDetails = await response.json();
                renderOrderConfirmation(orderDetails);
            } catch (error) {
                console.error('Fehler:', error);
                pageContentContainer.innerHTML =
                    `<p class="text-center">Fehler beim Laden Ihrer Bestellung: ${error.message}. Bitte kontaktieren Sie den Support.</p>`;
            }
        });

        function formatPriceGerman(price) {
            const numericPrice = Number(price);
            if (isNaN(numericPrice) || price === null || price === undefined) { return "N/A"; }
            return numericPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        function renderOrderConfirmation(orderDetails) {
            const jumbotron = document.querySelector('.jumbotron');
            if (jumbotron) {
                const strongElements = jumbotron.querySelectorAll('p strong');
                if (strongElements.length > 0) strongElements[0].textContent = orderDetails.order_number;

                const orderDate = new Date(orderDetails.order_date);
                if (strongElements.length > 1) strongElements[1].textContent =
                    `${orderDate.toLocaleDateString('de-DE')}, ${orderDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`;

                const paragraphs = jumbotron.querySelectorAll('p');
                if (paragraphs.length > 2) paragraphs[2].textContent = `Eine Bestätigungsmail wurde an ${orderDetails.customer_email} gesendet.`;
            }

            const orderOverviewCardBody = document.querySelector('.card .card-body');
            if (!orderOverviewCardBody) {
                console.error("Bestellübersicht Card Body nicht gefunden.");
                return;
            }

            let itemsHtml = '';
            orderDetails.items.forEach(item => {
                const imageUrl = item.firstImage ? item.firstImage : './pictures/logo_1/logo_1_1.jpg';
                itemsHtml += `
                    <div class="row mb-3 border-bottom pb-3">
                        <div class="col-md-2">
                            <img src="${imageUrl}" class="img-fluid" alt="${item.product_name}">
                        </div>
                        <div class="col-md-7">
                            <h5>${item.product_name}</h5>
                            <p class="mb-0">Menge: ${item.quantity}</p>
                        </div>
                        <div class="col-md-3 text-right">
                            <p class="mb-0">${formatPriceGerman(item.gross_price_at_purchase * item.quantity)} €</p>
                            ${item.quantity > 1 ? `<small class="text-muted">(${formatPriceGerman(item.gross_price_at_purchase)} € / Stück)</small>` : ''}
                        </div>
                    </div>
                `;
            });

            let vatSummary = {};
            orderDetails.items.forEach(item => {
                const item_total_net = item.net_price_at_purchase * item.quantity;
                const item_vat_amount = item_total_net * (item.vat_percentage_at_purchase / 100);
                const rate = parseFloat(item.vat_percentage_at_purchase).toFixed(0);
                if (vatSummary[rate]) {
                    vatSummary[rate] += item_vat_amount;
                } else {
                    vatSummary[rate] = item_vat_amount;
                }
            });

            let vatDetailsLabelsHtml = '';
            let vatDetailsValuesHtml = '';
            for (const rate in vatSummary) {
                if (vatSummary.hasOwnProperty(rate) && vatSummary[rate] > 0) {
                    vatDetailsLabelsHtml += `<p><small>enthält ${rate}% MwSt.:</small></p>`;
                    vatDetailsValuesHtml += `<p><small>${formatPriceGerman(vatSummary[rate])} €</small></p>`;
                }
            }

            const items_gross_total = orderDetails.items.reduce((sum, item) => sum + (item.gross_price_at_purchase * item.quantity), 0);

            const summaryHtml = `
                <hr>
                <div class="row">
                    <div class="col-md-9 text-right">
                        <p>Zwischensumme (Warenwert):</p>
                        <p>Versandkosten:</p>
                        <p><strong>Gesamtsumme:</strong></p>
                        ${vatDetailsLabelsHtml}
                    </div>
                    <div class="col-md-3 text-right">
                        <p>${formatPriceGerman(items_gross_total)} €</p>
                        <p>${formatPriceGerman(orderDetails.shipping_costs)} €</p>
                        <p><strong>${formatPriceGerman(orderDetails.total_gross_amount)} €</strong></p>
                        ${vatDetailsValuesHtml}
                    </div>
                </div>
            `;

            orderOverviewCardBody.innerHTML = itemsHtml + summaryHtml;

            const infoCards = document.querySelectorAll('.row .col-md-6 .card .card-body');
            if (infoCards.length > 0 && infoCards[0]) {
                 infoCards[0].innerHTML = `
                    <p class="mb-0">${orderDetails.customer_name}</p>
                    <p class="mb-0">${orderDetails.address_street}</p>
                    <p class="mb-0">${orderDetails.address_zip} ${orderDetails.address_city}</p>
                    <p>${orderDetails.address_country}</p>
                `;
            } else {
                console.error("Lieferadresse Card Body nicht gefunden.");
            }

            if (infoCards.length > 1 && infoCards[1]) {
                let paymentMethodDisplay = orderDetails.payment_method;
                const paymentMethodMap = {
                    'credit': 'Kreditkarte',
                    'vorkasse': 'Vorkasse',
                    'paypal': 'PayPal'
                };
                paymentMethodDisplay = paymentMethodMap[orderDetails.payment_method.toLowerCase()] || orderDetails.payment_method;

                infoCards[1].innerHTML = `
                    <p class="mb-0"><strong>Zahlungsart:</strong> ${paymentMethodDisplay}</p>
                `;
            } else {
                console.error("Zahlungsinformationen Card Body nicht gefunden.");
            }
        }