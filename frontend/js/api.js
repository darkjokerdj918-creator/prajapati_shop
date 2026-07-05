/**
 * api.js — Centralized API client for Prajapati Store
 * All fetch() calls to the FastAPI backend live here.
 */

const API_BASE = (window.location.port && window.location.port !== '8000')
  ? `http://${window.location.hostname}:8000/api/v1`
  : (window.location.protocol === 'file:' || window.location.origin === 'null')
    ? 'http://127.0.0.1:8000/api/v1'
    : '/api/v1';

// ── Helpers ────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('ps_token');
}

function setToken(token) {
  localStorage.setItem('ps_token', token);
}

function clearToken() {
  localStorage.removeItem('ps_token');
  localStorage.removeItem('ps_user');
}

function getUser() {
  try {
    const u = localStorage.getItem('ps_user');
    return u ? JSON.parse(u) : null;
  } catch { return null; }
}

function setUser(user) {
  localStorage.setItem('ps_user', JSON.stringify(user));
}

function isLoggedIn() {
  return !!getToken();
}

/**
 * Core fetch wrapper with automatic auth header injection.
 * @param {string} path    - API path (e.g. '/products')
 * @param {object} options - fetch options
 * @returns {Promise<any>} - parsed JSON response
 */
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',   // Send cookies (for guest session_id)
    ...options,
    headers,
  });

  let data;
  try { data = await res.json(); } catch { data = {}; }

  if (!res.ok) {
    const msg = data?.detail || data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

// ═══════════════════════════════════════════════════════════
//  PRODUCTS API
// ═══════════════════════════════════════════════════════════

const ProductsAPI = {
  /** List products with optional filters */
  list({ category, subcat, search, badge, skip = 0, limit = 100 } = {}) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (subcat)   params.set('subcat', subcat);
    if (search)   params.set('search', search);
    if (badge)    params.set('badge', badge);
    params.set('skip', skip);
    params.set('limit', limit);
    return apiFetch(`/products?${params}`);
  },

  /** Get single product detail */
  get(id) {
    return apiFetch(`/products/${id}`);
  },

  /** Get featured/bestselling products */
  featured(limit = 8) {
    return apiFetch(`/products/featured?limit=${limit}`);
  },
};

// ═══════════════════════════════════════════════════════════
//  AUTH API
// ═══════════════════════════════════════════════════════════

const AuthAPI = {
  /** Register a new account */
  async register(data) {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(res.access_token);
    setUser(res.user);
    return res;
  },

  /** Login and store JWT */
  async login(data) {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(res.access_token);
    setUser(res.user);
    return res;
  },

  /** Get current user profile */
  me() {
    return apiFetch('/auth/me');
  },

  /** Update user profile */
  updateProfile(data) {
    return apiFetch('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /** Change account password */
  updatePassword(data) {
    return apiFetch('/auth/me/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /** Logout (clear local state) */
  logout() {
    clearToken();
  },
};

// ═══════════════════════════════════════════════════════════
//  CART API
// ═══════════════════════════════════════════════════════════

const CartAPI = {
  /** Fetch the current cart */
  get() {
    return apiFetch('/cart');
  },

  /** Add item to cart */
  add(product_id, quantity = 1) {
    return apiFetch('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ product_id, quantity }),
    });
  },

  /** Update quantity of a cart item */
  update(item_id, quantity) {
    return apiFetch(`/cart/update/${item_id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  /** Remove a specific cart item */
  remove(item_id) {
    return apiFetch(`/cart/remove/${item_id}`, { method: 'DELETE' });
  },

  /** Clear all cart items */
  clear() {
    return apiFetch('/cart/clear', { method: 'DELETE' });
  },
};

// ═══════════════════════════════════════════════════════════
//  ORDERS API
// ═══════════════════════════════════════════════════════════

const OrdersAPI = {
  /** Place an order from current cart */
  create(data) {
    return apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** Get all orders for the logged-in user */
  list() {
    return apiFetch('/orders');
  },

  /** Get a single order by ID */
  get(id) {
    return apiFetch(`/orders/${id}`);
  },
};

// ═══════════════════════════════════════════════════════════
//  NEWSLETTER & CONTACT API
// ═══════════════════════════════════════════════════════════

const NewsletterAPI = {
  subscribe(email) {
    return apiFetch('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

const ContactAPI = {
  send(data) {
    return apiFetch('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ═══════════════════════════════════════════════════════════
//  EXPORTS (accessible globally via window)
// ═══════════════════════════════════════════════════════════
window.API = {
  products: ProductsAPI,
  auth:     AuthAPI,
  cart:     CartAPI,
  orders:   OrdersAPI,
  newsletter: NewsletterAPI,
  contact:  ContactAPI,
  isLoggedIn,
  getUser,
  getToken,
  clearToken,
};
