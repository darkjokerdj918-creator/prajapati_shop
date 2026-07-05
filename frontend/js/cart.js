/**
 * cart.js — Cart sidebar & checkout page logic (API-driven)
 */

// ── Cart State ─────────────────────────────────────────────
let cartData = { items: [], subtotal: 0, shipping_fee: 0, total: 0, item_count: 0 };

// ── Init (called from app.js) ──────────────────────────────
async function initCart() {
  await fetchAndRenderCart();
  bindCartEvents();
}

// ── Fetch cart from API and update UI ─────────────────────
async function fetchAndRenderCart() {
  try {
    cartData = await API.cart.get();
    renderCartSidebar();
    updateCartBadge(cartData.item_count);
  } catch (err) {
    console.warn('Cart fetch failed:', err.message);
    renderCartSidebar(); // render empty state
    updateCartBadge(0);
  }
}

// ── Render cart sidebar items ──────────────────────────────
function renderCartSidebar() {
  const cartItemsEl  = document.getElementById('cart-items');
  const cartEmptyEl  = document.getElementById('cart-empty');
  const countLabel   = document.getElementById('cart-count-label');
  const subtotalEl   = document.getElementById('cart-subtotal');
  const shippingEl   = document.getElementById('cart-shipping');
  const totalEl      = document.getElementById('cart-total');

  if (!cartItemsEl) return;

  // Remove old items
  cartItemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());

  const { items = [], subtotal = 0, shipping_fee = 0, total = 0, item_count = 0 } = cartData;

  if (countLabel) countLabel.textContent = `${item_count} item${item_count !== 1 ? 's' : ''}`;
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (shippingEl) shippingEl.textContent = shipping_fee === 0 ? 'FREE 🎉' : `₹${shipping_fee}`;
  if (totalEl)    totalEl.textContent    = `₹${total.toLocaleString('en-IN')}`;

  const cartFooterEl = document.querySelector('.cart-footer');

  if (items.length === 0) {
    if (cartEmptyEl) cartEmptyEl.style.display = 'flex';
    if (cartFooterEl) cartFooterEl.style.display = 'none';
    return;
  }
  if (cartEmptyEl) cartEmptyEl.style.display = 'none';
  if (cartFooterEl) cartFooterEl.style.display = 'block';

  const html = items.map(item => `
    <div class="cart-item" data-item-id="${item.id}">
      <div class="cart-item-img">
        ${item.product_image
          ? `<img src="${item.product_image}" alt="${item.product_name}" />`
          : `<div class="cart-item-emoji">${item.product_emoji}</div>`
        }
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.product_name}</div>
        <div class="cart-item-cat">₹${item.unit_price.toLocaleString('en-IN')} each</div>
        <div class="cart-item-qty">
          <button class="qty-btn qty-minus" data-item-id="${item.id}" aria-label="Decrease">−</button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn qty-plus" data-item-id="${item.id}" aria-label="Increase">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;">
        <button class="cart-item-remove" data-item-id="${item.id}" aria-label="Remove item">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <span class="cart-item-price">₹${item.line_total.toLocaleString('en-IN')}</span>
      </div>
    </div>
  `).join('');

  cartItemsEl.insertAdjacentHTML('beforeend', html);
  bindCartItemEvents();
}

// ── Bind cart item buttons ─────────────────────────────────
function bindCartItemEvents() {
  // Qty minus
  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', async () => {
      const itemId = parseInt(btn.dataset.itemId);
      const item = cartData.items.find(i => i.id === itemId);
      if (!item) return;
      const newQty = item.quantity - 1;
      try {
        if (newQty < 1) {
          cartData = await API.cart.remove(itemId);
        } else {
          cartData = await API.cart.update(itemId, newQty);
        }
        renderCartSidebar();
        updateCartBadge(cartData.item_count);
      } catch (err) { showToast(err.message, 'error'); }
    });
  });

  // Qty plus
  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', async () => {
      const itemId = parseInt(btn.dataset.itemId);
      const item = cartData.items.find(i => i.id === itemId);
      if (!item) return;
      try {
        cartData = await API.cart.update(itemId, item.quantity + 1);
        renderCartSidebar();
        updateCartBadge(cartData.item_count);
      } catch (err) { showToast(err.message, 'error'); }
    });
  });

  // Remove
  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', async () => {
      const itemId = parseInt(btn.dataset.itemId);
      try {
        cartData = await API.cart.remove(itemId);
        renderCartSidebar();
        updateCartBadge(cartData.item_count);
        showToast('Item removed from cart', 'info');
      } catch (err) { showToast(err.message, 'error'); }
    });
  });
}

