<>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Обувь — Каталог</title>
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
                        placeholder="Поиск по обуви"
                        aria-label="Поиск по обуви"
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
    <div className="site-main container">
        <main className="site-content">
            <div className="page-content">
                <h1>Обувь</h1>
                <div className="catalog-grid" id="products-grid">
                    {/* Товары будут отображатся здесь */}
                </div>
            </div>
            <div className="mt-3 text-center">
                <button onclick="history.back()" className="btn btn-outline-secondary">
                    Вернуться
                </button>
            </div>
        </main>
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
