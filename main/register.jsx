<>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Регистрация</title>
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
    <br />
    <div className="site-main container">
        <main className="site-content">
            <div className="page-content">
                <h2>Создать аккаунт</h2>
                <form className="contacts-form" action="#" method="post">
                    <div className="mb-3 row">
                        <label htmlFor="login" className="col-sm-3 col-form-label text-end">
                            Логин
                        </label>
                        <div className="col-sm-9">
                            <input
                                id="login"
                                name="login"
                                type="text"
                                className="form-control"
                                placeholder="Логин"
                                required=""
                            />
                        </div>
                    </div>
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
                                placeholder="Email@example.com"
                                required=""
                                oninvalid="this.setCustomValidity('Введите корректный email')"
                                oninput="this.setCustomValidity('')"
                            />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <div className="col-sm-9 offset-sm-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="agree"
                                    name="agree"
                                    required=""
                                    aria-required="true"
                                    oninvalid="this.setCustomValidity('Необходимо согласиться с пользовательским соглашением')"
                                    oninput="this.setCustomValidity('')"
                                />
                                <label className="form-check-label" htmlFor="agree">
                                    Я соглашаюсь с{" "}
                                    <a href="privacy-policy.html">Политикой конфиденциальности</a>
                                </label>
                                <div className="form-text text-muted">
                                    Чтобы завершить регистрацию, необходимо согласиться с
                                    условиями политики конфиденциальности.
                                </div>
                            </div>
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
                    <div className="mb-3 row">
                        <label
                            htmlFor="confirmPassword"
                            className="col-sm-3 col-form-label text-end"
                        >
                            Подтвердите пароль
                        </label>
                        <div className="col-sm-9">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                className="form-control"
                                placeholder="Подтвердите пароль"
                                required=""
                                oninput="this.setCustomValidity('')"
                            />
                        </div>
                    </div>
                    <div className="mb-3 text-center">
                        <button type="submit" className="btn btn-primary">
                            Зарегистрироваться
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
