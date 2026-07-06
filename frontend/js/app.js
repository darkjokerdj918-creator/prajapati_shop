/**
 * app.js — Main application logic (API-driven, refactored)
 * Loads products from backend, handles filters, search, modal, carousel, animations.
 */

// ── State ──────────────────────────────────────────────────
let allProducts = { ganesha: [], household: [] };
let wishlist    = JSON.parse(localStorage.getItem('ps_wishlist') || '[]');
let modalProduct = null;
let modalQty     = 1;
let carouselIdx  = 0;
let activeGaneshaFilter   = 'All';
let activeHouseholdFilter = 'All';
let searchQuery = '';
let listingView = localStorage.getItem('ps_view') || 'list';
let listingSort = 'relevance';

// ── Boot ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  initLoadingScreen();
  initNavbar();
  updateNavAuth?.();        // from auth.js

  await Promise.all([
    loadGaneshaProducts(),
    loadHouseholdProducts(),
    loadCarousel(),
  ]);

  initListingControls();
  initCategoryStrip();

  await initCart?.();       // from cart.js
  
  initWishlistEvents();
  fetchAndRenderWishlist();

  initFilters();
  initSearch();
  initScrollAnimations();
  initBackToTop();
  initModalClose();
  initNewsletterForm();
  initContactForm();
});

// ── Loading Screen ─────────────────────────────────────────
function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    screen.classList.add('hidden');
    document.body.style.overflow = '';
  }, 1800);
}

// ── Navbar ─────────────────────────────────────────────────
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNavLink();
  });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }
}

function updateActiveNavLink() {
  const sectionIds = ['hero', 'ganesha-section', 'household-section', 'about-section', 'newsletter'];
  let current = '';
  
  // Check if page is scrolled to the absolute bottom (Contact section)
  const isBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50;
  
  if (isBottom) {
    current = 'newsletter';
  } else {
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 120) current = id;
    });
  }

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

// ── Load Products from API ─────────────────────────────────
async function loadGaneshaProducts() {
  const grid = document.getElementById('ganesha-grid');
  if (!grid) return;
  setGridLoading(grid);
  try {
    const res = await API.products.list({
      category: 'ganesha',
      subcat: activeGaneshaFilter !== 'All' ? activeGaneshaFilter : undefined,
      search: searchQuery || undefined,
    });
    allProducts.ganesha = res.products || [];
    renderProductGrid(grid, allProducts.ganesha);
  } catch (err) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray-400);">
      <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;display:block;margin-bottom:0.8rem;"></i>
      Unable to load products. Is the backend running?<br>
      <code style="font-size:0.75rem;color:var(--terracotta);">${err.message}</code>
    </div>`;
  }
}

async function loadHouseholdProducts() {
  const grid = document.getElementById('household-grid');
  if (!grid) return;
  setGridLoading(grid);
  try {
    const res = await API.products.list({
      category: 'household',
      subcat: activeHouseholdFilter !== 'All' ? activeHouseholdFilter : undefined,
      search: searchQuery || undefined,
    });
    let products = res.products || [];
    // Apply client-side sorting
    if (listingSort === 'price-asc') products.sort((a,b) => (a.price||0) - (b.price||0));
    else if (listingSort === 'price-desc') products.sort((a,b) => (b.price||0) - (a.price||0));
    else if (listingSort === 'rating') products.sort((a,b) => (b.rating||0) - (a.rating||0));
    allProducts.household = products;
    renderProductGrid(grid, allProducts.household);
    // Apply view class
    const hg = document.getElementById('household-grid');
    if (hg) {
      hg.classList.toggle('list-view', listingView === 'list');
    }
  } catch (err) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray-400);">
      <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;display:block;margin-bottom:0.8rem;"></i>
      Unable to load products.<br>
      <code style="font-size:0.75rem;color:var(--terracotta);">${err.message}</code>
    </div>`;
  }
}

function initListingControls() {
  const vg = document.getElementById('view-grid');
  const vl = document.getElementById('view-list');
  const sort = document.getElementById('sort-select');
  if (vg && vl) {
    // Set initial active state based on localStorage
    vg.setAttribute('aria-pressed', listingView === 'grid' ? 'true' : 'false');
    vl.setAttribute('aria-pressed', listingView === 'list' ? 'true' : 'false');

    vg.addEventListener('click', () => {
      listingView = 'grid';
      vg.setAttribute('aria-pressed','true');
      vl.setAttribute('aria-pressed','false');
      document.getElementById('household-grid')?.classList.remove('list-view');
      localStorage.setItem('ps_view', listingView);
    });
    vl.addEventListener('click', () => {
      listingView = 'list';
      vl.setAttribute('aria-pressed','true');
      vg.setAttribute('aria-pressed','false');
      document.getElementById('household-grid')?.classList.add('list-view');
      localStorage.setItem('ps_view', listingView);
    });
  }
  if (sort) {
    sort.addEventListener('change', () => {
      listingSort = sort.value;
      loadHouseholdProducts();
    });
  }
}

