<>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Вход</title>
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
    {/* navigation moved into header */}
    <br />
    <div className="site-main container">
        <main className="site-content">
            <div className="page-content">
                <h2>Вход в аккаунт</h2>
                <form className="contacts-form" action="#" method="post">
                    <div className="mb-3 row">
                        <label htmlFor="phone" className="col-sm-3 col-form-label text-end">
                            Телефон
                        </label>
                        <div className="col-sm-9">
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                className="form-control"
                                placeholder="Телефон"
                                required=""
                                pattern="[+0-9\- ()]{7,}"
                                oninvalid="this.setCustomValidity('Введите корректный номер телефона')"
                                oninput="this.setCustomValidity('')"
                            />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="email" className="col-sm-3 col-form-label text-end">
                            Email
                        </label>
                        <div className="col-sm-9">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="form-control"
                                placeholder="email@example.com"
                                required=""
                                oninvalid="this.setCustomValidity('Введите корректный email')"
                                oninput="this.setCustomValidity('')"
                            />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label
                            htmlFor="password"
                            className="col-sm-3 col-form-label text-end"
                        >
                            Пароль
                        </label>
                        <div className="col-sm-9">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="form-control"
                                placeholder="Пароль"
                                required=""
                                oninvalid="this.setCustomValidity('Введите пароль')"
                                oninput="this.setCustomValidity('')"
                            />
                        </div>
                    </div>
                    <div className="mb-3 text-center">
                        <button type="submit" className="btn btn-primary">
                            Войти
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>
    <footer className="site-footer">
        <div className="container">
            <div className="footer-inner">
                <h3>
                    <a href="privacy-policy.html">© Все права защищены</a>
                </h3>
            </div>
        </div>
    </footer>
</>
