// ============================================================
// PRAJAPATI STORE – E-Commerce JavaScript
// ============================================================

// ── Product Data ──────────────────────────────────────────
const products = {
  ganesha: [
    {
      id: 'g1',
      name: 'Majestic Ganesha Idol',
      category: 'ganesha',
      subcat: 'Large',
      price: 1299,
      originalPrice: 1799,
      rating: 4.9,
      reviews: 142,
      badge: 'bestseller',
      image: 'images/ganesha1.jpg',
      emoji: '🪷',
      desc: 'A magnificent, handcrafted eco-friendly Ganesha idol made from natural terracotta clay. Adorned with intricate hand-painted floral motifs in traditional Indian style.',
      features: ['100% Eco-Friendly', 'Natural Clay', 'Handcrafted', 'Biodegradable', 'Food-safe Colors']
    },
    {
      id: 'g2',
      name: 'Floral Ganesha with Flowers',
      category: 'ganesha',
      subcat: 'Medium',
      price: 899,
      originalPrice: 1199,
      rating: 4.8,
      reviews: 98,
      badge: 'eco',
      image: 'images/ganesha2.jpg',
      emoji: '🌸',
      desc: 'A beautifully decorated Ganesha idol with vibrant natural flower adornments. Perfect for Ganesh Chaturthi celebrations. 100% biodegradable.',
      features: ['100% Eco-Friendly', 'Flower Decorated', 'Festival Ready', 'Natural Dyes']
    },
    {
      id: 'g3',
      name: 'Heritage Terracotta Ganesha',
      category: 'ganesha',
      subcat: 'Large',
      price: 1599,
      originalPrice: 2199,
      rating: 5.0,
      reviews: 67,
      badge: 'new',
      image: 'images/ganesha3.jpg',
      emoji: '✨',
      desc: 'An heirloom-quality Ganesha statue with intricate carvings and gold accents. Crafted by master artisans using traditional techniques passed down generations.',
      features: ['Master Crafted', 'Gold Accents', 'Heirloom Quality', 'Eco-Friendly', 'Certificate of Authenticity']
    },
    {
      id: 'g4',
      name: 'Mini Ganesha Gift Set (3pc)',
      category: 'ganesha',
      subcat: 'Small',
      price: 599,
      originalPrice: 799,
      rating: 4.7,
      reviews: 215,
      badge: 'bestseller',
      image: null,
      emoji: '🎁',
      desc: 'A charming set of three miniature Ganesha idols in different sizes, perfect for gifting. Each piece is individually handcrafted and painted.',
      features: ['Set of 3', 'Gift Ready', 'Handcrafted', 'Eco-Friendly', 'Multiple Sizes']
    },
    {
      id: 'g5',
      name: 'Navaratna Ganesha',
      category: 'ganesha',
      subcat: 'Medium',
      price: 1099,
      originalPrice: 1399,
      rating: 4.8,
      reviews: 56,
      badge: 'new',
      image: null,
      emoji: '💎',
      desc: 'A resplendent Ganesha idol adorned with nine gemstone-colored clay ornaments representing the Navaratna tradition. A truly divine piece.',
      features: ['9 Gem Colors', 'Premium Finish', 'Eco-Friendly', 'Collectors Item']
    },
    {
      id: 'g6',
      name: 'Meditation Ganesha',
      category: 'ganesha',
      subcat: 'Small',
      price: 499,
      originalPrice: 649,
      rating: 4.9,
      reviews: 189,
      badge: 'eco',
      image: null,
      emoji: '🧘',
      desc: 'A serene Ganesha in meditation pose, crafted from pure clay with minimalist natural finish. Ideal for home shrines and meditation spaces.',
      features: ['Meditation Pose', 'Natural Finish', 'Eco-Friendly', 'Compact Size']
    }
  ],
  household: [
    {
      id: 'h1',
      name: 'Artisan Coffee Mug',
      category: 'household',
      subcat: 'Mugs',
      price: 349,
      originalPrice: 449,
      rating: 4.7,
      reviews: 312,
      badge: 'bestseller',
      image: 'images/mug.jpg',
      emoji: '☕',
      desc: 'A beautifully handcrafted terracotta mug with earthy brown glaze and geometric patterns. Perfect for your morning tea or coffee ritual.',
      features: ['Lead-Free Glaze', 'Dishwasher Safe', 'Microwave Safe', '350ml Capacity']
    },
    {
      id: 'h2',
      name: 'Blue Pottery Serving Bowl',
      category: 'household',
      subcat: 'Bowls',
      price: 699,
      originalPrice: 899,
      rating: 4.8,
      reviews: 178,
      badge: 'new',
      image: 'images/bowl.jpg',
      emoji: '🥣',
      desc: 'An exquisite blue and white hand-painted serving bowl inspired by traditional Jaipur blue pottery. A centerpiece for your dining table.',
      features: ['Blue Pottery Style', 'Food Safe', 'Handpainted', 'Large 800ml', 'Dishwasher Safe']
    },
    {
      id: 'h3',
      name: 'Botanical Terracotta Vase',
      category: 'household',
      subcat: 'Vases',
      price: 549,
      originalPrice: 699,
      rating: 4.9,
      reviews: 94,
      badge: 'new',
      image: 'images/vase.jpg',
      emoji: '🌿',
      desc: 'An elegant tall vase with delicate hand-painted botanical leaf patterns. A statement piece for modern homes with an earthy aesthetic.',
      features: ['Hand Painted', 'Waterproof Lining', '30cm Height', 'Décor Vase']
    },
    {
      id: 'h4',
      name: 'Clay Water Pot (Matka)',
      category: 'household',
      subcat: 'Pots',
      price: 449,
      originalPrice: 599,
      rating: 4.8,
      reviews: 423,
      badge: 'bestseller',
      image: null,
      emoji: '🏺',
      desc: 'A traditional Indian clay matka pot that naturally cools water. Scientifically proven to maintain optimal water temperature and enhance mineral content.',
      features: ['Natural Cooling', 'BPA-Free', 'Alkaline Water', '5 Litre Capacity', 'Traditional Design']
    },
    {
      id: 'h5',
      name: 'Handmade Kulhad Set (6pc)',
      category: 'household',
      subcat: 'Mugs',
      price: 399,
      originalPrice: 529,
      rating: 4.6,
      reviews: 267,
      badge: 'sale',
      image: null,
      emoji: '🍵',
      desc: 'A set of 6 traditional clay kulhads — the original eco-friendly cup. Perfect for chai, masala milk, and authentic Indian beverages.',
      features: ['Set of 6', 'Eco-Friendly', '150ml Each', 'Traditional Style', 'Biodegradable']
    },
    {
      id: 'h6',
      name: 'Terracotta Dinner Set (4pc)',
      category: 'household',
      subcat: 'Plates',
      price: 1299,
      originalPrice: 1699,
      rating: 4.7,
      reviews: 88,
      badge: 'new',
      image: null,
      emoji: '🍽️',
      desc: 'A beautiful 4-piece dinner set with matching plate, bowl, mug, and side plate. Fired at high temperature for extra durability with food-safe glaze.',
      features: ['4-Piece Set', 'Food Safe Glaze', 'Oven Safe', 'Dishwasher Safe', 'Gift Box Included']
    }
  ]
};

