/**
 * auth.js — Handles login/register page logic and navbar auth state
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuthPage();
  updateNavAuth();
});

// ── Update navbar auth button ──────────────────────────────
function updateNavAuth() {
  const authNavBtn  = document.getElementById('auth-nav-btn');
  const userNavBtn  = document.getElementById('user-nav-btn');
  const userNavName = document.getElementById('user-nav-name');
  const logoutBtn   = document.getElementById('logout-nav-btn');
  const ordersBtn   = document.getElementById('orders-nav-btn');

  if (!authNavBtn) return;

  if (API.isLoggedIn()) {
    const user = API.getUser();
    authNavBtn.style.display = 'none';
    if (userNavBtn)  userNavBtn.style.display  = 'flex';
    if (userNavName) userNavName.textContent    = user?.full_name?.split(' ')[0] || 'Account';
    if (ordersBtn)   ordersBtn.style.display   = 'flex';
    if (logoutBtn)   logoutBtn.style.display   = 'flex';
  } else {
    authNavBtn.style.display = 'flex';
    if (userNavBtn)  userNavBtn.style.display  = 'none';
    if (ordersBtn)   ordersBtn.style.display   = 'none';
    if (logoutBtn)   logoutBtn.style.display   = 'none';
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      API.auth.logout();
      showToast('👋 Logged out successfully', 'info');
      setTimeout(() => { window.location.href = '/'; }, 1000);
    });
  }
}

// ── Auth Page Tabs ─────────────────────────────────────────
function initAuthPage() {
  const loginTab    = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const loginForm   = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (!loginTab) return; // Not on auth page

  // If already logged in, redirect home
  if (API.isLoggedIn()) {
    window.location.href = '/';
    return;
  }

  // Show login by default (or by hash)
  const showRegister = window.location.hash === '#register';
  toggleTab(showRegister ? 'register' : 'login');

  loginTab.addEventListener('click', () => toggleTab('login'));
  registerTab.addEventListener('click', () => toggleTab('register'));

  // ── Login Form ──
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = loginForm.querySelector('.auth-submit-btn');
      const email    = loginForm.querySelector('#login-email').value.trim();
      const password = loginForm.querySelector('#login-password').value;

      setLoading(btn, true);
      try {
        await API.auth.login({ email, password });
        showToast('✅ Welcome back! Logging you in…', 'success');
        setTimeout(() => {
          window.location.href = document.referrer || '/';
        }, 800);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(btn, false);
      }
    });
  }

  // ── Register Form ──
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn      = registerForm.querySelector('.auth-submit-btn');
      const fullName = registerForm.querySelector('#reg-name').value.trim();
      const email    = registerForm.querySelector('#reg-email').value.trim();
      const phone    = registerForm.querySelector('#reg-phone').value.trim();
      const password = registerForm.querySelector('#reg-password').value;
      const confirm  = registerForm.querySelector('#reg-confirm').value;

      if (password !== confirm) {
        showToast('Passwords do not match!', 'error');
        return;
      }
      if (password.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        return;
      }

      setLoading(btn, true);
      try {
        await API.auth.register({ full_name: fullName, email, password, phone });
        showToast('🎉 Account created! Welcome to Prajapati Store!', 'success');
        setTimeout(() => { window.location.href = '/'; }, 1000);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(btn, false);
      }
    });
  }

  // Password toggle visibility
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.innerHTML = isPass
        ? '<i class="fa-solid fa-eye-slash"></i>'
        : '<i class="fa-solid fa-eye"></i>';
    });
  });
}

function toggleTab(tab) {
  const loginTab    = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const loginPanel  = document.getElementById('login-panel');
  const regPanel    = document.getElementById('register-panel');

  if (tab === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginPanel.classList.add('active');
    regPanel.classList.remove('active');
  } else {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    regPanel.classList.add('active');
    loginPanel.classList.remove('active');
  }
}

function setLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn.innerHTML = loading
    ? '<i class="fa-solid fa-spinner fa-spin"></i> Please wait…'
    : btn.dataset.label || 'Submit';
}

// Re-use toast from app.js if on same page, otherwise define locally
if (typeof showToast === 'undefined') {
  window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const iconMap = { success: 'circle-check', info: 'circle-info', error: 'circle-exclamation' };
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
  };
}
