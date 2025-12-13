<>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Каталог</title>
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
    />
    <link rel="stylesheet" href="style.css" />
    <link rel="preload" href="../img/human1.png" as="image" />
    <link rel="preload" href="../img/human2.png" as="image" />
    <header className="site-header" role="banner">
        <div className="container">
            <div className="brand">
                <a href="index.html">
                    <img src="../img/logo.png" alt="Logo" />
                </a>
            </div>
            <form
                className="header-search"
                action=""
                method="get"
                role="search"
                aria-label="Поиск"
            >
                <div className="input-group">
                    <input
                        className="form-control header-input"
                        name="q"
                        type="search"
                        placeholder="Поиск по разделам"
                        aria-label="Поиск по разделам"
                    />
                    <button
                        className="btn btn-light header-search-btn"
                        type="submit"
                        aria-label="Поиск"
                    >
                        <svg
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                                stroke="#333"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </form>
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
    <div className="hero-slider container">
        <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="../img/human1.png" className="d-block w-100" alt="human1" />
                </div>
                <div className="carousel-item">
                    <img src="../img/human2.png" className="d-block w-100" alt="human2" />
                </div>
            </div>
            <div className="carousel-indicators">
                <button
                    type="button"
                    data-bs-target="#heroCarousel"
                    data-bs-slide-to={0}
                    className="active"
                    aria-current="true"
                    aria-label="Слайд"
                />
                <button
                    type="button"
                    data-bs-target="#heroCarousel"
                    data-bs-slide-to={1}
                    aria-label="Слайд"
                />
            </div>
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="visually-hidden">Назад</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="visually-hidden">Вперёд</span>
            </button>
            <div
                className="carousel-ticker"
                aria-hidden="false"
                role="region"
                aria-label="Бегущая строка"
            >
                <div className="ticker-inner" aria-hidden="false">
                    <div className="ticker-track">
                        <div className="ticker-marquee" aria-hidden="true">
                            <span>• Бесплатная доставка от 2000₽ | До 2000₽ всего 159₽</span>
                            <span>• Выгодные цены</span>
                            <span>• Новые поступления каждую неделю</span>
                            <span>• Классные футболки с новогодним котом и не только</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="catalog-hero container">
        <a
            href="clothing.html"
            className="cat-card"
            aria-label="Одежда - перейти к разделу Одежда"
        >
            <img
                src="../card-img/longsliv11.jpg"
                alt="Одежда"
                className="cat-image"
            />
            <div className="cat-label">Одежда</div>
        </a>
        <a
            href="footwear.html"
            className="cat-card"
            aria-label="Обувь - перейти к разделу Обувь"
        >
            <img src="../card-img/kedi11.jpg" alt="Обувь" className="cat-image" />
            <div className="cat-label">Обувь</div>
        </a>
        <a
            href="accessories.html"
            className="cat-card"
            aria-label="Аксессуары - перейти к разделу Аксессуары"
        >
            <img
                src="../card-img/sumka11.jpg"
                alt="Аксессуары"
                className="cat-image"
            />
            <div className="cat-label">Аксессуары</div>
        </a>
    </div>
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
</>