// ── Additional Household Items ──────────────────────────
products.household.push(
  {
    id: 'h7',
    name: 'Red Clay Matka (Handmade)',
    category: 'household',
    subcat: 'Pots',
    price: 499,
    originalPrice: 649,
    rating: 4.7,
    reviews: 102,
    badge: 'new',
    image: 'images/household/red-clay-matka/1.png',
    emoji: '🏺',
    desc: 'A traditional red clay matka, handcrafted by local artisans. Ideal for storing drinking water and keeping it naturally cool.',
    features: ['Red Clay', 'Handmade', 'Natural Cooling', '3 Litre Capacity']
  },
  {
    id: 'h8',
    name: 'Red & White Design Matka',
    category: 'household',
    subcat: 'Pots',
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 58,
    badge: 'new',
    image: 'images/household/red-white-matka/1.png',
    emoji: '🏺',
    desc: 'A decorative red and white patterned matka — combines traditional form with contemporary surface design.',
    features: ['Hand Painted', 'Decorative', '3.5 Litre', 'Red & White Finish']
  },
  {
    id: 'h9',
    name: 'Matka Stand (Iron & Wood)',
    category: 'household',
    subcat: 'Accessories',
    price: 299,
    originalPrice: 399,
    rating: 4.6,
    reviews: 34,
    badge: '',
    image: 'images/household/matka-stand/1.png',
    emoji: '🪵',
    desc: 'A sturdy matka stand made with wrought iron and wooden slats to elevate and display your clay pot.',
    features: ['Iron Frame', 'Wooden Slats', 'Indoor Use', 'Stable Base']
  },
  {
    id: 'h10',
    name: 'Terracotta Piggy Bank',
    category: 'household',
    subcat: 'Decorative',
    price: 249,
    originalPrice: 349,
    rating: 4.5,
    reviews: 41,
    badge: 'sale',
    image: 'images/household/terracotta-piggy-bank/1.png',
    emoji: '🐖',
    desc: 'A charming handcrafted terracotta piggy bank — a lovely gift for kids and a rustic décor piece.',
    features: ['Handmade', 'Removable Stopper', 'Painted Details', 'Gift Ready']
  },
  {
    id: 'h11',
    name: 'Set of 6 Earthen Diyas',
    category: 'household',
    subcat: 'Diyas',
    price: 199,
    originalPrice: 249,
    rating: 4.9,
    reviews: 76,
    badge: 'bestseller',
    image: 'images/household/diyas-set/Gemini_Generated_Image_fgknmbfgknmbfgkn.png',
    emoji: '🪔',
    desc: 'A set of six traditional earthen diyas, perfect for festivals, pujas, and home décor.',
    features: ['Set of 6', 'Handmade', 'Smoke-Free Wick Holders', 'Decorative']
  },
  {
    id: 'h12',
    name: 'Decorative Clay Figurines (3pc)',
    category: 'household',
    subcat: 'Decorative',
    price: 799,
    originalPrice: 999,
    rating: 4.8,
    reviews: 22,
    badge: 'new',
    image: 'images/household/decorative-figurines/1.png',
    emoji: '🎨',
    desc: 'A curated trio of decorative clay figurines — handcrafted and hand-painted to add rustic charm to shelves and mantels.',
    features: ['Set of 3', 'Hand Painted', 'Indoor Use', 'Gift Box']
  },
  {
    id: 'h13',
    name: 'Dahi Handi (Clay Pot)',
    category: 'household',
    subcat: 'Crockery',
    price: 349,
    originalPrice: 449,
    rating: 4.6,
    reviews: 19,
    badge: '',
    image: 'images/household/dahi-handi/1.png',
    emoji: '🫙',
    desc: 'A traditional clay handi used for storing yogurt and for festive Dahi Handi celebrations. Durable and food-safe.',
    features: ['Food Safe', 'Handmade', 'Multi-Purpose', '2 Litre']
  },
  {
    id: 'h14',
    name: 'Terracotta Tawa (Cooking Griddle)',
    category: 'household',
    subcat: 'Crockery',
    price: 799,
    originalPrice: 999,
    rating: 4.4,
    reviews: 14,
    badge: '',
    image: 'images/household/terracotta-tawa/1.png',
    emoji: '🍳',
    desc: 'A traditional terracotta tawa for slow, earthy cooking — ideal for rotis, pancakes, and dosa. Season before use.',
    features: ['Season Before Use', 'Even Heating', 'Handmade', '30cm Diameter']
  }
);

