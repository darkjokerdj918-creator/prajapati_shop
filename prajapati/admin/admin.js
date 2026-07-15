/**
 * admin.js — Control Panel and Dashboard Analytics
 * Prajapati Store Admin Panel
 */

// ── API Setup ──────────────────────────────────────────────
const ADMIN_API_BASE = '/api/v1';

async function adminFetch(path, options = {}) {
  const token = localStorage.getItem('ps_admin_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${ADMIN_API_BASE}${path}`, { ...options, headers });
  let data;
  try { data = await res.json(); } catch { data = {}; }
  if (!res.ok) throw new Error(data?.detail || data?.message || `Request failed (${res.status})`);
  return data;
}

// ── Global State ──────────────────────────────────────────
let allProducts = [];
let editingProductId = null;
let salesChart = null;

// ── Initialize App ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  verifyAdminAccess();
  initAdminLogin();
  initNavigation();
  initProductFilters();
  initProductForm();
  initImageHandlers();
});

// ── Authentication ────────────────────────────────────────
function verifyAdminAccess() {
  const token = localStorage.getItem('ps_admin_token');
  let user = null;
  try { user = JSON.parse(localStorage.getItem('ps_admin_user')); } catch { user = null; }

  const loginScreen  = document.getElementById('admin-login-screen');
  const mainContainer = document.querySelector('.admin-container');

  if (!token || !user || !user.is_admin) {
    if (loginScreen)   loginScreen.style.display = 'flex';
    if (mainContainer) mainContainer.style.display = 'none';
    return;
  }

  if (loginScreen)   loginScreen.style.display = 'none';
  if (mainContainer) mainContainer.style.display = 'flex';

  document.getElementById('admin-user-name').textContent = user.full_name || 'Store Admin';
  refreshData();
}

function initAdminLogin() {
  const loginForm = document.getElementById('admin-login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;

    setLoadingState(true);
    try {
      const res = await adminFetch('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      // Use dedicated admin keys — separate from user session
      localStorage.setItem('ps_admin_token', res.access_token);
      localStorage.setItem('ps_admin_user',  JSON.stringify(res.user));

      showToast('Welcome to the admin dashboard!', 'success');
      verifyAdminAccess();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingState(false);
    }
  });
}

// ── Refresh Data ──────────────────────────────────────────
async function refreshData() {
  setLoadingState(true);
  try {
    await Promise.all([loadDashboardStats(), loadProductsList()]);
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setLoadingState(false);
  }
}

// ── Sidebar Navigation ────────────────────────────────────
function initNavigation() {
  const menuButtons = document.querySelectorAll('.menu-item[data-tab]');
  const tabPanels   = document.querySelectorAll('.tab-panel');
  const pageTitle   = document.getElementById('page-title');
  const quickAddBtn = document.getElementById('quick-add-btn');

  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      menuButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === tabId) panel.classList.add('active');
      });
      pageTitle.textContent = tabId === 'dashboard-tab' ? 'Store Dashboard' : 'Products Inventory';
      quickAddBtn.style.display = 'flex';
    });
  });

  document.getElementById('admin-logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('ps_admin_token');
    localStorage.removeItem('ps_admin_user');
    showToast('Logged out successfully', 'info');
    setTimeout(() => window.location.reload(), 900);
  });

  quickAddBtn.addEventListener('click', () => openProductModal());
}