async function loadCarousel() {
  const track = document.getElementById('carousel-track');
  if (!track) return;
  try {
    const res = await API.products.featured(8);
    renderCarousel(res.products || []);
  } catch { /* silent fail */ }
}

function setGridLoading(grid) {
  grid.innerHTML = `
    <div style="grid-column:1/-1;display:flex;justify-content:center;align-items:center;padding:4rem;gap:1rem;color:var(--gray-400);">
      <i class="fa-solid fa-spinner fa-spin" style="font-size:1.8rem;color:var(--terracotta);"></i>
      <span>Loading products…</span>
    </div>`;
}

// ── Render product grid ────────────────────────────────────
function renderProductGrid(grid, products) {
  if (!products.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray-400);">
      <i class="fa-solid fa-magnifying-glass" style="font-size:2rem;display:block;margin-bottom:0.8rem;"></i>
      No products found matching your filter.
    </div>`;
    return;
  }
  grid.innerHTML = products.map(renderProductCard).join('');
  bindProductCardEvents(grid);
  initScrollAnimations();
}

function renderProductCard(p) {
  const inWish = wishlist.includes(p.id);
  const badgeMap  = { eco: 'badge-eco', new: 'badge-new', bestseller: 'badge-bestseller', sale: 'badge-sale' };
  const badgeLbl  = { eco: '🌿 Eco', new: '✨ New', bestseller: '🔥 Top Sell', sale: '🏷️ Sale' };
  const discount  = p.original_price ? Math.round((1 - p.price / p.original_price) * 100) : 0;

  return `
    <div class="product-card reveal" data-id="${p.id}" role="article" tabindex="0" aria-label="${p.name}">
      <div class="product-img-wrap">
        ${p.image
          ? `<img src="${p.image}" alt="${p.name}" loading="lazy" />`
          : `<a href="pages/product.html?id=${p.id}" class="product-folder" aria-label="Open ${p.name}">
               <div class="folder-icon">📁</div>
               <div class="folder-gallery">
                 <span></span><span></span><span></span>
               </div>
               <div class="folder-label">${p.name}</div>
             </a>`}
        ${p.badge ? `<span class="product-badge ${badgeMap[p.badge]}">${badgeLbl[p.badge]}</span>` : ''}
        <div class="product-actions" aria-hidden="true">
          <button class="action-btn wishlist-btn ${inWish ? 'wishlist-active' : ''}" data-id="${p.id}" title="Wishlist" aria-label="Wishlist ${p.name}">
            <i class="fa-${inWish ? 'solid' : 'regular'} fa-heart"></i>
          </button>
          <button class="action-btn quick-view-btn" data-id="${p.id}" title="Quick View" aria-label="Quick view ${p.name}">
            <i class="fa-regular fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-details-wrap">
          <div class="product-category">${p.category === 'ganesha' ? '🪷 Eco Ganesha' : '🏠 Household'} · ${p.subcat}</div>
          <h3 class="product-name"><a href="pages/product.html?id=${p.id}" class="product-link">${p.name}</a></h3>
          <div class="product-rating">
            <div class="stars">${renderStars(p.rating)}</div>
            <span class="rating-count">${p.rating} (${p.reviews})</span>
          </div>
          <p class="product-desc-short">${p.description || ''}</p>
        </div>
        <div class="product-price-row">
          <div class="price-group">
            <span class="price-current">₹${p.price.toLocaleString('en-IN')}</span>
            ${p.original_price ? `<span class="price-original">₹${p.original_price.toLocaleString('en-IN')}</span>` : ''}
          </div>
          <button class="add-to-cart-btn" data-id="${p.id}" data-name="${p.name}" aria-label="Add ${p.name} to cart">
            <i class="fa-solid fa-cart-plus"></i>
          </button>
        </div>
        ${discount > 0 ? `<div class="discount-save-tag">Save ${discount}%</div>` : ''}
      </div>
    </div>`;
}

function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty);
}

// ── Bind product card events ───────────────────────────────
function bindProductCardEvents(container = document) {
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.id, btn.dataset.name);
    });
  });

  container.querySelectorAll('.quick-view-btn, .product-card').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = el.dataset.id || el.closest('.product-card')?.dataset.id;
      if (id) openProductModal(id);
    });
  });

  container.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(btn.dataset.id, btn);
    });
  });
}

// ── Wishlist ───────────────────────────────────────────────
function toggleWishlist(id, btn) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(w => w !== id);
    if (btn) { btn.classList.remove('wishlist-active'); btn.innerHTML = '<i class="fa-regular fa-heart"></i>'; }
    showToast('Removed from wishlist', 'info');
  } else {
    wishlist.push(id);
    if (btn) { btn.classList.add('wishlist-active'); btn.innerHTML = '<i class="fa-solid fa-heart"></i>'; }
    showToast('💛 Added to wishlist!', 'success');
  }
  localStorage.setItem('ps_wishlist', JSON.stringify(wishlist));
  fetchAndRenderWishlist();
}

// ── Product Modal ──────────────────────────────────────────
async function openProductModal(id) {
  const overlay = document.getElementById('modal-overlay');
  const modal   = document.getElementById('product-modal');
  if (!overlay || !modal) return;

  // Show skeleton loading state
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-main-img').innerHTML =
    '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;"><i class="fa-solid fa-spinner fa-spin" style="color:var(--terracotta);"></i></div>';

  try {
    const res = await API.products.get(id);
    const p = res.product;
    modalProduct = p;
    modalQty = 1;
    const inWish = wishlist.includes(p.id);
    const discount = p.original_price ? Math.round((1 - p.price / p.original_price) * 100) : 0;

    modal.querySelector('.modal-category').textContent =
      `${p.category === 'ganesha' ? '🪷 Eco-Friendly Ganesha' : '🏠 Household'} · ${p.subcat}`;
    modal.querySelector('.modal-name').textContent    = p.name;
    modal.querySelector('.modal-stars').innerHTML     = renderStars(p.rating);
    modal.querySelector('.modal-rating-text').textContent = `${p.rating} · ${p.reviews} reviews`;
    modal.querySelector('.modal-price-current').textContent  = `₹${p.price.toLocaleString('en-IN')}`;
    modal.querySelector('.modal-price-original').textContent = p.original_price ? `₹${p.original_price.toLocaleString('en-IN')}` : '';
    modal.querySelector('.modal-discount').textContent = discount > 0 ? `Save ${discount}%` : '';
    modal.querySelector('.modal-desc').textContent    = p.description || '';
    modal.querySelector('.modal-qty-num').textContent = 1;
    modal.querySelector('.modal-main-img').innerHTML  = p.image
      ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" />`
      : `<div class="modal-emoji">${p.emoji}</div>`;

    // Features
    const featEl = modal.querySelector('.modal-features');
    if (featEl) {
      featEl.innerHTML = (p.features || []).map(f => `<span class="modal-feature-tag">✓ ${f}</span>`).join('');
    }

    // Wishlist btn
    const wishBtn = modal.querySelector('.modal-wishlist-btn');
    if (wishBtn) {
      wishBtn.className = `modal-wishlist-btn${inWish ? ' active' : ''}`;
      wishBtn.innerHTML = `<i class="fa-${inWish ? 'solid' : 'regular'} fa-heart"></i>`;
      wishBtn.onclick = () => {
        toggleWishlist(p.id, null);
        const isNow = wishlist.includes(p.id);
        wishBtn.className = `modal-wishlist-btn${isNow ? ' active' : ''}`;
        wishBtn.innerHTML = `<i class="fa-${isNow ? 'solid' : 'regular'} fa-heart"></i>`;
      };
    }

    // Qty buttons
    const qtyNum    = modal.querySelector('.modal-qty-num');
    const minusBtn  = modal.querySelector('.modal-qty-minus');
    const plusBtn   = modal.querySelector('.modal-qty-plus');
    if (minusBtn) minusBtn.onclick = () => { modalQty = Math.max(1, modalQty - 1); qtyNum.textContent = modalQty; };
    if (plusBtn)  plusBtn.onclick  = () => { modalQty = Math.min(10, modalQty + 1); qtyNum.textContent = modalQty; };

    // Add to cart
    const addBtn = modal.querySelector('.modal-add-cart');
    if (addBtn) {
      addBtn.onclick = async () => {
        for (let i = 0; i < modalQty; i++) {
          await addToCart(p.id, p.name);
        }
        closeProductModal();
      };
    }
  } catch (err) {
    showToast(err.message, 'error');
    closeProductModal();
  }
}