// ── State ──────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('prajapati_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('prajapati_wishlist')) || [];
let cartOpen = false;
let modalProduct = null;
let modalQty = 1;
let carouselIndex = 0;
let activeGaneshaFilter = 'All';
let activeHouseholdFilter = 'All';
let searchQuery = '';

// ── DOM Ready ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initNavbar();
  initProducts();
  initCarousel();
  initCart();
  initSearch();
  initScrollAnimations();
  initBackToTop();
  updateCartBadge();
});

// ── Loading Screen ─────────────────────────────────────────
function initLoading() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  setTimeout(() => {
    screen.classList.add('hidden');
    document.body.style.overflow = '';
  }, 2000);
  document.body.style.overflow = 'hidden';
}

// ── Navbar ─────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    // Update active nav link
    updateActiveNavLink();
  });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }
}

function updateActiveNavLink() {
  const sections = ['hero', 'ganesha-section', 'household-section', 'about-section'];
  const navLinks = document.querySelectorAll('.nav-links a');
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 100) current = id;
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}

// ── Render Products ────────────────────────────────────────
function initProducts() {
  renderGaneshaProducts();
  renderHouseholdProducts();

  // Filter buttons
  document.querySelectorAll('#ganesha-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#ganesha-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeGaneshaFilter = btn.dataset.filter;
      renderGaneshaProducts();
    });
  });
  document.querySelectorAll('#household-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#household-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeHouseholdFilter = btn.dataset.filter;
      renderHouseholdProducts();
    });
  });
}

