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
  
  // Parse images (comma-separated list)
  const images = p.image ? p.image.split(',').map(s => s.trim()).filter(Boolean) : [];
  
  if (images.length === 0) {
    gallery.innerHTML = `<div class="product-placeholder">${p.emoji}</div>`;
  } else if (images.length === 1) {
    const src = images[0].startsWith('http') || images[0].startsWith('/') ? images[0] : '/' + images[0];
    gallery.innerHTML = `<img src="${src}" alt="${p.name}" style="width:100%; border-radius:12px; max-width:500px; display:block; margin:0 auto; aspect-ratio:1/1; object-fit:cover; box-shadow: 0 4px 15px rgba(0,0,0,0.05);" />`;
  } else {
    // Multiple images -> Slideshow + Thumbnails
    let slidesHtml = '';
    let thumbsHtml = '';
    
    images.forEach((img, idx) => {
      const src = img.startsWith('http') || img.startsWith('/') ? img : '/' + img;
      slidesHtml += `
        <div class="slide-item">
          <img src="${src}" alt="${p.name} - Image ${idx + 1}" />
        </div>`;
      thumbsHtml += `
        <div class="thumbnail-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
          <img src="${src}" alt="Thumbnail ${idx + 1}" />
        </div>`;
    });
    
    gallery.innerHTML = `
      <div class="product-gallery-container">
        <div class="slideshow-container">
          <div class="slides-track" id="slides-track">
            ${slidesHtml}
          </div>
          <button class="slideshow-nav-btn prev" id="slide-prev-btn"><i class="fa-solid fa-chevron-left"></i></button>
          <button class="slideshow-nav-btn next" id="slide-next-btn"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
        <div class="thumbnail-gallery">
          ${thumbsHtml}
        </div>
      </div>
    `;
    
    // JS Logic for slide transition
    let currentSlide = 0;
    const track = document.getElementById('slides-track');
    const thumbs = gallery.querySelectorAll('.thumbnail-item');
    const totalSlides = images.length;
    let slideInterval;
    
    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentSlide = index;
      
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update thumbnails active state
      thumbs.forEach((t, i) => t.classList.toggle('active', i === currentSlide));
      
      // Reset timer
      startAutoSlide();
    }
    
    function startAutoSlide() {
      clearInterval(slideInterval);
      slideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 3000); // 3 seconds auto-slide
    }
    
    // Bind buttons
    document.getElementById('slide-prev-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentSlide - 1);
    });
    
    document.getElementById('slide-next-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentSlide + 1);
    });
    
    // Bind thumbnails
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        goToSlide(parseInt(thumb.dataset.index));
      });
    });
    
    startAutoSlide();
  }

  const showPrice = p.price !== null && p.price !== undefined;
  buybox.innerHTML = `
    <h1>${p.name}</h1>
    ${showPrice ? `<div class="price">₹${p.price}</div>` : ''}
    <p>${p.description}</p>
    ${showPrice ? `
    <div class="buy-actions">
      <button id="add-to-cart">Add to cart</button>
    </div>
    ` : ''}
  `;
  document.getElementById('specs-content').innerHTML = `<ul>${(p.features||'').split(',').map(f => `<li>${f}</li>`).join('')}</ul>`;
  // simple reviews placeholder
  document.getElementById('reviews-list').innerHTML = `<p>No reviews yet.</p>`;
  document.getElementById('add-to-cart')?.addEventListener('click', () => {
    fetch('/api/v1/cart', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ product_id: p.id, qty: 1 }) })
      .then(r => r.ok ? alert('Added to cart') : alert('Failed'))
  });
}
