// product.js — Render product detail from query param `id`
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) {
    document.getElementById('gallery').innerText = 'No product specified.';
    return;
  }
  try {
    const res = await fetch(`/api/v1/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    const product = await res.json();
    renderProduct(product);
  } catch (err) {
    document.getElementById('gallery').innerText = err.message;
  }
});

function renderProduct(p) {
  const gallery = document.getElementById('gallery');
  const buybox = document.getElementById('buybox');
  gallery.innerHTML = p.image ? `<img src="/${p.image}" alt="${p.name}" />` : `<div class="product-placeholder">${p.emoji}</div>`;
  buybox.innerHTML = `
    <h1>${p.name}</h1>
    <div class="price">₹${p.price}</div>
    <div class="rating">${p.rating} (${p.reviews} reviews)</div>
    <p>${p.description}</p>
    <div class="buy-actions">
      <button id="add-to-cart">Add to cart</button>
    </div>
  `;
  document.getElementById('specs-content').innerHTML = `<ul>${(p.features||'').split(',').map(f => `<li>${f}</li>`).join('')}</ul>`;
  // simple reviews placeholder
  document.getElementById('reviews-list').innerHTML = `<p>No reviews yet.</p>`;
  document.getElementById('add-to-cart')?.addEventListener('click', () => {
    fetch('/api/v1/cart', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ product_id: p.id, qty: 1 }) })
      .then(r => r.ok ? alert('Added to cart') : alert('Failed'))
  });
}