// ── Dashboard Stats ───────────────────────────────────────
async function loadDashboardStats() {
  const stats = await adminFetch('/admin/dashboard/stats');

  document.getElementById('stat-revenue').textContent  = `₹${stats.total_revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  document.getElementById('stat-orders').textContent   = stats.total_orders;
  document.getElementById('stat-aov').textContent      = `₹${stats.average_order_value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  document.getElementById('stat-products').textContent = stats.total_products;

  renderSalesTrendChart(stats.sales_trend);

  const lowStockList = document.getElementById('low-stock-list');
  if (!stats.low_stock_products.length) {
    lowStockList.innerHTML = `<div class="empty-state-sm"><i class="fa-regular fa-circle-check"></i><span>All products fully in stock!</span></div>`;
  } else {
    lowStockList.innerHTML = stats.low_stock_products.map(p => `
      <div class="low-stock-item">
        <div class="low-stock-info"><span class="low-stock-emoji">${p.emoji}</span><strong>${p.name}</strong></div>
        <span class="stock-pill ${p.stock === 0 ? 'out-of-stock' : ''}">${p.stock === 0 ? 'Out of Stock' : p.stock + ' left'}</span>
      </div>`).join('');
  }

  const bestsellersTable = document.getElementById('bestsellers-table');
  if (!stats.bestsellers.length) {
    bestsellersTable.innerHTML = `<div class="empty-state-sm"><i class="fa-solid fa-chart-simple"></i><span>No sales yet.</span></div>`;
  } else {
    bestsellersTable.innerHTML = stats.bestsellers.map((p, idx) => `
      <div class="ranking-table-row">
        <div class="ranking-rank">#${idx + 1}</div>
        ${p.image ? `<img src="/${p.image}" class="ranking-image" alt="">` : `<div class="ranking-image emoji-thumb">${p.emoji}</div>`}
        <div class="ranking-name">${p.name}</div>
        <div class="ranking-stats">
          <div class="qty">${p.quantity_sold} sold</div>
          <div class="revenue">₹${p.revenue.toLocaleString('en-IN')}</div>
        </div>
      </div>`).join('');
  }

  const slowmoversTable = document.getElementById('slowmovers-table');
  if (!stats.slow_movers.length) {
    slowmoversTable.innerHTML = `<div class="empty-state-sm"><i class="fa-solid fa-boxes-stacked"></i><span>No products yet.</span></div>`;
  } else {
    slowmoversTable.innerHTML = stats.slow_movers.map((p, idx) => `
      <div class="ranking-table-row">
        <div class="ranking-rank">#${idx + 1}</div>
        ${p.image ? `<img src="/${p.image}" class="ranking-image" alt="">` : `<div class="ranking-image emoji-thumb">${p.emoji}</div>`}
        <div class="ranking-name">${p.name}</div>
        <div class="ranking-stats">
          <div class="qty">${p.quantity_sold} sold</div>
          <div class="revenue">₹${p.revenue.toLocaleString('en-IN')}</div>
        </div>
      </div>`).join('');
  }
}

function renderSalesTrendChart(salesTrend) {
  const canvas = document.getElementById('salesTrendChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (salesChart) salesChart.destroy();

  const labels     = salesTrend.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const salesData  = salesTrend.map(t => t.sales);
  const ordersData = salesTrend.map(t => t.orders_count);

  salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Revenue (₹)',
          data: salesData,
          borderColor: '#C1440E',
          backgroundColor: 'rgba(193, 68, 14, 0.08)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#C1440E',
          pointRadius: 4,
          yAxisID: 'y'
        },
        {
          label: 'Orders',
          data: ordersData,
          borderColor: '#D4A030',
          backgroundColor: 'rgba(212, 160, 48, 0.06)',
          borderWidth: 2,
          tension: 0.4,
          fill: false,
          pointBackgroundColor: '#D4A030',
          pointRadius: 4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { font: { family: 'Lato', size: 13 }, usePointStyle: true } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Lato' } } },
        y: {
          type: 'linear', display: true, position: 'left',
          grid: { color: 'rgba(240, 228, 200, 0.6)' },
          ticks: { font: { family: 'Lato' }, callback: v => '₹' + v }
        },
        y1: {
          type: 'linear', display: true, position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { font: { family: 'Lato' }, stepSize: 1 }
        }
      }
    }
  });
}

// ── Products Inventory ────────────────────────────────────
async function loadProductsList() {
  const products = await adminFetch('/admin/products');
  allProducts = products;
  filterAndRenderProducts();
}

function filterAndRenderProducts() {
  const searchVal      = document.getElementById('product-search').value.toLowerCase();
  const categoryFilter = document.getElementById('category-filter').value;
  const stockFilter    = document.getElementById('stock-filter').value;
  const tbody          = document.getElementById('products-table-body');

  const filtered = allProducts.filter(p => {
    const matchesSearch   = p.id.toLowerCase().includes(searchVal) || p.name.toLowerCase().includes(searchVal);
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    let matchesStock = true;
    if (stockFilter === 'in_stock')     matchesStock = p.stock >= 10;
    else if (stockFilter === 'low_stock')   matchesStock = p.stock > 0 && p.stock < 10;
    else if (stockFilter === 'out_of_stock') matchesStock = p.stock === 0;
    return matchesSearch && matchesCategory && matchesStock;
  });

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-table-cell"><i class="fa-solid fa-box-open"></i><br>No matching products found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    let stockClass = 'normal';
    if (p.stock === 0) stockClass = 'critical';
    else if (p.stock < 10) stockClass = 'warning';
    const stockPercent = Math.min((p.stock / 100) * 100, 100);

    return `
      <tr>
        <td>
          ${p.image
            ? `<img src="/${p.image}" class="tbl-product-img" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
            : ''}
          <div class="tbl-product-emoji" style="${p.image ? 'display:none' : ''}">${p.emoji || '🏺'}</div>
        </td>
        <td><code class="product-id-badge">${p.id}</code></td>
        <td><span class="product-title">${p.name}</span><br><small class="product-subcat">${p.subcat}</small></td>
        <td><span class="category-chip cat-${p.category}">${p.category}</span></td>
        <td>
          <strong class="price-text">₹${p.price.toFixed(2)}</strong>
          ${p.original_price ? `<br><s class="original-price">₹${p.original_price.toFixed(2)}</s>` : ''}
        </td>
        <td>
          <div class="stock-indicator">
            <span class="stock-text stock-${stockClass}">${p.stock} units</span>
            <div class="stock-bar-bg"><div class="stock-bar-fill ${stockClass}" style="width:${stockPercent}%"></div></div>
          </div>
        </td>
        <td><span class="status-badge ${p.is_active !== false ? 'active' : 'inactive'}">${p.is_active !== false ? 'Active' : 'Archived'}</span></td>
        <td>
          <div class="action-group">
            <button class="action-btn edit-btn" onclick="editProduct('${p.id}')" title="Edit Product">
              <i class="fa-solid fa-pen"></i> Edit
            </button>
            <button class="action-btn delete-btn" onclick="deleteProduct('${p.id}')" title="Delete Product">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