function renderGaneshaProducts() {
  const grid = document.getElementById('ganesha-grid');
  if (!grid) return;
  const filtered = products.ganesha.filter(p =>
    (activeGaneshaFilter === 'All' || p.subcat === activeGaneshaFilter) &&
    (searchQuery === '' || p.name.toLowerCase().includes(searchQuery) || p.desc.toLowerCase().includes(searchQuery))
  );
  grid.innerHTML = filtered.length ? filtered.map(renderProductCard).join('') : '<div class="no-results" style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray-400)"><i class="fa-solid fa-magnifying-glass" style="font-size:2.5rem;margin-bottom:1rem;display:block"></i>No products found</div>';
  bindProductCardEvents();
}

function renderHouseholdProducts() {
  const grid = document.getElementById('household-grid');
  if (!grid) return;
  const filtered = products.household.filter(p =>
    (activeHouseholdFilter === 'All' || p.subcat === activeHouseholdFilter) &&
    (searchQuery === '' || p.name.toLowerCase().includes(searchQuery) || p.desc.toLowerCase().includes(searchQuery))
  );
  grid.innerHTML = filtered.length ? filtered.map(renderProductCard).join('') : '<div class="no-results" style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray-400)"><i class="fa-solid fa-magnifying-glass" style="font-size:2.5rem;margin-bottom:1rem;display:block"></i>No products found</div>';
  bindProductCardEvents();
}

function renderProductCard(p) {
  const inWishlist = wishlist.includes(p.id);
  const badgeMap = { eco: 'badge-eco', new: 'badge-new', bestseller: 'badge-bestseller', sale: 'badge-sale' };
  const badgeLabelMap = { eco: '🌿 Eco', new: '✨ New', bestseller: '🔥 Top Sell', sale: '🏷️ Sale' };
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  const stars = renderStars(p.rating);

  return `
    <div class="product-card reveal" data-id="${p.id}" data-category="${p.category}">
      <div class="product-img-wrap">
        ${p.image
          ? `<img src="${p.image}" alt="${p.name}" loading="lazy" />`
          : `<a href="frontend/pages/product.html?id=${p.id}" class="product-folder" aria-label="Open ${p.name}">
               <div class="folder-icon">📁</div>
               <div class="folder-gallery">
                 <span></span><span></span><span></span>
               </div>
               <div class="folder-label">${p.name}</div>
             </a>`
        }
        ${p.badge ? `<span class="product-badge ${badgeMap[p.badge]}">${badgeLabelMap[p.badge]}</span>` : ''}
        <div class="product-actions">
          <button class="action-btn wishlist-btn ${inWishlist ? 'wishlist-active' : ''}" data-id="${p.id}" title="Wishlist" aria-label="Add to wishlist">
            <i class="fa-${inWishlist ? 'solid' : 'regular'} fa-heart"></i>
          </button>
          <button class="action-btn quick-view-btn" data-id="${p.id}" title="Quick View" aria-label="Quick view">
            <i class="fa-regular fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category === 'ganesha' ? '🪷 Eco Ganesha' : '🏠 Household'} · ${p.subcat}</div>
        <h3 class="product-name"><a href="frontend/pages/product.html?id=${p.id}" class="product-link">${p.name}</a></h3>
        
        
        <div class="product-rating">
          <div class="stars">${stars}</div>
          <span class="rating-count">${p.rating} (${p.reviews})</span>
        </div>
        <div class="product-price-row">
          <div class="price-group">
            <span class="price-current">₹${p.price.toLocaleString()}</span>
            ${p.originalPrice ? `<span class="price-original">₹${p.originalPrice.toLocaleString()}</span>` : ''}
          </div>
          <button class="add-to-cart-btn" data-id="${p.id}" aria-label="Add ${p.name} to cart">
            <i class="fa-solid fa-cart-plus"></i>
          </button>
        </div>
        ${discount > 0 ? `<div style="font-size:0.72rem;color:var(--sage-dark);margin-top:6px;font-weight:700;">Save ${discount}%</div>` : ''}
      </div>
    </div>
  `;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function bindProductCardEvents() {
  // Quick View
  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      openProductModal(id);
    });
  });
  // Add to Cart
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.id);
    });
  });
  // Wishlist
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(btn.dataset.id, btn);
    });
  });
  // Card click = quick view
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => openProductModal(card.dataset.id));
  });
  // Re-run scroll animations for new cards
  initScrollAnimations();
}