function closeProductModal() {
  document.getElementById('modal-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function initModalClose() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeProductModal(); });
  document.getElementById('modal-close-btn')?.addEventListener('click', closeProductModal);
}

// ── Carousel ───────────────────────────────────────────────
function renderCarousel(products) {
  const track = document.getElementById('carousel-track');
  if (!track) return;

  track.innerHTML = products.map(p => `
    <div class="carousel-card" data-id="${p.id}" role="listitem" tabindex="0" aria-label="${p.name}">
      <div class="carousel-card-img">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" />` : p.emoji}
      </div>
      <div class="carousel-card-info">
        <div class="carousel-card-name">${p.name}</div>
        <div class="carousel-card-price">₹${p.price.toLocaleString('en-IN')}</div>
      </div>
    </div>`).join('');

  track.querySelectorAll('.carousel-card').forEach(card => {
    card.addEventListener('click', () => openProductModal(card.dataset.id));
  });

  // Dots
  const dotsEl = document.getElementById('carousel-dots');
  const vis = getVisibleCards();
  const total = Math.max(1, products.length - vis + 1);
  if (dotsEl) {
    dotsEl.innerHTML = Array.from({ length: total }, (_, i) =>
      `<div class="carousel-dot ${i === 0 ? 'active' : ''}" data-idx="${i}" role="tab" aria-label="Slide ${i + 1}"></div>`
    ).join('');
    dotsEl.querySelectorAll('.carousel-dot').forEach(d =>
      d.addEventListener('click', () => goToSlide(parseInt(d.dataset.idx)))
    );
  }

  document.getElementById('carousel-prev')?.addEventListener('click', () => goToSlide(carouselIdx - 1));
  document.getElementById('carousel-next')?.addEventListener('click', () => goToSlide(carouselIdx + 1));

  setInterval(() => goToSlide(carouselIdx + 1), 3800);
}

function getVisibleCards() {
  if (window.innerWidth >= 1200) return 4;
  if (window.innerWidth >= 900)  return 3;
  if (window.innerWidth >= 600)  return 2;
  return 1;
}

function goToSlide(idx) {
  const track = document.getElementById('carousel-track');
  const cards  = track?.querySelectorAll('.carousel-card') || [];
  if (!cards.length) return;
  const vis = getVisibleCards();
  const max = Math.max(0, cards.length - vis);
  carouselIdx = ((idx % (max + 1)) + (max + 1)) % (max + 1);
  const cardW = cards[0].offsetWidth + 24;
  track.style.transform = `translateX(-${carouselIdx * cardW}px)`;
  document.querySelectorAll('.carousel-dot').forEach((d, i) =>
    d.classList.toggle('active', i === carouselIdx)
  );
}

// ── Filters ────────────────────────────────────────────────
function initFilters() {
  document.querySelectorAll('#ganesha-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#ganesha-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeGaneshaFilter = btn.dataset.filter;
      loadGaneshaProducts();
    });
  });
  document.querySelectorAll('#household-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#household-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeHouseholdFilter = btn.dataset.filter;
      loadHouseholdProducts();
    });
  });
}

function initCategoryStrip() {
  const strip = document.querySelector('.category-strip');
  document.getElementById('category-scroll-next')?.addEventListener('click', () => {
    strip?.scrollBy({ left: 320, behavior: 'smooth' });
  });
}

// ── Search ─────────────────────────────────────────────────
function initSearch() {
  const input = document.getElementById('search-input');
  const btn   = document.getElementById('search-btn');

  const doSearch = () => {
    searchQuery = input?.value.trim().toLowerCase() || '';
    activeGaneshaFilter   = 'All';
    activeHouseholdFilter = 'All';
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('#ganesha-filters .filter-btn')?.classList.add('active');
    document.querySelector('#household-filters .filter-btn')?.classList.add('active');
    loadGaneshaProducts();
    loadHouseholdProducts();
    if (searchQuery) {
      document.getElementById('ganesha-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  input?.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  btn?.addEventListener('click', doSearch);
}

// ── Newsletter ─────────────────────────────────────────────
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]')?.value.trim();
    if (!email) return;
    try {
      const res = await API.newsletter.subscribe(email);
      showToast(res.message || '🎉 Subscribed!', 'success');
      form.reset();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

// ── Contact ────────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await API.contact.send({
        name:    form.querySelector('#c-name')?.value.trim(),
        email:   form.querySelector('#c-email')?.value.trim(),
        subject: form.querySelector('#c-subject')?.value.trim() || 'Enquiry',
        message: form.querySelector('#c-message')?.value.trim(),
      });
      showToast(res.message, 'success');
      form.reset();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

// ── Scroll Animations ──────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    if (!el.classList.contains('visible')) observer.observe(el);
  });
}

// ── Back to Top ────────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Toast ──────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const iconMap = { success: 'circle-check', info: 'circle-info', error: 'triangle-exclamation', warning: 'triangle-exclamation' };
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'warning' : type}`;
  toast.innerHTML = `<i class="fa-solid fa-${iconMap[type] || 'circle-info'}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Wishlist Drawer Logic ──────────────────────────────────
async function fetchAndRenderWishlist() {
  const itemsEl = document.getElementById('wishlist-items');
  const emptyEl = document.getElementById('wishlist-empty');
  const countEl = document.getElementById('wishlist-count-label');
  const badgeEl = document.getElementById('wishlist-badge');
  
  if (!itemsEl) return;
  
  // Update badge
  if (badgeEl) {
    if (wishlist.length > 0) {
      badgeEl.textContent = wishlist.length;
      badgeEl.classList.remove('hidden');
    } else {
      badgeEl.classList.add('hidden');
    }
  }
  
  if (countEl) countEl.textContent = `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''}`;
  
  // Clear old items
  itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
  
  if (wishlist.length === 0) {
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  
  try {
    const res = await API.products.list();
    const allProds = res.products || [];
    const wishlistProducts = allProds.filter(p => wishlist.includes(p.id));
    
    const html = wishlistProducts.map(p => `
      <div class="cart-item" data-wishlist-id="${p.id}">
        <div class="cart-item-img">
          ${p.image ? `<img src="${p.image}" alt="${p.name}" />` : `<div class="cart-item-emoji">${p.emoji}</div>`}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name" style="cursor:pointer;font-weight:700;" onclick="openProductModalFromWishlist('${p.id}')">${p.name}</div>
          <div class="cart-item-cat">₹${p.price.toLocaleString('en-IN')}</div>
          <button class="add-to-cart-btn-wish" data-id="${p.id}" data-name="${p.name}" style="background:var(--terracotta);color:white;border:none;border-radius:20px;padding:5px 12px;font-size:0.72rem;margin-top:6px;cursor:pointer;font-weight:700;display:inline-flex;align-items:center;gap:6px;">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
          </button>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:center;">
          <button class="wishlist-item-remove" data-id="${p.id}" aria-label="Remove item" style="background:none;border:none;color:#aaa;cursor:pointer;font-size:1.1rem;padding:5px;">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `).join('');
    
    itemsEl.insertAdjacentHTML('beforeend', html);
    bindWishlistItemEvents();
  } catch (err) {
    console.warn('Wishlist render failed:', err.message);
  }
}

function initWishlistEvents() {
  const wishBtn = document.getElementById('wishlist-nav-btn');
  const wishOverlay = document.getElementById('wishlist-overlay');
  const wishSidebar = document.getElementById('wishlist-sidebar');
  const wishCloseBtn = document.getElementById('wishlist-close-btn');
  
  if (wishBtn) {
    wishBtn.addEventListener('click', () => {
      // Close cart sidebar if open
      document.getElementById('cart-overlay')?.classList.remove('open');
      document.getElementById('cart-sidebar')?.classList.remove('open');
      
      wishOverlay?.classList.add('open');
      wishSidebar?.classList.add('open');
      document.body.style.overflow = 'hidden';
      fetchAndRenderWishlist();
    });
  }
  
  const closeWishlist = () => {
    wishOverlay?.classList.remove('open');
    wishSidebar?.classList.remove('open');
    document.body.style.overflow = '';
  };
  
  if (wishOverlay) wishOverlay.addEventListener('click', closeWishlist);
  if (wishCloseBtn) wishCloseBtn.addEventListener('click', closeWishlist);
}

function bindWishlistItemEvents() {
  document.querySelectorAll('.wishlist-item-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      toggleWishlist(id, null);
      document.querySelectorAll(`.wishlist-btn[data-id="${id}"]`).forEach(b => {
        b.classList.remove('wishlist-active');
        b.innerHTML = '<i class="fa-regular fa-heart"></i>';
      });
    });
  });
  
  document.querySelectorAll('.add-to-cart-btn-wish').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof addToCart === 'function') {
        addToCart(btn.dataset.id, btn.dataset.name);
      }
    });
  });
}

window.openProductModalFromWishlist = function(id) {
  document.getElementById('wishlist-overlay')?.classList.remove('open');
  document.getElementById('wishlist-sidebar')?.classList.remove('open');
  document.body.style.overflow = '';
  openProductModal(id);
};

// ── Globals ────────────────────────────────────────────────
window.showToast        = showToast;
// Expose functions for wishlist
window.fetchAndRenderWishlist = fetchAndRenderWishlist;
window.initWishlistEvents     = initWishlistEvents;
window.closeProductModal = closeProductModal;
window.openProductModal  = openProductModal;