function initProductFilters() {
  document.getElementById('product-search').addEventListener('input', filterAndRenderProducts);
  document.getElementById('category-filter').addEventListener('change', filterAndRenderProducts);
  document.getElementById('stock-filter').addEventListener('change', filterAndRenderProducts);
}

// ── CRUD Operations ───────────────────────────────────────
function openProductModal(productId = null) {
  const modal   = document.getElementById('product-modal');
  const title   = document.getElementById('modal-title');
  const idInput = document.getElementById('prod-id');
  const form    = document.getElementById('product-form');

  form.reset();
  editingProductId = productId;
  document.getElementById('image-preview').style.display = 'none';
  document.getElementById('prod-image-path').value = '';
  toggleImageTab('upload');

  if (productId) {
    title.textContent = 'Edit Product';
    idInput.disabled = true;
    const p = allProducts.find(item => item.id === productId);
    if (p) {
      idInput.value = p.id;
      document.getElementById('prod-name').value           = p.name;
      document.getElementById('prod-category').value       = p.category;
      document.getElementById('prod-subcat').value         = p.subcat;
      document.getElementById('prod-price').value          = p.price;
      document.getElementById('prod-original-price').value = p.original_price || '';
      document.getElementById('prod-stock').value          = p.stock;
      document.getElementById('prod-emoji').value          = p.emoji || '🏺';
      document.getElementById('prod-description').value    = p.description || '';
      document.getElementById('prod-features').value       = Array.isArray(p.features) ? p.features.join(', ') : (p.features || '');
      if (p.image) {
        document.getElementById('prod-image-path').value = p.image;
        const preview = document.getElementById('image-preview');
        preview.style.display = 'flex';
        preview.querySelector('img').src = '/' + p.image;
      }
    }
  } else {
    title.textContent = 'Add New Product';
    idInput.disabled = false;
  }

  modal.classList.add('open');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('open');
}

