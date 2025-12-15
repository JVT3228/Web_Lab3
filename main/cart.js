class CartService {
    constructor() {
        this.sessionId = localStorage.getItem('session_id') || ('session_' + Date.now() + '_' + Math.random().toString(36).substr(2));
        if (!localStorage.getItem('session_id')) localStorage.setItem('session_id', this.sessionId);
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

// Global function to add product to cart from anywhere on the page
window.addToCart = async function(productId, productName, productPrice, quantity = 1) {
    const service = new CartService();
    try {
        await service.addToCart(productId, quantity);
        
        // Show notification modal
        const modal = document.getElementById('add-to-cart-modal');
        if (modal) {
            document.getElementById('product-name').textContent = productName;
            document.getElementById('product-price').textContent = productPrice + ' ₽';
            modal.classList.add('active');
            
            // Auto close after 3 seconds or manual close
            const closeBtn = document.getElementById('add-to-cart-close');
            const continueBtn = document.getElementById('continue-shopping');
            
            closeBtn.onclick = () => modal.classList.remove('active');
            continueBtn.onclick = () => modal.classList.remove('active');
            
            // Close on backdrop click
            modal.onclick = (e) => {
                if (e.target === modal) modal.classList.remove('active');
            };
        }
        
        // Update cart counter
        if (window.updateCartCounter) updateCartCounter();
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Ошибка при добавлении товара в корзину');
    }
};

// Render cart on cart.html
document.addEventListener('DOMContentLoaded', async ()=>{
    const service = new CartService();
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addToCartModal = document.getElementById('add-to-cart-modal');
    
    // Exit if cart page elements don't exist
    if (!container || !totalEl || !checkoutBtn) return;
    
    async function render(){
        const data = await service.getCart();
        const items = data.items || [];
        const container = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        const sidebar = document.querySelector('.cart-sidebar');
        
        container.innerHTML = '';
        let total = 0;
        
        if (!items.length) {
            emptyCart.style.display = 'block';
            sidebar.style.display = 'none';
        } else {
            emptyCart.style.display = 'none';
            sidebar.style.display = 'block';
            items.forEach(it=>{
                total += it.subtotal || 0;
                const div = document.createElement('div');
                div.className = 'cart-item';
                                div.innerHTML = `
                                        <a href="product.html?id=${it.product_id}" class="cart-item-link">
                                            <img src="${it.image||''}" alt="${it.name}" class="cart-item-image">
                                        </a>
                                        <div class="cart-item-info">
                                            <a href="product.html?id=${it.product_id}" class="cart-item-name">${it.name}</a>
                                            <div class="cart-item-price">${it.price} ₽</div>
                                        </div>
                                        <div class="cart-item-actions">
                                            <div class="cart-item-qty">
                                                <button class="btn-qty btn-minus" data-id="${it.id}">−</button>
                                                <input type="number" class="quantity" value="${it.quantity}" min="1" data-id="${it.id}">
                                                <button class="btn-qty btn-plus" data-id="${it.id}">+</button>
                                            </div>
                                            <button data-id="${it.id}" class="remove cart-item-remove">✕</button>
                                        </div>`;
                container.appendChild(div);
            });
            attachEventHandlers();
        }
        totalEl.textContent = Math.round(total) + ' ₽';
        if (window.updateCartCounter) updateCartCounter();
    }

    function attachEventHandlers(){
        // Обработчик для кнопок +/-
        document.querySelectorAll('.btn-qty').forEach(btn=>{
            btn.addEventListener('click', async (e)=>{
                e.preventDefault();
                const id = btn.getAttribute('data-id');
                const qtyInput = btn.parentNode.querySelector('.quantity');
                let qty = parseInt(qtyInput.value) + (btn.classList.contains('btn-plus') ? 1 : -1);
                if (qty < 1) qty = 1; // Минимально 1 для корзины (удаление через ✕)
                qtyInput.value = qty;
                await updateQty(id, qty);
            });
        });

        // Обработчик для input (debounced)
        let debounceTimer;
        document.querySelectorAll('.quantity').forEach(input=>{
            input.addEventListener('input', (e)=>{
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(async ()=>{
                    let qty = parseInt(e.target.value);
                    if (isNaN(qty) || qty < 1) qty = 1;
                    e.target.value = qty;
                    await updateQty(e.target.dataset.id, qty);
                }, 500);
            });
        });

        // Обработчик удаления
        document.querySelectorAll('.remove').forEach(btn=>{
            btn.addEventListener('click', async (e)=>{
                e.preventDefault();
                const id = btn.getAttribute('data-id');
                await service.removeFromCart(id);
                render();
            });
        });
    }

    async function updateQty(id, qty) {
        try {
            await service.updateQuantity(id, qty);
            render(); // Перерендерить корзину
        } catch (e) {
            console.error(e);
            alert('Ошибка обновления');
        }
    }

    // Checkout
    if (checkoutBtn){
        const modal = document.getElementById('checkout-modal');
        const form = document.getElementById('checkout-form');
        const closeBtn = document.getElementById('checkout-close');

        checkoutBtn.addEventListener('click', async ()=>{
            const token = localStorage.getItem('token');
            if (!token){ 
                if (confirm('Для оформления заказа нужно войти. Перейти на страницу входа?')) {
                    window.location.href = '/login.html';
                }
                return;
            }
            // prefill fields
            document.getElementById('checkout-name').value = localStorage.getItem('username') || '';
            document.getElementById('checkout-phone').value = localStorage.getItem('phone') || '';
            document.getElementById('checkout-address').value = '';
            document.getElementById('checkout-comment').value = '';
            modal.classList.add('active');
        });

        closeBtn.addEventListener('click', ()=>{ 
            modal.classList.remove('active'); 
        });

        // Close modal on backdrop click
        modal.addEventListener('click', (e)=>{
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        form.addEventListener('submit', async (e)=>{
            e.preventDefault();
            const token = localStorage.getItem('token');
            if (!token){ alert('Неавторизован'); return; }
            const name = document.getElementById('checkout-name').value.trim();
            const phone = document.getElementById('checkout-phone').value.trim();
            const address = document.getElementById('checkout-address').value.trim();
            const comment = document.getElementById('checkout-comment').value.trim();
            if (!name || !phone){ alert('Введите имя и телефон'); return; }
            try{
                const res = await fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ customer_name: name, customer_phone: phone, shipping_address: address, comment })
                });
                const data = await res.json();
                if (!res.ok){ alert(data.error || 'Ошибка оформления заказа'); return; }
                modal.classList.remove('active');
                alert('Заказ оформлен. Номер: ' + (data.order_number || data.order_id));
                if (window.updateCartCounter) updateCartCounter();
                window.location.href = '/profile.html';
            }catch(err){ console.error(err); alert('Ошибка соединения'); }
        });
    }

await render();
});