// ── Wishlist ───────────────────────────────────────────────
function toggleWishlist(id, btn) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(w => w !== id);
    if (btn) {
      btn.classList.remove('wishlist-active');
      btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    }
    showToast('Removed from wishlist', 'info');
  } else {
    wishlist.push(id);
    if (btn) {
      btn.classList.add('wishlist-active');
      btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    }
    showToast('💛 Added to wishlist!', 'success');
  }
  localStorage.setItem('prajapati_wishlist', JSON.stringify(wishlist));
}

// ── Cart ───────────────────────────────────────────────────
function initCart() {
  const cartBtn = document.getElementById('cart-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const continueShoppingBtn = document.getElementById('continue-shopping');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeCart);
  if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);

  renderCart();
}

function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-sidebar').classList.add('open');
  document.body.style.overflow = 'hidden';
  cartOpen = true;
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-sidebar').classList.remove('open');
  document.body.style.overflow = '';
  cartOpen = false;
}

function addToCart(id) {
  const allProducts = [...products.ganesha, ...products.household];
  const product = allProducts.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart();
  renderCart();
  updateCartBadge();
  showToast(`🛒 ${product.name} added to cart!`, 'success');

  // Animate cart icon
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.classList.add('cart-pop');
    setTimeout(() => cartBtn.classList.remove('cart-pop'), 400);
  }
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  updateCartBadge();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCart();
  updateCartBadge();
}

function saveCart() {
  localStorage.setItem('prajapati_cart', JSON.stringify(cart));
}

function renderCart() {
  const cartItemsEl = document.getElementById('cart-items');
  const cartEmptyEl = document.getElementById('cart-empty');
  const cartCountLabel = document.getElementById('cart-count-label');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTotal = document.getElementById('cart-total');

  if (!cartItemsEl) return;
  const allProducts = [...products.ganesha, ...products.household];
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  if (cartCountLabel) cartCountLabel.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;

  if (cart.length === 0) {
    if (cartEmptyEl) cartEmptyEl.style.display = 'flex';
    cartItemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
    if (cartSubtotal) cartSubtotal.textContent = '₹0';
    if (cartTotal) cartTotal.textContent = '₹0';
    return;
  }

  if (cartEmptyEl) cartEmptyEl.style.display = 'none';

  const html = cart.map(cartItem => {
    const p = allProducts.find(prod => prod.id === cartItem.id);
    if (!p) return '';
    const lineTotal = p.price * cartItem.qty;
    return `
      <div class="cart-item" data-id="${p.id}">
        <div class="cart-item-img">
          ${p.image
            ? `<img src="${p.image}" alt="${p.name}" />`
            : `<div class="cart-item-emoji">${p.emoji}</div>`
          }
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-cat">${p.category === 'ganesha' ? '🪷 Eco Ganesha' : '🏠 Household'}</div>
          <div class="cart-item-qty">
            <button class="qty-btn qty-minus" data-id="${p.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-num">${cartItem.qty}</span>
            <button class="qty-btn qty-plus" data-id="${p.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;">
          <button class="cart-item-remove" data-id="${p.id}" aria-label="Remove item">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <span class="cart-item-price">₹${lineTotal.toLocaleString()}</span>
        </div>
      </div>
    `;
  }).join('');

  // Clear old items and re-render
  cartItemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
  cartItemsEl.insertAdjacentHTML('beforeend', html);

  // Subtotal / Total
  const subtotal = cart.reduce((sum, item) => {
    const p = allProducts.find(prod => prod.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
  if (cartTotal) cartTotal.textContent = `₹${total.toLocaleString()}`;

  // Update shipping label
  const shippingEl = document.getElementById('cart-shipping');
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE 🎉' : `₹${shipping}`;

  // Bind events
  cartItemsEl.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => updateQty(btn.dataset.id, -1));
  });
  cartItemsEl.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => updateQty(btn.dataset.id, 1));
  });
  cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
  });
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  if (!badge) return;
  if (totalItems > 0) {
    badge.textContent = totalItems > 99 ? '99+' : totalItems;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function handleCheckout() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'info');
    return;
  }
  closeCart();
  showToast('🎉 Redirecting to checkout... (Demo Mode)', 'success');
  setTimeout(() => showToast('✅ Thank you for shopping at Prajapati Store!', 'success'), 2000);
}