function initProductForm() {
  const modal = document.getElementById('product-modal');
  const form  = document.getElementById('product-form');

  document.getElementById('close-modal-btn').addEventListener('click', closeProductModal);
  document.getElementById('btn-cancel-modal').addEventListener('click', closeProductModal);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProductModal();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const prodId        = document.getElementById('prod-id').value.trim();
    const featuresInput = document.getElementById('prod-features').value;

    const payload = {
      id:             prodId,
      name:           document.getElementById('prod-name').value.trim(),
      category:       document.getElementById('prod-category').value,
      subcat:         document.getElementById('prod-subcat').value.trim(),
      price:          parseFloat(document.getElementById('prod-price').value),
      original_price: document.getElementById('prod-original-price').value
                        ? parseFloat(document.getElementById('prod-original-price').value)
                        : null,
      stock:          parseInt(document.getElementById('prod-stock').value),
      emoji:          document.getElementById('prod-emoji').value.trim() || '🏺',
      description:    document.getElementById('prod-description').value.trim(),
      features:       featuresInput,
      image:          document.getElementById('prod-image-path').value || null
    };

    const saveBtn = document.getElementById('btn-save-product');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
      if (editingProductId) {
        await adminFetch(`/admin/products/${editingProductId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast('Product updated successfully!', 'success');
      } else {
        await adminFetch('/admin/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast('Product created successfully!', 'success');
      }
      closeProductModal();
      await loadProductsList();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Product';
    }
  });
}

window.editProduct = function(productId) {
  openProductModal(productId);
};

window.deleteProduct = async function(productId) {
  showConfirmDialog(
    `Delete Product`,
    `Are you sure you want to delete <strong>${productId}</strong>? The product will be hidden from the shop but past orders will be preserved.`,
    async () => {
      try {
        await adminFetch(`/admin/products/${productId}`, { method: 'DELETE' });
        showToast('Product deleted successfully', 'success');
        // Remove from local array immediately so UI updates without re-fetch
        allProducts = allProducts.filter(p => p.id !== productId);
        filterAndRenderProducts();
        // Then refresh from server in background
        loadProductsList();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  );
};

// ── Confirm Dialog ────────────────────────────────────────
function showConfirmDialog(title, message, onConfirm) {
  const existing = document.getElementById('confirm-dialog');
  if (existing) existing.remove();

  const dialog = document.createElement('div');
  dialog.id = 'confirm-dialog';
  dialog.className = 'confirm-overlay';
  dialog.innerHTML = `
    <div class="confirm-card">
      <div class="confirm-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="confirm-actions">
        <button class="btn btn-secondary" id="confirm-cancel-btn">Cancel</button>
        <button class="btn btn-danger" id="confirm-ok-btn"><i class="fa-solid fa-trash"></i> Delete</button>
      </div>
    </div>`;
  document.body.appendChild(dialog);

  requestAnimationFrame(() => dialog.classList.add('open'));

  const close = () => { dialog.classList.remove('open'); setTimeout(() => dialog.remove(), 250); };
  document.getElementById('confirm-cancel-btn').addEventListener('click', close);
  document.getElementById('confirm-ok-btn').addEventListener('click', async () => {
    close();
    await onConfirm();
  });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
}

// ── Image Upload ──────────────────────────────────────────
function initImageHandlers() {
  const toggleUpload = document.getElementById('btn-toggle-upload');
  const toggleUrl    = document.getElementById('btn-toggle-url');

  toggleUpload.addEventListener('click', () => toggleImageTab('upload'));
  toggleUrl.addEventListener('click',   () => toggleImageTab('url'));

  const urlInput = document.getElementById('prod-image-url');
  urlInput.addEventListener('input', () => {
    const val = urlInput.value.trim();
    document.getElementById('prod-image-path').value = val;
    const preview = document.getElementById('image-preview');
    if (val) {
      preview.style.display = 'flex';
      preview.querySelector('img').src = val.startsWith('http') || val.startsWith('/') ? val : '/' + val;
    } else {
      preview.style.display = 'none';
    }
  });

  document.getElementById('btn-remove-image').addEventListener('click', () => {
    document.getElementById('prod-image-path').value = '';
    document.getElementById('prod-image-url').value  = '';
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('prod-image-file').value = '';
  });

  const dropzone  = document.getElementById('dropzone');
  const fileInput = document.getElementById('prod-image-file');

  dropzone.addEventListener('click',     () => fileInput.click());
  dropzone.addEventListener('dragover',  (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop',      (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleImageUpload(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) handleImageUpload(fileInput.files[0]);
  });
}

function toggleImageTab(tabType) {
  const isUpload = tabType === 'upload';
  document.getElementById('btn-toggle-upload').classList.toggle('active',  isUpload);
  document.getElementById('btn-toggle-url').classList.toggle('active',    !isUpload);
  document.getElementById('upload-container').style.display = isUpload ? 'block' : 'none';
  document.getElementById('url-container').style.display    = isUpload ? 'none'  : 'block';
}

async function handleImageUpload(file) {
  const progressWrapper = document.getElementById('upload-progress');
  progressWrapper.style.display = 'block';

  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('ps_admin_token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const res = await fetch(`${ADMIN_API_BASE}/admin/products/upload-image`, {
      method: 'POST', headers, body: formData
    });
    let resData;
    try { resData = await res.json(); } catch { resData = {}; }
    if (!res.ok) throw new Error(resData?.detail || 'Image upload failed');

    document.getElementById('prod-image-path').value = resData.image_path;
    const preview = document.getElementById('image-preview');
    preview.style.display = 'flex';
    preview.querySelector('img').src = '/' + resData.image_path;
    showToast('Image uploaded successfully!', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    progressWrapper.style.display = 'none';
  }
}

// ── Utilities ─────────────────────────────────────────────
function setLoadingState(isLoading) {
  const loader = document.getElementById('admin-loading');
  if (loader) loader.style.display = isLoading ? 'flex' : 'none';
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.success}"></i><span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