// ── Bind sidebar open/close/checkout events ────────────────
function bindCartEvents() {
  const cartBtn        = document.getElementById('cart-btn');
  const cartOverlay    = document.getElementById('cart-overlay');
  const cartCloseBtn   = document.getElementById('cart-close-btn');
  const continueShopping = document.getElementById('continue-shopping');
  const checkoutBtn    = document.getElementById('checkout-btn');

  if (cartBtn)          cartBtn.addEventListener('click', openCart);
  if (cartOverlay)      cartOverlay.addEventListener('click', closeCart);
  if (cartCloseBtn)     cartCloseBtn.addEventListener('click', closeCart);
  if (continueShopping) continueShopping.addEventListener('click', closeCart);
  if (checkoutBtn)      checkoutBtn.addEventListener('click', openCheckoutModal);
}

function openCart() {
  document.getElementById('cart-overlay')?.classList.add('open');
  document.getElementById('cart-sidebar')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.getElementById('cart-sidebar')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Add to Cart (called from product cards) ────────────────
async function addToCart(productId, productName) {
  try {
    cartData = await API.cart.add(productId, 1);
    renderCartSidebar();
    updateCartBadge(cartData.item_count);
    showToast(`🛒 ${productName} added to cart!`, 'success');

    // Animate cart icon
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
      cartBtn.style.transform = 'scale(1.25)';
      setTimeout(() => { cartBtn.style.transform = ''; }, 350);
    }
  } catch (err) {
    showToast(err.message || 'Failed to add to cart', 'error');
  }
}