// Global function to handle buy button click
window.handleBuyButtonClick = async function(button) {
    const productId = button.dataset.productId;
    const productName = button.dataset.productName;
    const productPrice = button.dataset.productPrice;
    
    const service = new CartService();
    try {
        // Show loading state
        button.disabled = true;
        button.classList.add('loading');

        await service.addToCart(productId, 1);

        // Update and re-init
        if (window.updateCartCounter) updateCartCounter();
        if (window.initBuyButtons) await initBuyButtons();
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Ошибка при добавлении товара в корзину');
        button.disabled = false;
        button.classList.remove('loading');
    }
};

// Helper to attach input change with debounce
function attachInputHandler(input) {
    // No-op: input handling for `.qty` is performed via delegated listener
    // to survive DOM replacements in modal/search results.
    return;
}

// Global function to initialize buy buttons based on cart
window.initBuyButtons = async function() {
    const service = new CartService();
    try {
        const cart = await service.getCart();
        const items = cart.items || [];
        const itemMap = {};
        items.forEach(item => {
            itemMap[item.product_id] = { quantity: item.quantity, id: item.id };
        });
        
        // Find all buy buttons
        // Replace buy buttons with controls where needed
        const buyButtons = Array.from(document.querySelectorAll('.buy-btn'));
        buyButtons.forEach(button => {
            const productId = button.dataset.productId;
            if (itemMap[productId]) {
                const item = itemMap[productId];
                const controlsClass = button.classList.contains('buy-btn-lg') ? 'quantity-controls quantity-controls-lg' : 'quantity-controls';
                // Insert controls WITHOUT inline handlers — we'll use delegated listeners
                button.outerHTML = `
                    <div class="${controlsClass}" data-item-id="${item.id}" data-product-id="${productId}" data-product-name="${button.dataset.productName}" data-product-price="${button.dataset.productPrice}">
                        <button class="qty-btn" data-delta="-1">-</button>
                        <input type="number" class="qty" value="${item.quantity}" min="0">
                        <button class="qty-btn" data-delta="1">+</button>
                    </div>
                `;
            }
        });

        // Attach input handlers to all quantity inputs (newly created and existing)
        document.querySelectorAll('.quantity-controls .qty').forEach(input => attachInputHandler(input));
    } catch (error) {
        console.error('Error initializing buy buttons:', error);
    }
};

