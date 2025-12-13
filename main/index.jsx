<>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Магазин одежды и обуви — Befree</title>
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
    />
    <link rel="stylesheet" href="style.css" />
    <header className="site-header" role="banner">
        <div className="container">
            <div className="brand">
                <a href="index.html">
                    <img src="../img/logo.png" alt="Logo" />
                </a>
            </div>
            <nav className="site-nav" role="navigation" aria-label="Основное меню">
                <ul className="nav-menu">
                    <li>
                        <a href="index.html">Главная</a>
                    </li>
                    <li>
                        <a href="catalog.html">Каталог</a>
                    </li>
                    <li>
                        <a href="about.html">О нас</a>
                    </li>
                    <li>
                        <a href="contacts.html">Контакты</a>
                    </li>
                </ul>
            </nav>
            <div className="header-actions">
                <a
                    href="login.html"
                    className="header-login btn btn-outline-primary btn-sm"
                >
                    Вход
                </a>
                <a href="register.html" className="btn btn-primary btn-sm ms-1">
                    Регистрация
                </a>
            </div>
        </div>
    </header>
    <main className="site-main">
        <div className="hero-slider container">
            <div
                id="heroCarouselIndex"
                className="carousel slide"
                data-bs-ride="carousel"
                data-bs-interval={5000}
            >
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img
                            src="../img/befree_cash_register_desktop.jpg"
                            alt="Befree магазин"
                        />
                    </div>
                    <div className="carousel-item">
                        <img src="../img/befree_enter_desktop.jpg" alt="Befree магазин" />
                    </div>
                    <div className="carousel-item">
                        <img src="../img/meme1.png" alt="Befree мода" />
                    </div>
                    <div className="carousel-item">
                        <img src="../img/meme2.png" alt="Befree мода" />
                    </div>
                </div>
                <div className="carousel-indicators">
                    <button
                        type="button"
                        data-bs-target="#heroCarouselIndex"
                        data-bs-slide-to={0}
                        className="active"
                        aria-current="true"
                        aria-label="Слайд 1"
                    />
                    <button
                        type="button"
                        data-bs-target="#heroCarouselIndex"
                        data-bs-slide-to={1}
                        aria-label="Слайд 2"
                    />
                    <button
                        type="button"
                        data-bs-target="#heroCarouselIndex"
                        data-bs-slide-to={2}
                        aria-label="Слайд 3"
                    />
                    <button
                        type="button"
                        data-bs-target="#heroCarouselIndex"
                        data-bs-slide-to={3}
                        aria-label="Слайд 4"
                    />
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#heroCarouselIndex"
                    data-bs-slide="prev"
                    aria-label="Предыдущий слайд"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#heroCarouselIndex"
                    data-bs-slide="next"
                    aria-label="Следующий слайд"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                </button>
            </div>
        </div>
        <main className="site-main index-main">
            <div className="container">
                <section className="index-intro">
                    <div className="intro-text">
                        <h1>Befree</h1>
                        <p>Собери образ, который расскажет твою историю лучше слов</p>
                    </div>
                </section>
                <section className="index-features">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🏷️</div>
                            <h3>Доступная цена</h3>
                            <p>Без снижения качества</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔥</div>
                            <h3>Новые тренды</h3>
                            <p>Актуальные коллекции каждый месяц</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">✨</div>
                            <h3>Экспрессия</h3>
                            <p>Выражай себя смело</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🌱</div>
                            <h3>Экодружелюбно</h3>
                            <p>Заботимся о планете</p>
                        </div>
                    </div>
                </section>
                <section className="index-values">
                    <h2>Почему выбирают нас</h2>
                    <div className="values-index-grid">
                        <div className="value-index-card">
                            <div className="value-number">1</div>
                            <h4>Доступность</h4>
                            <p>Качество без переплаты</p>
                        </div>
                        <div className="value-index-card">
                            <div className="value-number">2</div>
                            <h4>Выбор</h4>
                            <p>От базовых до экстравагантных вещей</p>
                        </div>
                        <div className="value-index-card">
                            <div className="value-number">3</div>
                            <h4>Удобство</h4>
                            <p>Магазины и онлайн рядом с тобой</p>
                        </div>
                    </div>
                </section>
                <section className="index-cta">
                    <h2>Твой идеальный стиль ждёт</h2>
                    <p>Найди вещи, которые расскажут о тебе</p>
                    <a href="catalog.html" className="btn btn-primary btn-lg">
                        Начать поиск
                    </a>
                </section>
            </div>
        </main>
        <footer className="site-footer" role="contentinfo">
            <div className="container">
                <div className="footer-inner">
                    <h3>
                        <a href="privacy-policy.html">© Все права защищены</a>
                    </h3>
                    <a href="#top">Вернуться наверх</a>
                </div>
            </div>
        </footer>
    </main>
</>
