<>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Контакты — Befree</title>
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
    <div className="site-main container">
        <main className="site-content">
            <div className="page-content">
                <h1>Контактная информация</h1>
                <section className="contact-top text-center">
                    <img
                        src="../img/Help.jpg"
                        className="img-fluid mx-auto d-block"
                        alt="Помощь"
                    />
                </section>
                <div className="row mt-3">
                    <div className="col-md-6">
                        <div className="contact-details">
                            <h3>
                                <strong>Служба поддержки</strong>
                            </h3>
                            <p>
                                8 (800) 250-01-02
                                <br />
                                Звонок бесплатный, ежедневно с 7:00 до 24:00 по МСК
                                <br />
                                Email: info@befree.ru
                            </p>
                            <h3>
                                <strong>Офис BEFREE</strong>
                            </h3>
                            <p>
                                190020, г. Санкт‑Петербург, 10-я Красноармейская, дом 22, литер
                                А, пом. 1-Н, 6 этаж
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="contact-details right">
                            <h3>
                                <strong>Реквизиты</strong>
                            </h3>
                            <p>
                                Акционерное общество «Мэлон Фэшн Груп»
                                <br />
                                Юридический адрес: 190020, г. Санкт-Петербург, 10-я
                                Красноармейская, дом 22, литер А, пом. 1-Н, 6 этаж
                                <br />
                                ИНН 7839326623, КПП 783450001
                            </p>
                        </div>
                    </div>
                </div>
                <div className="contacts-form mt-4">
                    <h2>Напишите нам</h2>
                    <form action="#" method="post" aria-label="Напишите нам">
                        <div className="mb-3 row">
                            <label
                                htmlFor="contact-name"
                                className="col-sm-3 col-form-label text-end"
                            >
                                Ваше имя
                            </label>
                            <div className="col-sm-9">
                                <input
                                    id="contact-name"
                                    className="form-control"
                                    type="text"
                                    name="name"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="contact-email"
                                className="col-sm-3 col-form-label text-end"
                            >
                                Электронная почта
                            </label>
                            <div className="col-sm-9">
                                <input
                                    id="contact-email"
                                    className="form-control"
                                    type="email"
                                    name="email"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="contact-phone"
                                className="col-sm-3 col-form-label text-end"
                            >
                                Номер телефона
                            </label>
                            <div className="col-sm-9">
                                <input
                                    id="contact-phone"
                                    className="form-control"
                                    type="tel"
                                    name="phone"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="contact-message"
                                className="col-sm-3 col-form-label text-end"
                            >
                                Ваш вопрос
                            </label>
                            <div className="col-sm-9">
                                <textarea
                                    id="contact-message"
                                    className="form-control"
                                    name="message"
                                    defaultValue={""}
                                />
                            </div>
                        </div>
                        <div className="mb-3 text-center">
                            <button type="submit" className="btn btn-primary">
                                Отправить
                            </button>
                        </div>
                    </form>
                </div>
                <h2 className="text-center mt-4">Наши магазины</h2>
                <div className="text-center">
                    <iframe
                        src="https://yandex.ru/map-widget/v1/?um=constructor%3A1961edb2b6fd1074bc7d26267c9bc9b0bb455f1b7f591655418d0fb62c8c7a57&source=constructor"
                        width="1725vw"
                        height="700vh"
                        frameBorder={0}
                        title="Где мы находимся"
                    />
                </div>
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
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Контакты — Befree</title>
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
    <div className="site-main container">
        <main className="site-content">
            <div className="page-content">
                <h1>Контактная информация</h1>
                <section className="contact-top text-center">
                    <img
                        src="../img/Help.jpg"
                        className="img-fluid mx-auto d-block"
                        alt="Помощь"
                    />
                </section>
                <div className="row mt-3">
                    <div className="col-md-6">
                        <div className="contact-details">
                            <h3>
                                <strong>Служба поддержки</strong>
                            </h3>
                            <p>
                                8 (800) 250-01-02
                                <br />
                                Звонок бесплатный, ежедневно с 7:00 до 24:00 по МСК
                                <br />
                                Email: info@befree.ru
                            </p>
                            <h3>
                                <strong>Офис BEFREE</strong>
                            </h3>
                            <p>
                                190020, г. Санкт‑Петербург, 10-я Красноармейская, дом 22, литер
                                А, пом. 1-Н, 6 этаж
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="contact-details right">
                            <h3>
                                <strong>Реквизиты</strong>
                            </h3>
                            <p>
                                Акционерное общество «Мэлон Фэшн Груп»
                                <br />
                                Юридический адрес: 190020, г. Санкт-Петербург, 10-я
                                Красноармейская, дом 22, литер А, пом. 1-Н, 6 этаж
                                <br />
                                ИНН 7839326623, КПП 783450001
                            </p>
                        </div>
                    </div>
                </div>
                <div className="contacts-form mt-4">
                    <h2>Напишите нам</h2>
                    <form action="#" method="post" aria-label="Напишите нам">
                        <div className="mb-3 row">
                            <label
                                htmlFor="contact-name"
                                className="col-sm-3 col-form-label text-end"
                            >
                                Ваше имя
                            </label>
                            <div className="col-sm-9">
                                <input
                                    id="contact-name"
                                    className="form-control"
                                    type="text"
                                    name="name"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="contact-email"
                                className="col-sm-3 col-form-label text-end"
                            >
                                Электронная почта
                            </label>
                            <div className="col-sm-9">
                                <input
                                    id="contact-email"
                                    className="form-control"
                                    type="email"
                                    name="email"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="contact-phone"
                                className="col-sm-3 col-form-label text-end"
                            >
                                Номер телефона
                            </label>
                            <div className="col-sm-9">
                                <input
                                    id="contact-phone"
                                    className="form-control"
                                    type="tel"
                                    name="phone"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="contact-message"
                                className="col-sm-3 col-form-label text-end"
                            >
                                Ваш вопрос
                            </label>
                            <div className="col-sm-9">
                                <textarea
                                    id="contact-message"
                                    className="form-control"
                                    name="message"
                                    defaultValue={""}
                                />
                            </div>
                        </div>
                        <div className="mb-3 text-center">
                            <button type="submit" className="btn btn-primary">
                                Отправить
                            </button>
                        </div>
                    </form>
                </div>
                <h2 className="text-center mt-4">Наши магазины</h2>
                <div className="text-center">
                    <iframe
                        src="https://yandex.ru/map-widget/v1/?um=constructor%3A1961edb2b6fd1074bc7d26267c9bc9b0bb455f1b7f591655418d0fb62c8c7a57&source=constructor"
                        width="1725vw"
                        height="700vh"
                        frameBorder={0}
                        title="Где мы находимся"
                    />
                </div>
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
