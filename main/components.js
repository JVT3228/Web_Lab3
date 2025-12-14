// // 1. Загрузка header
// function loadHeader() {
//     const headerHTML = `
// <header class="site-header" role="banner">
//     <div class="container"> 
//         <div class="brand"><a href="index.html"><img src="http://localhost:5000/images/static/img/logo.png" alt="Logo"></a></div>
        
//         <nav class="site-nav" role="navigation" aria-label="Основное меню">
//             <ul class="nav-menu">
//                 <li><a href="index.html">Главная</a></li>
//                 <li><a href="catalog.html">Каталог</a></li>
//                 <li><a href="about.html">О нас</a></li>
//                 <li><a href="contacts.html">Контакты</a></li>
//             </ul>
//         </nav>

//         <div class="header-actions">
//             <a href="login.html" class="header-login btn btn-outline-primary btn-sm">Вход</a>
//             <a href="register.html" class="btn btn-primary btn-sm ms-1">Регистрация</a>
//         </div>
//     </div>
// </header>`;
    
//     const headerElement = document.querySelector('header.site-header');
//     if (headerElement) {
//         headerElement.outerHTML = headerHTML;
//     }
// }

// // 2. Загрузка footer
// function loadFooter() {
//     const footerHTML = `
// <footer class="site-footer" role="contentinfo">
//     <div class="container">
//         <div class="footer-inner">
//             <h3><a href="privacy-policy.html">© Все права защищены</a></h3>
//         </div>
//     </div>
// </footer>`;
    
//     const footerElement = document.querySelector('footer.site-footer');
//     if (footerElement) {
//         footerElement.outerHTML = footerHTML;
//     }
// }

// Add to cart function
function addToCart(productId, productName, price) {
    const token = localStorage.getItem('token');
    if (!token) {
        if (confirm('Для добавления в корзину нужно войти. Перейти на страницу входа?')) {
            window.location.href = '/login.html';
        }
        return;
    }
    const qty = prompt('Введите количество:', '1');
    if (!qty || parseInt(qty) <= 0) return;
    fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ product_id: productId, quantity: parseInt(qty) })
    }).then(r => r.json()).then(d => {
        alert('Товар добавлен в корзину');
        if (window.updateCartCounter) updateCartCounter();
    }).catch(e => { console.error(e); alert('Ошибка'); });
}

// 3. Рендеринг карточки товара
function renderProductCard(product, category) {
    const card = document.createElement('article');
    card.className = 'product-card';
    const productId = product.id;
    
    // Обработка картинок: если из JSON это массив, берём первую
    let imageUrl = '';
    if (typeof product.images === 'string') {
        try {
            const images = JSON.parse(product.images);
            imageUrl = images[0] || '';
        } catch (e) {
            imageUrl = product.images;
        }
    } else if (Array.isArray(product.images)) {
        imageUrl = product.images[0] || '';
    }
    imageUrl = imageUrl || product.cardImage || '';
    
    card.innerHTML = `
        <a href="product.html?id=${productId}">
            <img src="${imageUrl}" class="product-photo" alt="${product.name}">
        </a>
        <h4 class="product-name">
            <a href="product.html?id=${productId}">${product.name}</a>
        </h4>
        <div class="product-price">${product.price} ₽</div>
        <div class="card-actions">
            <button class="btn btn-primary" onclick="addToCart(${productId}, '${product.name.replace(/'/g, "\\'")}', ${product.price})">Купить</button>
            <a href="product.html?id=${productId}" class="btn btn-outline-secondary ms-2">Подробнее</a>
        </div>
    `;
    return card;
}

