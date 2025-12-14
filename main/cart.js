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

// Render cart on cart.html
document.addEventListener('DOMContentLoaded', async ()=>{
    const service = new CartService();
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Exit if cart page elements don't exist
    if (!container || !totalEl || !checkoutBtn) return;
    async function render(){
        const data = await service.getCart();
        const items = data.items || [];
        container.innerHTML = '';
        let total = 0;
        if (!items.length) container.innerHTML = '<p>Корзина пуста</p>';
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
            container.appendChild(div);
        });
        totalEl.textContent = Math.round(total);
        if (window.updateCartCounter) updateCartCounter();
    }

    container.addEventListener('click', async (e)=>{
        const target = e.target;
        if (target.classList.contains('remove')){
            const id = target.getAttribute('data-id');
            await service.removeFromCart(id);
            await render();
            return;
        }
        if (target.classList.contains('btn-plus') || target.classList.contains('btn-minus')){
            const id = target.getAttribute('data-id');
            const qtySpan = target.parentNode.querySelector('.quantity');
            let qty = parseInt(qtySpan.textContent || '1');
            qty = target.classList.contains('btn-plus') ? qty + 1 : Math.max(1, qty - 1);
            // Update on server
            await service.updateQuantity(id, qty);
            await render();
            return;
        }
    });

    // Checkout
    if (checkoutBtn){
        const modal = document.getElementById('checkout-modal');
        const form = document.getElementById('checkout-form');
        const cancelBtn = document.getElementById('checkout-cancel');

        checkoutBtn.addEventListener('click', async ()=>{
            const token = localStorage.getItem('token');
            if (!token){ if (confirm('Для оформления заказа нужно войти. Перейти на страницу входа?')) window.location.href = '/login.html'; return; }
            // prefill fields
            document.getElementById('checkout-name').value = localStorage.getItem('username') || '';
            document.getElementById('checkout-phone').value = localStorage.getItem('phone') || '';
            document.getElementById('checkout-address').value = '';
            modal.style.display = 'flex';
        });

        cancelBtn.addEventListener('click', ()=>{ modal.style.display = 'none'; });

        form.addEventListener('submit', async (e)=>{
            e.preventDefault();
            const token = localStorage.getItem('token');
            if (!token){ alert('Неавторизован'); return; }
            const name = document.getElementById('checkout-name').value.trim();
            const phone = document.getElementById('checkout-phone').value.trim();
            const address = document.getElementById('checkout-address').value.trim();
            if (!name || !phone){ alert('Введите имя и телефон'); return; }
            try{
                const res = await fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ customer_name: name, customer_phone: phone, shipping_address: address })
                });
                const data = await res.json();
                if (!res.ok){ alert(data.error || 'Ошибка оформления заказа'); return; }
                modal.style.display = 'none';
                alert('Заказ оформлен. Номер: ' + (data.order_number || data.order_id));
                if (window.updateCartCounter) updateCartCounter();
                window.location.href = '/profile.html';
            }catch(err){ console.error(err); alert('Ошибка соединения'); }
        });
    }

    await render();
});
