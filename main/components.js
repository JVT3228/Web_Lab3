// // 1. Загрузка header
// function loadHeader() {
//     const headerHTML = `
// <header class="site-header" role="banner">
//     <div class="container"> 
//         <div class="brand"><a href="index.html"><img src="../img/logo.png" alt="Logo"></a></div>
        
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

// 3. Рендеринг карточки товара
function renderProductCard(product, category) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
        <a href="product.html?id=${product.id}&category=${category}">
            <img src="${product.cardImage}" class="product-photo" alt="${product.name}">
        </a>
        <h4 class="product-name">
            <a href="product.html?id=${product.id}&category=${category}">${product.name}</a>
        </h4>
        <div class="product-price">${product.price} ₽</div>
        <div class="card-actions">
            <button class="btn btn-primary">Купить</button>
            <a href="product.html?id=${product.id}&category=${category}" class="btn btn-outline-secondary ms-2">Подробнее</a>
        </div>
    `;
    return card;
}

// 4. Инициализация модального окна для карусели товара
function initProductLightbox() {
    document.querySelectorAll('.product-images .carousel').forEach(carousel => {
        const id = carousel.id;
        if (!id) return;
        const modalId = id + '-modal';
        const modalCarouselId = id + '-modal-carousel';
        
        const buildModal = () => {
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
            const closeBtn = modal.querySelector('.btn-close');
            if (closeBtn) {
                closeBtn.style.pointerEvents = 'auto';
            }
        };
        
        buildModal();
        carousel.querySelectorAll('.carousel-inner .carousel-item img').forEach((img, idx) => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                buildModal();
                const modalEl = document.getElementById(modalId);
                if (!modalEl) return;
                const bsModal = new bootstrap.Modal(modalEl);
                bsModal.show();
                const modalCarouselEl = modalEl.querySelector('.carousel');
                const inst = bootstrap.Carousel.getInstance(modalCarouselEl) || new bootstrap.Carousel(modalCarouselEl);
                inst.to(idx);
            });
        });
    });
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