// 4. Инициализация модального окна для карусели товара
function initProductLightbox() {
    // Find carousels inside .product-images or anywhere inside page-content (covers product.html)
    const selectors = Array.from(new Set(['.product-images .carousel', '.page-content .carousel']));
    const carousels = [];
    selectors.forEach(sel => document.querySelectorAll(sel).forEach(c => carousels.push(c)));
    console.debug('initProductLightbox: found selectors', selectors, 'carouselsCount=', carousels.length);

    carousels.forEach(carousel => {
        if (!carousel) return;
        // ensure carousel has an id
        let id = carousel.id;
        if (!id) {
            id = 'carousel-' + Math.random().toString(36).slice(2, 9);
            carousel.id = id;
        }
        const modalId = id + '-modal';
        const modalCarouselId = id + '-modal-carousel';

        const buildModal = () => {
            console.debug('buildModal for', id);
            if (document.getElementById(modalId)) return;
            const slides = Array.from(carousel.querySelectorAll('.carousel-inner .carousel-item img'));
            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = modalId;
            modal.tabIndex = -1;
            modal.innerHTML = `
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content bg-transparent border-0">
                        <div class="modal-body p-0">
                            <div id="${modalCarouselId}" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-inner">
                                    ${slides.map((img, idx) => `<div class="carousel-item ${idx === 0 ? 'active' : ''}"><img src="${img.src}" class="d-block w-100" alt="${img.alt || ''}"></div>`).join('')}
                                </div>
                                <button class="carousel-control-prev" type="button" data-bs-target="#${modalCarouselId}" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Назад</span></button>
                                <button class="carousel-control-next" type="button" data-bs-target="#${modalCarouselId}" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Вперёд</span></button>
                                <button type="button" class="btn-close position-absolute p-2" data-bs-dismiss="modal" aria-label="Закрыть" style="right:1rem;top:1rem;z-index:3000;pointer-events:auto"></button>
                            </div>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
            // Удалять модальное окно и backdrop после скрытия, чтобы не оставались следы
            try {
                // слушаем событие скрытия модального окна
                modal.addEventListener('hidden.bs.modal', function onHidden() {
                    try {
                        const inst = bootstrap.Modal.getInstance(modal);
                        if (inst && typeof inst.dispose === 'function') inst.dispose();
                    } catch (e) { /* ignore */ }
                    // убираем сам элемент модального окна
                    if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
                    // удаляем backdrop, если он остался
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
                });
            } catch (e) { console.warn('Attach hidden handler failed', e); }
            const closeBtn = modal.querySelector('.btn-close');
            if (closeBtn) closeBtn.style.pointerEvents = 'auto';
        };

        buildModal();

        const imgs = carousel.querySelectorAll('.carousel-inner .carousel-item img');
        imgs.forEach((img, idx) => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                console.debug('lightbox click', {id, idx, src: img.src});
                buildModal();
                const modalEl = document.getElementById(modalId);
                if (!modalEl) return;
                try {
                    const bsModal = new bootstrap.Modal(modalEl);
                    bsModal.show();
                    // guard: ensure modal element will be removed/ disposed when closed
                    if (!modalEl._cleanupAttached) {
                        modalEl.addEventListener('hidden.bs.modal', () => {
                            try { bsModal.dispose(); } catch (e) { /* ignore */ }
                            try { modalEl.remove(); } catch (e) { /* ignore */ }
                            const bd = document.querySelector('.modal-backdrop');
                            if (bd) bd.remove();
                        });
                        modalEl._cleanupAttached = true;
                    }
                    setTimeout(() => {
                        try {
                            const modalCarouselEl = modalEl.querySelector('#' + modalCarouselId);
                            const inst = bootstrap.Carousel.getInstance(modalCarouselEl) || new bootstrap.Carousel(modalCarouselEl);
                            inst.to(idx);
                        } catch (err) {
                            console.warn('Carousel init failed in modal:', err);
                        }
                    }, 60);
                } catch (err) {
                    console.warn('Bootstrap modal failed, falling back to fallback gallery:', err);
                    showFallbackGallery(Array.from(carousel.querySelectorAll('.carousel-inner .carousel-item img')).map(i=>i.src), idx);
                }
            });
        });
    });

        // Also attach to single product-photo images (for pages where carousel not used)
        document.querySelectorAll('.product-photo').forEach((img)=>{
            if (img.dataset.lightboxAttached) return;
            img.dataset.lightboxAttached = '1';
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', ()=>{
                const src = img.src;
                try {
                        const anyModal = document.querySelector('.modal');
                        if (anyModal && typeof bootstrap !== 'undefined'){
                            const bsModal = new bootstrap.Modal(anyModal);
                            bsModal.show();
                            // ensure cleanup for this modal as well
                            if (!anyModal._cleanupAttached) {
                                anyModal.addEventListener('hidden.bs.modal', ()=>{
                                    try { bsModal.dispose(); } catch(e){}
                                    try { anyModal.remove(); } catch(e){}
                                    const bd = document.querySelector('.modal-backdrop'); if (bd) bd.remove();
                                });
                                anyModal._cleanupAttached = true;
                            }
                            const imgs = Array.from(anyModal.querySelectorAll('.carousel-inner .carousel-item img'));
                            const idx = imgs.findIndex(i=>i.src===src);
                            if (idx>=0){
                                const modalCarouselEl = anyModal.querySelector('.carousel');
                                const inst = bootstrap.Carousel.getInstance(modalCarouselEl) || new bootstrap.Carousel(modalCarouselEl);
                                setTimeout(()=>inst.to(idx),50);
                                return;
                            }
                        }
                } catch(e){ console.warn(e); }
                showFallbackGallery([src], 0);
            });
        });
}

    // Fallback gallery overlay (no Bootstrap required)
    function showFallbackGallery(srcList, startIndex){
        const existing = document.getElementById('fallback-lightbox');
        if (existing) existing.remove();
        const overlay = document.createElement('div');
        overlay.id = 'fallback-lightbox';
        overlay.style.position = 'fixed';
        overlay.style.left = 0; overlay.style.top = 0; overlay.style.right = 0; overlay.style.bottom = 0;
        overlay.style.background = 'rgba(0,0,0,0.95)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = 4000;
        overlay.innerHTML = `
            <button id="fb-close" style="position:absolute;right:12px;top:12px;z-index:4010;background:rgba(255,255,255,0.9);border:none;padding:8px;border-radius:6px;cursor:pointer">✕</button>
            <button id="fb-prev" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);z-index:4010;background:transparent;border:none;color:white;font-size:32px;">‹</button>
            <img id="fb-img" src="" style="max-width:95%;max-height:90%;object-fit:contain;border-radius:6px;box-shadow:0 4px 20px rgba(0,0,0,0.5)" />
            <button id="fb-next" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);z-index:4010;background:transparent;border:none;color:white;font-size:32px;">›</button>
        `;
        document.body.appendChild(overlay);
        const imgEl = overlay.querySelector('#fb-img');
        let idx = startIndex || 0;
        function update(){ imgEl.src = srcList[idx]; }
        overlay.querySelector('#fb-close').addEventListener('click', ()=>overlay.remove());
        overlay.querySelector('#fb-prev').addEventListener('click', ()=>{ idx = (idx-1+srcList.length)%srcList.length; update(); });
        overlay.querySelector('#fb-next').addEventListener('click', ()=>{ idx = (idx+1)%srcList.length; update(); });
        overlay.addEventListener('click', (e)=>{ if (e.target===overlay) overlay.remove(); });
        update();
    }

// 5. Рендеринг страницы товара
function renderProductPage(product) {
    if (!product) return;
    
    const containerHTML = `
        <div class="product-detail">
            <h1 class="product-title">${product.name}</h1>
            <div class="row">
                <div class="col-lg-6 product-images">
                    <div id="product-carousel" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            ${product.images.map((img, idx) => 
                                `<div class="carousel-item ${idx === 0 ? 'active' : ''}">
                                    <img src="${img}" class="d-block w-100 product-photo" alt="${idx + 1}">
                                </div>`
                            ).join('')}
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#product-carousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Назад</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#product-carousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Вперёд</span>
                        </button>
                    </div>
                </div>
                <div class="col-lg-6">
                    <p class="short-desc">${product.shortDesc}</p>
                    <h3 class="section-title">Характеристики</h3>
                    <ul class="characteristics-list">
                        ${product.characteristics.map(char => `<li>${char}</li>`).join('')}
                    </ul>
                    <div class="product-price">${product.price} ₽</div>
                    <div class="mt-3">
                        <button class="btn btn-outline-secondary" onclick="history.back()">Вернуться</button>
                        <button class="btn btn-primary ms-3">Оформить заказ</button>
                        <button class="btn btn-link ms-3" data-bs-toggle="collapse" data-bs-target="#extraDetails" aria-expanded="false" aria-controls="extraDetails">Подробнее</button>
                    </div>
                        <div class="collapse product-extra-details mt-3" id="extraDetails">
                            <div class="card card-body">
                                <p>${product.description}</p>
                            </div>
                        </div>
                        <div id="reviews-container" class="mt-4"></div>
                </div>
            </div>
        </div>
    `;
    
    const pageContent = document.querySelector('.page-content');
    if (pageContent) {
        pageContent.innerHTML = containerHTML;
    }
    
    // Инициализируем модальное окно карусели с задержкой, чтобы DOM обновился
    setTimeout(() => {
        initProductLightbox();
    }, 0);
}

// Загрузить товары по категории с API (для category pages)
async function getProductsByCategory(category) {
    try {
        const response = await fetch(`http://localhost:5000/api/products/category/${category}`);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(`Error loading products for category ${category}:`, error);
        return [];
    }
}

// Получить все товары с API (для каталога)
async function getAllProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error loading all products:', error);
        return [];
    }
}

// 6. Функция для получения параметров из URL
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        category: params.get('category')
    };
}

// // 7. Инициализация при загрузке страницы
// document.addEventListener('DOMContentLoaded', () => {
//     loadHeader();
//     loadFooter();
// });