// Global function to change quantity from quantity controls
window.changeQuantity = async function(controlsOrButton, delta) {
    // Accept either the .quantity-controls div or a button/input within it
    let controls = controlsOrButton;
    if (controlsOrButton.closest) {
        controls = controlsOrButton.closest('.quantity-controls');
    }
    if (!controls) return;
    
    const itemId = controls.dataset.itemId;
    const productId = controls.dataset.productId;
    const productName = controls.dataset.productName;
    const productPrice = controls.dataset.productPrice;
    
    const service = new CartService();
    const qtyInput = controls.querySelector('.qty');
    let qty = parseInt(qtyInput.value, 10) + delta;

    // Validate: qty must be >= 0
    if (qty < 0) qty = 0;

    // Show loading state and disable controls during request
    controls.classList.add('loading');
    const controlsElements = controls.querySelectorAll('button, input');
    controlsElements.forEach(el => el.disabled = true);

    try {
        if (qty <= 0) {
            // Remove from cart
            await service.removeFromCart(itemId);
            // Replace with buy button (NO inline onclick — delegated handler will catch it)
            const btnClass = controls.classList.contains('quantity-controls-lg') ? 'btn btn-primary btn-lg buy-btn buy-btn-lg w-100' : 'btn btn-primary btn-sm w-100 buy-btn';
            controls.outerHTML = `<button class="${btnClass}" data-product-id="${productId}" data-product-name="${productName}" data-product-price="${productPrice}">Купить</button>`;
        } else {
            // Update quantity
            await service.updateQuantity(itemId, qty);
            // reflect new value in input
            const newInput = controls.querySelector('.qty');
            if (newInput) newInput.value = qty;
        }

        // Update cart counter
        if (window.updateCartCounter) updateCartCounter();
        
        // Re-init buy buttons to sync all instances
        if (window.initBuyButtons) await initBuyButtons();
        
        // If modal is open, re-render its results to keep in sync
        if (typeof modalSearchManager !== 'undefined' && modalSearchManager.modal && modalSearchManager.modal.style.display === 'flex') {
            try { 
                modalSearchManager.renderResults(); 
            } catch(e){ 
                console.warn('Modal re-render failed:', e); 
            }
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        alert('Ошибка при обновлении корзины');
    } finally {
        // Always remove loading state and re-enable controls
        if (controls && controls.classList) {
            controls.classList.remove('loading');
        }
        controlsElements.forEach(el => {
            if (el && el.disabled !== undefined) el.disabled = false;
        });
    }
};

document.addEventListener('click', function(e){
    // Handle quantity +/- buttons via delegation
    const qtyBtn = e.target.closest ? e.target.closest('.qty-btn') : null;
    if (qtyBtn) {
        e.preventDefault();
        const delta = parseInt(qtyBtn.dataset.delta, 10) || 0;
        try { changeQuantity(qtyBtn, delta); } catch(err){ console.error(err); }
        return;
    }

    // Handle buy buttons via delegation (NO inline onclick anymore - all through delegation)
    const btn = e.target.closest ? e.target.closest('.buy-btn') : null;
    if (btn) {
        e.preventDefault();
        if (typeof window.handleBuyButtonClick === 'function') {
            try { window.handleBuyButtonClick(btn); } catch(err){ console.error(err); }
        }
        return;
    }
});

// Debounce timers for delegated input handling
const _qtyInputTimers = new WeakMap();

// Delegated input handler for .qty with per-element debounce (works across DOM replacements)
document.addEventListener('input', function(e){
    const el = e.target;
    if (!el || !el.classList || !el.classList.contains('qty')) return;
    
    const controls = el.closest('.quantity-controls');
    if (!controls) return; // not inside a quantity-controls div
    
    // clear existing timer for this controls block
    const prev = _qtyInputTimers.get(controls);
    if (prev) clearTimeout(prev);
    
    const t = setTimeout(()=>{
        try { 
            // Call changeQuantity with the controls element, delta=0 means use the input value
            changeQuantity(controls, 0); 
        } catch(err){ console.error(err); }
        _qtyInputTimers.delete(controls);
    }, 500);
    _qtyInputTimers.set(controls, t);
});