// ── Update cart badge ──────────────────────────────────────
function updateCartBadge(count) {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// ── Checkout Modal ─────────────────────────────────────────
function openCheckoutModal() {
  if (!cartData.items || cartData.items.length === 0) {
    showToast('Your cart is empty!', 'info');
    return;
  }
  closeCart();

  const modal = document.getElementById('checkout-modal');
  if (!modal) {
    buildCheckoutModal();
  } else {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function buildCheckoutModal() {
  const user = API.getUser();
  const existing = document.getElementById('checkout-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'checkout-modal';
  modal.className = 'modal-overlay';
  modal.style.zIndex = '4000';
  modal.innerHTML = `
    <div class="checkout-modal-box" style="background:white;border-radius:24px;max-width:520px;width:100%;padding:2.5rem;max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,0.25);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
        <h2 style="font-family:'Playfair Display',serif;font-size:1.5rem;color:var(--charcoal);">
          <i class="fa-solid fa-lock" style="color:var(--terracotta);margin-right:8px;font-size:1.1rem;"></i>
          Checkout
        </h2>
        <button onclick="closeCheckoutModal()" style="width:36px;height:36px;border-radius:50%;background:var(--gray-100);border:none;cursor:pointer;font-size:1rem;" aria-label="Close checkout">✕</button>
      </div>

      <!-- Order Summary -->
      <div style="background:var(--gray-100);border-radius:12px;padding:1.2rem;margin-bottom:1.5rem;">
        <div style="font-size:0.78rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--terracotta);margin-bottom:0.8rem;">Order Summary</div>
        ${cartData.items.map(i => `
          <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.4rem;">
            <span>${i.product_name} × ${i.quantity}</span>
            <span style="font-weight:700;">₹${i.line_total.toLocaleString('en-IN')}</span>
          </div>
        `).join('')}
        <div style="border-top:1px solid var(--gray-200);margin-top:0.8rem;padding-top:0.8rem;">
          <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--gray-600);margin-bottom:0.3rem;">
            <span>Shipping</span>
            <span>${cartData.shipping_fee === 0 ? '<span style="color:var(--sage-dark)">FREE 🎉</span>' : '₹' + cartData.shipping_fee}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:1rem;font-weight:700;">
            <span>Total</span>
            <span style="color:var(--terracotta-dark);">₹${cartData.total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <!-- Shipping Form -->
      <form id="checkout-form" novalidate>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.8rem;margin-bottom:0.8rem;">
          <div class="form-group" style="grid-column:1/-1;">
            <label class="form-label">Full Name *</label>
            <input class="form-input" id="co-name" type="text" placeholder="Your full name" value="${user?.full_name || ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email *</label>
            <input class="form-input" id="co-email" type="email" placeholder="your@email.com" value="${user?.email || ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input class="form-input" id="co-phone" type="tel" placeholder="+91 98765 43210" value="${user?.phone || ''}" />
          </div>
          <div class="form-group" style="grid-column:1/-1;">
            <label class="form-label">Shipping Address *</label>
            <textarea class="form-input" id="co-address" rows="3" placeholder="Street, City, State, PIN" required style="resize:vertical;">${user?.address || ''}</textarea>
          </div>
          <div class="form-group" style="grid-column:1/-1;">
            <label class="form-label">Payment Method</label>
            <div style="display:flex;gap:0.8rem;flex-wrap:wrap;">
              <label class="payment-opt" style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px 14px;border:2px solid var(--gray-200);border-radius:8px;font-size:0.85rem;">
                <input type="radio" name="payment" value="cod" checked style="accent-color:var(--terracotta);"> 💵 Cash on Delivery
              </label>
              <label class="payment-opt" style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px 14px;border:2px solid var(--gray-200);border-radius:8px;font-size:0.85rem;">
                <input type="radio" name="payment" value="upi" style="accent-color:var(--terracotta);"> 📲 UPI
              </label>
              <label class="payment-opt" style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px 14px;border:2px solid var(--gray-200);border-radius:8px;font-size:0.85rem;">
                <input type="radio" name="payment" value="card" style="accent-color:var(--terracotta);"> 💳 Card
              </label>
            </div>
          </div>
        </div>

        <button type="submit" id="place-order-btn" class="btn-primary" style="width:100%;justify-content:center;padding:15px;border-radius:50px;margin-top:0.5rem;">
          <i class="fa-solid fa-check-circle"></i> Place Order
        </button>
        ${!API.isLoggedIn() ? '<p style="text-align:center;font-size:0.75rem;color:var(--gray-400);margin-top:0.7rem;">💡 <a href="/login" style="color:var(--terracotta);">Login</a> to save your order history</p>' : ''}
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('open'), 10);
  document.body.style.overflow = 'hidden';

  // Close on overlay click
  modal.addEventListener('click', (e) => { if (e.target === modal) closeCheckoutModal(); });

  // Form submit
  modal.querySelector('#checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn     = modal.querySelector('#place-order-btn');
    const name    = modal.querySelector('#co-name').value.trim();
    const email   = modal.querySelector('#co-email').value.trim();
    const phone   = modal.querySelector('#co-phone').value.trim();
    const address = modal.querySelector('#co-address').value.trim();
    const payment = modal.querySelector('input[name="payment"]:checked')?.value || 'cod';

    if (!name || !email || !address) {
      showToast('Please fill in all required fields', 'error'); return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Placing order…';

    try {
      const res = await API.orders.create({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        shipping_address: address,
        payment_method: payment,
      });
      closeCheckoutModal();
      cartData = { items: [], subtotal: 0, shipping_fee: 0, total: 0, item_count: 0 };
      renderCartSidebar();
      updateCartBadge(0);
      showOrderSuccess(res.order);
    } catch (err) {
      showToast(err.message, 'error');
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check-circle"></i> Place Order';
    }
  });
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.remove('open');
    setTimeout(() => modal.remove(), 400);
  }
  document.body.style.overflow = '';
}

function showOrderSuccess(order) {
  const div = document.createElement('div');
  div.className = 'modal-overlay open';
  div.style.zIndex = '5000';
  div.innerHTML = `
    <div style="background:white;border-radius:24px;max-width:440px;width:100%;padding:3rem 2rem;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,0.25);">
      <div style="font-size:4rem;margin-bottom:1rem;">🎉</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:1.6rem;color:var(--charcoal);margin-bottom:0.5rem;">Order Placed!</h2>
      <p style="color:var(--gray-600);margin-bottom:1rem;font-size:0.92rem;">
        Thank you <strong>${order.customer_name}</strong>! Your order <strong>#${order.id}</strong> has been confirmed.
      </p>
      <div style="background:var(--gray-100);border-radius:12px;padding:1rem;margin-bottom:1.5rem;font-size:0.85rem;">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Order Total</span><strong style="color:var(--terracotta-dark);">₹${order.total_amount.toLocaleString('en-IN')}</strong></div>
        <div style="display:flex;justify-content:space-between;"><span>Payment</span><strong>${order.payment_method.toUpperCase()}</strong></div>
      </div>
      <p style="font-size:0.8rem;color:var(--gray-400);margin-bottom:1.5rem;">A confirmation will be sent to ${order.customer_email}</p>
      <button class="btn-primary" style="width:100%;justify-content:center;padding:13px;border-radius:50px;" onclick="this.closest('.modal-overlay').remove();document.body.style.overflow=''">
        Continue Shopping
      </button>
      ${API.isLoggedIn() ? `<a href="/orders" style="display:block;margin-top:0.8rem;font-size:0.82rem;color:var(--terracotta);">View Order History →</a>` : ''}
    </div>
  `;
  document.body.appendChild(div);
}

window.closeCart = closeCart;
window.openCart  = openCart;
window.addToCart = addToCart;
window.closeCheckoutModal = closeCheckoutModal;