// ── Product Modal ──────────────────────────────────────────
function openProductModal(id) {
  const allProducts = [...products.ganesha, ...products.household];
  const p = allProducts.find(prod => prod.id === id);
  if (!p) return;

  modalProduct = p;
  modalQty = 1;

  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('product-modal');
  if (!overlay || !modal) return;

  // Populate modal
  const inWishlist = wishlist.includes(p.id);
  const stars = renderStars(p.rating);
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

  modal.querySelector('.modal-category').textContent = `${p.category === 'ganesha' ? '🪷 Eco-Friendly Ganesha' : '🏠 Household'} · ${p.subcat}`;
  modal.querySelector('.modal-name').textContent = p.name;
  modal.querySelector('.modal-stars').innerHTML = stars;
  modal.querySelector('.modal-rating-text').textContent = `${p.rating} · ${p.reviews} reviews`;
  modal.querySelector('.modal-price-current').textContent = `₹${p.price.toLocaleString()}`;
  modal.querySelector('.modal-price-original').textContent = p.originalPrice ? `₹${p.originalPrice.toLocaleString()}` : '';
  modal.querySelector('.modal-desc').textContent = p.desc;
  modal.querySelector('.modal-qty-num').textContent = modalQty;

  // Discount label
  const discountEl = modal.querySelector('.modal-discount');
  if (discountEl) discountEl.textContent = discount > 0 ? `Save ${discount}%` : '';

  // Features
  const featuresEl = modal.querySelector('.modal-features');
  if (featuresEl) featuresEl.innerHTML = p.features.map(f => `<span class="modal-feature-tag">✓ ${f}</span>`).join('');

  // Image
  const imgWrap = modal.querySelector('.modal-main-img');
  if (imgWrap) {
    imgWrap.innerHTML = p.image
      ? `<img src="${p.image}" alt="${p.name}" />`
      : `<div class="modal-emoji">${p.emoji}</div>`;
  }

  // Wishlist btn
  const wishlistBtn = modal.querySelector('.modal-wishlist-btn');
  if (wishlistBtn) {
    wishlistBtn.classList.toggle('active', inWishlist);
    wishlistBtn.innerHTML = `<i class="fa-${inWishlist ? 'solid' : 'regular'} fa-heart"></i>`;
    wishlistBtn.onclick = () => {
      toggleWishlist(p.id, null);
      const isNow = wishlist.includes(p.id);
      wishlistBtn.classList.toggle('active', isNow);
      wishlistBtn.innerHTML = `<i class="fa-${isNow ? 'solid' : 'regular'} fa-heart"></i>`;
      // Update card
      const cardWishlistBtn = document.querySelector(`.wishlist-btn[data-id="${p.id}"]`);
      if (cardWishlistBtn) {
        cardWishlistBtn.classList.toggle('wishlist-active', isNow);
        cardWishlistBtn.innerHTML = `<i class="fa-${isNow ? 'solid' : 'regular'} fa-heart"></i>`;
      }
    };
  }

  // Qty controls
  const minusBtn = modal.querySelector('.modal-qty-minus');
  const plusBtn = modal.querySelector('.modal-qty-plus');
  const qtyNum = modal.querySelector('.modal-qty-num');
  if (minusBtn) minusBtn.onclick = () => { modalQty = Math.max(1, modalQty - 1); qtyNum.textContent = modalQty; };
  if (plusBtn) plusBtn.onclick = () => { modalQty = Math.min(10, modalQty + 1); qtyNum.textContent = modalQty; };

  // Add to cart from modal
  const addCartBtn = modal.querySelector('.modal-add-cart');
  if (addCartBtn) {
    addCartBtn.onclick = () => {
      for (let i = 0; i < modalQty; i++) addToCart(p.id);
      showToast(`🛒 Added ${modalQty}× ${p.name} to cart!`, 'success');
      closeProductModal();
    };
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Featured Carousel ──────────────────────────────────────
function initCarousel() {
  const allProducts = [...products.ganesha, ...products.household];
  const featured = allProducts.filter(p => ['g1', 'g2', 'g3', 'h1', 'h2', 'h3', 'h4'].includes(p.id));
  const track = document.getElementById('carousel-track');
  if (!track) return;

  track.innerHTML = featured.map(p => `
    <div class="carousel-card" data-id="${p.id}">
      <div class="carousel-card-img">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" />` : p.emoji}
      </div>
      <div class="carousel-card-info">
        <div class="carousel-card-name">${p.name}</div>
        <div class="carousel-card-price">₹${p.price.toLocaleString()}</div>
      </div>
    </div>
  `).join('');

  // Dots
  const dotsEl = document.getElementById('carousel-dots');
  if (dotsEl) {
    const totalCards = featured.length;
    const visibleCards = getVisibleCards();
    const totalDots = Math.max(1, totalCards - visibleCards + 1);
    dotsEl.innerHTML = Array.from({ length: totalDots }, (_, i) =>
      `<div class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`
    ).join('');
    dotsEl.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
    });
  }

  // Nav
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(carouselIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(carouselIndex + 1));

  // Card click
  track.querySelectorAll('.carousel-card').forEach(card => {
    card.addEventListener('click', () => openProductModal(card.dataset.id));
  });

  // Auto-play
  setInterval(() => goToSlide(carouselIndex + 1), 3500);
}

function getVisibleCards() {
  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 768) return 3;
  if (window.innerWidth >= 480) return 2;
  return 1;
}

function goToSlide(index) {
  const track = document.getElementById('carousel-track');
  const cards = track ? track.querySelectorAll('.carousel-card') : [];
  const visibleCards = getVisibleCards();
  const max = Math.max(0, cards.length - visibleCards);
  carouselIndex = ((index % (max + 1)) + (max + 1)) % (max + 1);

  const cardWidth = cards[0] ? (cards[0].offsetWidth + 24) : 0;
  track.style.transform = `translateX(-${carouselIndex * cardWidth}px)`;

  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === carouselIndex);
  });
}

// ── Search ─────────────────────────────────────────────────
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.toLowerCase().trim();
      renderGaneshaProducts();
      renderHouseholdProducts();
    });
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        searchQuery = searchInput.value.toLowerCase().trim();
        renderGaneshaProducts();
        renderHouseholdProducts();
        if (searchQuery) {
          document.getElementById('ganesha-section')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      searchQuery = searchInput?.value.toLowerCase().trim() || '';
      renderGaneshaProducts();
      renderHouseholdProducts();
    });
  }
}

// ── Scroll Animations ──────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    if (!el.classList.contains('visible')) observer.observe(el);
  });
}

// ── Back to Top ────────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Toast Notifications ────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const iconMap = { success: 'circle-check', info: 'circle-info', warning: 'triangle-exclamation' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid fa-${iconMap[type] || 'circle-info'}"></i><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'none';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Newsletter ─────────────────────────────────────────────
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input').value;
    if (email) {
      showToast('🎉 Thank you! You\'re now subscribed.', 'success');
      newsletterForm.querySelector('input').value = '';
    }
  });
}

// ── Expose modal close globally ────────────────────────────
window.closeProductModal = closeProductModal;
