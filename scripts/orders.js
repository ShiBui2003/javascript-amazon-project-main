import {loadOrders, getOrders} from '../data/orders.js';
import {getProduct} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { getDeliveryOption } from '../data/deliveryOptions.js';

async function renderOrders() {
  await loadOrders();
  const orders = getOrders();
  let ordersHTML = '';

  orders.forEach((order) => {
    const orderTimeString = dayjs(order.orderTime).format('MMMM D, YYYY');

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderTimeString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id || ''}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${
            order.products.map(product => {
              const productDetails = getProduct(product.productId);
              const deliveryOption = getDeliveryOption(product.deliveryOptionId);
              const deliveryDate = dayjs(order.orderTime)
                .add(deliveryOption.deliveryDays, 'days')
                .format('MMMM D');

              return `
                <div class="product-image-container">
                  <img src="${productDetails.image}">
                </div>
                <div class="product-details">
                  <div class="product-name">
                    ${productDetails.name}
                  </div>
                  <div class="product-delivery-date">
                    Arriving on: ${deliveryDate}
                  </div>
                  <div class="product-quantity">
                    Quantity: ${product.quantity}
                  </div>
                  <button class="buy-again-button button-primary">
                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                    <span class="buy-again-message">Buy it again</span>
                  </button>
                </div>
                <div class="product-actions">
                  <a href="tracking.html?orderId=${order.id}&productId=${product.productId}">
                    <button class="track-package-button button-secondary">
                      Track package
                    </button>
                  </a>
                </div>
              `;
            }).join('')
          }
        </div>
      </div>
    `;
  });

  document.querySelector('.js-orders-grid').innerHTML = ordersHTML;
}

renderOrders();
