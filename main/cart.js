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
                    <img src="${it.image||''}" alt="${it.name}" class="cart-item-image">
                    <div class="cart-item-info">
                      <div class="cart-item-name">${it.name}</div>
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
                let qty = parseInt(qtyInput.value || '1');
                qty = btn.classList.contains('btn-plus') ? qty + 1 : Math.max(1, qty - 1);
                await service.updateQuantity(id, qty);
                await render();
            });
        });

        // Обработчик для изменения количества через input
        document.querySelectorAll('.quantity').forEach(input=>{
            input.addEventListener('change', async (e)=>{
                const id = input.getAttribute('data-id');
                let qty = parseInt(input.value || '1');
                qty = Math.max(1, qty);
                await service.updateQuantity(id, qty);
                await render();
            });
        });

        // Обработчик для удаления товара
        document.querySelectorAll('.cart-item-remove').forEach(btn=>{
            btn.addEventListener('click', async (e)=>{
                e.preventDefault();
                const id = btn.getAttribute('data-id');
                await service.removeFromCart(id);
                await render();
            });
        });
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
