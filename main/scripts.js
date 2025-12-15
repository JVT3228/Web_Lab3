// In-page search: find and highlight matches within site-main
(function(){
  function escapeRegExp(text){
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function clearHighlights(container){
    const marks = container.querySelectorAll('mark.search-highlight');
    marks.forEach(mark=>{
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  function highlightMatches(container, text){
    clearHighlights(container);
    if (!text) return 0;
    const regex = new RegExp(escapeRegExp(text), 'gi');
    let count=0;
    function walk(node){
      if (node.nodeType===3){ // text
        const m = node.data.match(regex);
        if (m){
          const frag = document.createDocumentFragment();
          let lastIndex=0;
          node.data.replace(regex, function(match, idx){
            if (idx>lastIndex){
              frag.appendChild(document.createTextNode(node.data.slice(lastIndex, idx)));
            }
            const mark = document.createElement('mark');
            mark.className='search-highlight';
            mark.textContent = match;
            frag.appendChild(mark);
            lastIndex = idx+match.length;
            count++;
          });
          if (lastIndex<node.data.length){
            frag.appendChild(document.createTextNode(node.data.slice(lastIndex)));
          }
          node.parentNode.replaceChild(frag, node);
        }
      } else if (node.nodeType===1 && node.childNodes && !['SCRIPT','STYLE','NOSCRIPT','IFRAME'].includes(node.tagName)){
        node.childNodes.forEach(child=>walk(child));
      }
    }
    walk(container);
    return count;
  }

  function searchHandler(ev){
    ev.preventDefault();
    const form = ev.currentTarget;
    const input = form.querySelector('input[type="search"]');
    if (!input) return;
    const q = input.value.trim();
    const container = document.querySelector('.site-main') || document.body;
    clearHighlights(container);
    if (!q){
      return;
    }
    const found = highlightMatches(container, q);
    // scroll to first match
    const first = container.querySelector('mark.search-highlight');
    if (first){
      first.scrollIntoView({behavior:'smooth', block:'center'});
      // briefly flash
      first.style.background = 'var(--accent)';
      setTimeout(()=>first.style.background='', 1200);
    } else {
      // no results
      alert('Ничего не найдено на странице. Попробуйте другое слово.');
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('form.header-search').forEach(f=>f.addEventListener('submit', searchHandler));
    // Register form password confirmation
    const regForm = document.querySelector('form.contacts-form');
    if (regForm && regForm.querySelector('#confirmPassword')){
      regForm.addEventListener('submit', function(e){
        const pass = regForm.querySelector('#password');
        const confirm = regForm.querySelector('#confirmPassword');
        if (pass && confirm && pass.value !== confirm.value){
          e.preventDefault();
          alert('Пароли не совпадают.');
          confirm.focus();
          return false;
        }
      });
    }
  });
})();

// Инициализация бегущих строк (ticker) — делаем содержимое достаточно длинным
// чтобы бесшовно прокручиваться от края до края экрана, независимо от ширины.
(function(){
  function initTicker(track){
    if (!track) return;
    // сохранённый оригинальный набор элементов (до клонирования)
    if (!track.dataset.orig) track.dataset.orig = track.innerHTML;
    // восстановить из исходного
    track.innerHTML = track.dataset.orig;
    // повторять исходный блок, пока ширина не превысит ширину окна
    let safety = 0;
    while (track.scrollWidth < window.innerWidth && safety < 12){
      track.innerHTML += track.dataset.orig;
      safety++;
    }
    // повторим ещё раз весь трек чтобы получить 2 одинаковые половины
    track.innerHTML = track.innerHTML + track.innerHTML;
    // подстроить длительность анимации под ширину контента (примерное значение)
    const duration = Math.max(20, Math.floor(track.scrollWidth / 60));
    track.style.animationDuration = duration + 's';
  }

  function initAllTickers(){
    document.querySelectorAll('.carousel-ticker .ticker-track').forEach(track=>initTicker(track));
  }

  // инициализируем сразу и после ресайза (debounced)
  let resizeTimeout;
  window.addEventListener('resize', ()=>{
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(()=>{
      // сбросим и пересоздадим
      document.querySelectorAll('.carousel-ticker .ticker-track').forEach(track=>{
        // восстановим оригинал и пересчитаем
        if (track.dataset.orig) track.innerHTML = track.dataset.orig;
      });
      initAllTickers();
    }, 120);
  });

  document.addEventListener('DOMContentLoaded', ()=>initAllTickers());
})();

// Cart counter helper: обновляет/создаёт элемент с классом .cart-count в header
async function updateCartCounter(){
  try{
    const token = localStorage.getItem('token');
    const sessionId = localStorage.getItem('session_id');
    let url = 'http://localhost:5000/api/cart/total';
    if (!token && sessionId) url += `?session_id=${encodeURIComponent(sessionId)}`;
    const headers = token ? {'Authorization': 'Bearer ' + token} : {};
    const res = await fetch(url, { headers });
    if (!res.ok) return;
    const data = await res.json();
    const totalItems = data.total_items || Math.round((data.total || 0) / 1); // fallback

    // find or create counter element (placed inside .header-cart)
    let el = document.querySelector('.header-actions .header-cart .cart-count') || document.querySelector('.header-actions .cart-count');
    if (!el){
      const headerActions = document.querySelector('.header-actions');
      if (!headerActions) return;
      el = document.createElement('span');
      el.className = 'cart-count badge bg-danger ms-2';
      el.style.display = 'none';
      // prefer placing inside header-cart
      const cartLink = headerActions.querySelector('.header-cart');
      if (cartLink) cartLink.appendChild(el); else headerActions.appendChild(el);
    }
    if (totalItems && totalItems > 0){
      el.textContent = totalItems;
      el.style.display = 'inline-block';
    } else {
      el.style.display = 'none';
    }

    // removed header total display per UX request
  }catch(err){ console.warn('updateCartCounter error', err); }
}

document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCounter();
  
  // Update auth buttons based on token
  const token = localStorage.getItem('token');
  const headerLogin = document.querySelector('.header-login');
  const headerProfile = document.querySelector('.header-profile');
  const headerRegister = document.querySelector('a[href="register.html"]');
  const headerCart = document.querySelector('.header-cart');
  
  if (token){
    if (headerLogin) headerLogin.style.display = 'none';
    if (headerRegister) headerRegister.style.display = 'none';
    if (headerProfile) headerProfile.style.display = 'inline-block';
    if (headerCart) headerCart.style.display = 'inline-flex';
  } else {
    if (headerLogin) headerLogin.style.display = 'inline-block';
    if (headerRegister) headerRegister.style.display = 'inline-block';
    if (headerProfile) headerProfile.style.display = 'none';
    if (headerCart) headerCart.style.display = 'inline-flex';
  }
});

// Render/update header avatar (reads from localStorage.user_avatar)
function renderHeaderAvatar(){
  const headerProfile = document.querySelector('.header-profile');
  if (!headerProfile) return;
  const avatar = localStorage.getItem('user_avatar');
  const svgFallback = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const online = localStorage.getItem('user_online') === '1';
  headerProfile.style.display = 'inline-flex';
  if (avatar){
    headerProfile.innerHTML = `
      <span class="header-avatar-wrapper" title="Профиль">
        <img src="${avatar}" class="header-avatar" alt="Профиль">
        ${online ? '<span class="avatar-status-dot"></span>' : ''}
      </span>`;
  } else {
    headerProfile.innerHTML = `
      <span class="header-avatar-wrapper" title="Профиль">${svgFallback}${online?'<span class="avatar-status-dot"></span>':''}</span>`;
  }
}
window.renderHeaderAvatar = renderHeaderAvatar;

// update avatar when changed in other tabs
window.addEventListener('storage', (ev)=>{
  if (ev.key === 'user_avatar') renderHeaderAvatar();
});

// call once on load (if DOMContentLoaded already fired earlier, ensure avatar is rendered)
if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(renderHeaderAvatar, 20);

// --- Admin tools (frontend) ----------------------------------
// Admin panel is hidden by default. To open: press Ctrl+Alt+A or click site logo 5 times quickly.
(function(){
  const ADMIN_KEY = 'is_admin'; // set localStorage.is_admin='1' for testing
  let logoClicks = 0; let logoTimer = null;

  function buildAdminUI(){
    if (document.getElementById('admin-tools-root')) return;
    const root = document.createElement('div');
    root.id = 'admin-tools-root';
    root.innerHTML = `
      <button id="admin-toggle-btn" title="Admin tools" style="position:fixed;right:18px;bottom:18px;z-index:4000;display:none;background:#222;color:#fff;border-radius:50%;width:56px;height:56px;border:none;box-shadow:0 6px 24px rgba(0,0,0,0.3)">ADM</button>
      <div class="modal fade" id="adminModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">Admin panel</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
            <div class="modal-body">
              <ul class="nav nav-tabs" id="adminTab" role="tablist">
                <li class="nav-item" role="presentation"><button class="nav-link active" id="tab-add" data-bs-toggle="tab" data-bs-target="#pane-add" type="button">Add product</button></li>
                <li class="nav-item" role="presentation"><button class="nav-link" id="tab-list" data-bs-toggle="tab" data-bs-target="#pane-list" type="button">Products</button></li>
              </ul>
              <div class="tab-content mt-3">
                <div class="tab-pane fade show active" id="pane-add">
                  <form id="admin-add-form">
                    <div class="mb-2"><input class="form-control" id="adm-name" placeholder="Name" required></div>
                    <div class="mb-2"><input class="form-control" id="adm-price" placeholder="Price" required type="number"></div>
                    <div class="mb-2"><input class="form-control" id="adm-short" placeholder="Short description"></div>
                    <div class="mb-2"><textarea class="form-control" id="adm-desc" placeholder="Full description"></textarea></div>
                    <div class="mb-2"><input class="form-control" id="adm-images" placeholder="Image URLs (comma separated)"></div>
                    <div class="mb-2"><input class="form-control" id="adm-category" placeholder="Category"></div>
                    <div><button class="btn btn-primary" id="adm-add-btn" type="submit">Create</button></div>
                  </form>
                </div>
                <div class="tab-pane fade" id="pane-list">
                  <div id="adm-list" style="max-height:50vh;overflow:auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    // wire button
    const toggle = document.getElementById('admin-toggle-btn');
    toggle.addEventListener('click', ()=>{
      const modal = document.getElementById('adminModal');
      const bs = new bootstrap.Modal(modal);
      bs.show();
      loadProductList();
    });

    // add form handler
    document.addEventListener('submit', async (ev)=>{
      if (ev.target && ev.target.id === 'admin-add-form'){
        ev.preventDefault();
        const name = document.getElementById('adm-name').value.trim();
        const price = parseFloat(document.getElementById('adm-price').value) || 0;
        const shortDesc = document.getElementById('adm-short').value.trim();
        const desc = document.getElementById('adm-desc').value.trim();
        const images = document.getElementById('adm-images').value.split(',').map(s=>s.trim()).filter(Boolean);
        const category = document.getElementById('adm-category').value.trim();
        const payload = { name, price, shortDesc, description: desc, images, category };
        try{
          const token = localStorage.getItem('token');
          const res = await fetch('http://localhost:5000/api/products', { method: 'POST', headers: Object.assign({'Content-Type':'application/json'}, token?{Authorization:'Bearer '+token}:{}) , body: JSON.stringify(payload)});
          const data = await res.json();
          alert(data.message || 'Created');
          loadProductList();
        }catch(err){ console.error(err); alert('Ошибка создания'); }
      }
    });
  }

  async function loadProductList(){
    const list = document.getElementById('adm-list'); if (!list) return;
    try{
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      list.innerHTML = data.map(p=>`<div style="padding:8px;border-bottom:1px solid #efefef"><strong>${p.name}</strong><div>${p.price} ₽</div></div>`).join('');
    }catch(e){ list.innerHTML = '<p>Error loading</p>'; }
  }

  // show/hide admin toggle depending on localStorage or secret trigger
  function revealAdmin(){
    buildAdminUI();
    const toggle = document.getElementById('admin-toggle-btn');
    if (toggle) toggle.style.display = 'inline-block';
  }

  // keyboard shortcut
  window.addEventListener('keydown', (ev)=>{
    if (ev.ctrlKey && ev.altKey && ev.key.toLowerCase() === 'a'){
      // only reveal if user flagged as admin in localStorage OR confirm
      if (localStorage.getItem(ADMIN_KEY) === '1' || confirm('Открыть панель админа?')) revealAdmin();
    }
  });

  // logo click 5 times
  const brandLogo = document.querySelector('.site-header .brand');
  if (brandLogo){
    brandLogo.addEventListener('click', ()=>{
      logoClicks++;
      if (logoTimer) clearTimeout(logoTimer);
      logoTimer = setTimeout(()=>{ logoClicks = 0; }, 1500);
      if (logoClicks >= 5){
        logoClicks = 0;
        if (localStorage.getItem(ADMIN_KEY) === '1' || confirm('Открыть панель админа?')) revealAdmin();
      }
    });
  }
})();



// Cart page script
document.addEventListener('DOMContentLoaded', async ()=>{
    const cartContainer = document.getElementById('cart-container');
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!cartContainer) return; // not on cart page

    class CartService { 
    constructor() {
        this.sessionId = localStorage.getItem('session_id');
        this.token = localStorage.getItem('token');
    }

    async getCart() {
        const url = this.token ? 'http://localhost:5000/api/cart' : `http://localhost:5000/api/cart?session_id=${this.sessionId}`;
        const headers = this.token ? { 'Authorization': 'Bearer ' + this.token } : {};
        const res = await fetch(url, { headers });
        return await res.json();
    }
    async addToCart(productId, quantity = 1) {
        const payload = { product_id: productId, quantity };
        if (!this.token) payload.session_id = this.sessionId;
        const headers = { 'Content-Type': 'application/json' };
        if (this.token) headers['Authorization'] = 'Bearer ' + this.token;
        const res = await fetch('http://localhost:5000/api/cart/add', { method: 'POST', headers, body: JSON.stringify(payload) });
        return res.json();
    }
    async removeFromCart(itemId) {
        await fetch(`http://localhost:5000/api/cart/remove/${itemId}`, { method: 'DELETE' });
        return this.getCart();
    }
    async updateQuantity(itemId, quantity) {
        const res = await fetch(`http://localhost:5000/api/cart/update/${itemId}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({quantity}) });
        return res.json();
    }
    }

    const service = new CartService();  
    async function renderCart(){
        const data = await service.getCart();
        const items = data.items || [];
        cartContainer.innerHTML = '';
        let total = 0;
        if (!items.length) {
            cartContainer.innerHTML = '<p>Корзина пуста</p>';
            checkoutBtn.disabled = true;
            return;
        }
        checkoutBtn.disabled = false;
        items.forEach(it=>{
            total += it.subtotal || 0;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${it.image||''}" alt="" style="width:80px">
                <div>
                  <h4>${it.name}</h4>
                  <div>${it.price} ₽</div>
                  <div class="cart-item-quantity">
                    <button class="btn-qty btn-minus" data-id="${it.id}" data-qty="${it.quantity}">-</button>
                    <span class="quantity">${it.quantity}</span>
                    <button class="btn-qty btn-plus" data-id="${it.id}" data-qty="${it.quantity}">+</button>
                    <button data-id="${it.id}" class="remove">Удалить</button>
                  </div>
                </div>`;
            cartContainer.appendChild(div);
        });
        const totalEl = document.getElementById('cart-total');
        if (totalEl){
            totalEl.textContent = 'Итого: ' + Math.round(total * 100) / 100 + ' ₽';
        }
    }

    cartContainer.addEventListener('click', async (e)=>{ 
        if (e.target.classList.contains('btn-qty')){
            const itemId = e.target.dataset.id;
            let qty = parseInt(e.target.dataset.qty);
            if (e.target.classList.contains('btn-plus')){
                qty += 1;
            } else if (e.target.classList.contains('btn-minus')){
                qty = Math.max(1, qty - 1);
            }
            await service.updateQuantity(itemId, qty);
            await renderCart();
            return;
        }
        if (e.target.classList.contains('remove')){
            const itemId = e.target.dataset.id;
            await service.removeFromCart(itemId);
            await renderCart();
            return;
        }
    });

    await renderCart();
});

// Modal Search — открывает поиск как модальное окно поверх страницы
class ModalSearchManager {
    constructor() {
        this.modal = null;
        this.filters = {
            query: '',
            category: [],
            minPrice: 0,
            maxPrice: 999999,
            color: [],
            sortBy: 'name'
        };
        this.results = [];
        this.allFilters = {};
        this.init();
    }

    init() {
        // Create modal HTML if not exists
        if (!document.getElementById('search-modal')) {
            this.createModal();
        }
        this.modal = document.getElementById('search-modal');
        
        // Bind events
        const trigger = document.getElementById('header-search-input');
        if (trigger) {
            trigger.addEventListener('focus', () => this.open());
        }
        
        const closeBtn = this.modal?.querySelector('.search-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        // Close on outside click
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        // Load filters
        this.loadFilters();
    }

    createModal() {
        const div = document.createElement('div');
        div.id = 'search-modal';
        div.className = 'search-modal';
        div.innerHTML = `
            <div class="search-modal-content">
                <div class="search-modal-header">
                    <h2>Поиск товаров</h2>
                    <button class="search-modal-close">&times;</button>
                </div>
                <div class="search-modal-body">
                    <div class="search-modal-filters">
                        <div class="filter-group">
                            <h4>Категория</h4>
                            <div id="modalCategoryFilters"></div>
                        </div>
                        <div class="filter-group">
                            <h4>Цена</h4>
                            <div class="price-range-inputs">
                                <input type="number" id="modalMinPrice" placeholder="От" min="0" step="100">
                                <span>-</span>
                                <input type="number" id="modalMaxPrice" placeholder="До" min="0" step="100">
                            </div>
                            <button class="btn btn-sm btn-outline-secondary w-100" onclick="modalSearchManager.applyPriceFilter()">Применить</button>
                        </div>
                    </div>
                    <div class="search-modal-results">
                        <div class="search-modal-sort">
                            <label for="modalSort">Сортировка:</label>
                            <select id="modalSort" onchange="modalSearchManager.filters.sortBy = this.value; modalSearchManager.performSearch();">
                                <option value="name">По названию</option>
                                <option value="price">По цене (возраст.)</option>
                                <option value="-price">По цене (убыв.)</option>
                                <option value="newest">Новинки</option>
                            </select>
                        </div>
                        <div class="search-modal-grid" id="modalSearchResults"></div>
                        <div class="no-results" id="modalNoResults" style="display:none;">Товары не найдены</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(div);
    }

    async loadFilters() {
        try {
            const res = await fetch('http://localhost:5000/api/products/filters');
            this.allFilters = await res.json();
            this.renderFilterUI();
        } catch (e) {
            console.error('Failed to load filters:', e);
        }
    }

    renderFilterUI() {
        const catDiv = document.getElementById('modalCategoryFilters');
        if (catDiv && this.allFilters.categories) {
            catDiv.innerHTML = this.allFilters.categories.map(cat => `
                <label class="filter-check">
                    <input type="checkbox" value="${cat}" onchange="modalSearchManager.updateFilters()">
                    ${cat}
                </label>
            `).join('');
        }

        const colorDiv = document.getElementById('modalColorFilters');
        if (colorDiv && this.allFilters.colors) {
            colorDiv.innerHTML = this.allFilters.colors.slice(0, 10).map((color, i) => `
                <label class="filter-check">
                    <input type="checkbox" value="${color}" onchange="modalSearchManager.updateFilters()">
                    ${color}
                </label>
            `).join('');
        }

        if (this.allFilters.min_price !== undefined) {
            document.getElementById('modalMinPrice').value = Math.round(this.allFilters.min_price);
            document.getElementById('modalMinPrice').min = Math.round(this.allFilters.min_price);
        }
        if (this.allFilters.max_price !== undefined) {
            document.getElementById('modalMaxPrice').value = Math.round(this.allFilters.max_price);
            document.getElementById('modalMaxPrice').max = Math.round(this.allFilters.max_price);
        }
    }

    updateFilters() {
        this.filters.category = Array.from(document.querySelectorAll('#modalCategoryFilters input:checked')).map(el => el.value);
        this.filters.color = Array.from(document.querySelectorAll('#modalColorFilters input:checked')).map(el => el.value);
        this.performSearch();
    }

    async performSearch() {
        const params = new URLSearchParams();
        if (this.filters.query) params.append('query', this.filters.query);
        if (this.filters.category.length) {
            this.filters.category.forEach(c => params.append('category', c));
        }
        if (this.filters.minPrice) params.append('min_price', this.filters.minPrice);
        if (this.filters.maxPrice < 999999) params.append('max_price', this.filters.maxPrice);
        if (this.filters.color.length) {
            this.filters.color.forEach(c => params.append('color', c));
        }
        params.append('sort_by', this.filters.sortBy);

        try {
            const res = await fetch(`http://localhost:5000/api/products/search?${params}`);
            const data = await res.json();
            this.results = data.results || [];
            this.renderResults();
        } catch (e) {
            console.error('Search failed:', e);
        }
    }

    renderResults() {
        const container = document.getElementById('modalSearchResults');
        const noResults = document.getElementById('modalNoResults');

        if (this.results.length === 0) {
            container.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        container.innerHTML = this.results.slice(0, 20).map(p => `
          <div class="search-modal-card">
            <a href="/product.html?id=${p.category}-${p.id}" class="search-modal-link">
              <img src="${p.images && p.images[0] ? p.images[0] : ''}" alt="${p.name}">
              <h5>${p.name}</h5>
            </a>
            <div class="price">${p.price} ₽</div>
            <button class="btn btn-primary btn-sm w-100 buy-btn" data-product-id="${p.id}" data-product-name="${p.name.replace(/'/g, "\\'")}" data-product-price="${p.price}" onclick="handleBuyButtonClick(this)">Купить</button>
          </div>
        `).join('');
        
        // Initialize buy buttons for cart items
        if (window.initBuyButtons) initBuyButtons();
    }



    applyPriceFilter() {
        this.filters.minPrice = parseFloat(document.getElementById('modalMinPrice').value) || 0;
        this.filters.maxPrice = parseFloat(document.getElementById('modalMaxPrice').value) || 999999;
        this.performSearch();
    }

    open(query = '') {
        this.filters.query = query;
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.performSearch();
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

let modalSearchManager;
document.addEventListener('DOMContentLoaded', () => {
    modalSearchManager = new ModalSearchManager();
});
