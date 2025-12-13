<>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>О нас — Befree</title>
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
    />
    <link rel="stylesheet" href="style.css" />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />
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
            <div className="page-content about-page">
                <div className="about-hero-section">
                    <div className="hero-image">
                        <img
                            src="../img/company_picture_desktop.jpg"
                            alt="О бренде Befree"
                        />
                    </div>
                    <div
                        className="carousel-ticker"
                        aria-hidden="false"
                        role="region"
                        aria-label="Бегущая строка"
                    >
                        <div className="ticker-inner" aria-hidden="false">
                            <div className="ticker-track">
                                <div className="ticker-marquee" aria-hidden="true">
                                    <span>• всегда модно быть свободным</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="about-section about-brand-section">
                    <h2>О БРЕНДЕ</h2>
                    <p>
                        Befree — бренд для всех, кто любит молодежную моду, независимо от
                        возраста. Инклюзивность, свобода самовыражения, красота и
                        уникальность каждого — вот ценности, которые нам близки.
                    </p>
                </div>
                <div className="stats-section">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">268</div>
                            <div className="stat-label">магазинов</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">5</div>
                            <div className="stat-label">маркетплейсов</div>
                        </div>
                        <div className="stat-image">
                            <img src="../img/about_brand_site_1.jpg" alt="" />
                        </div>
                        <div className="stat-image">
                            <img src="../img/about_brand_site_2.jpg" alt="" />
                        </div>
                        <div className="stat-image">
                            <img src="../img/about_brand_site_3.jpg" alt="" />
                        </div>
                        <div className="stat-image">
                            <img src="../img/about_brand_site_4.jpg" alt="" />
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">83</div>
                            <div className="stat-label">города</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">2002</div>
                            <div className="stat-label">год основания</div>
                        </div>
                    </div>
                </div>
                <div className="about-section about-philosophy-section">
                    <h2>ФИЛОСОФИЯ</h2>
                    <p>
                        Befree берет на себя ответственность дать покупателям все самое
                        новое и популярное, что есть в мировой мэйнстрим моде, привлекая к
                        этому творческое комьюнити России.
                    </p>
                </div>
                <div className="values-section">
                    <h2>НАШИ ЦЕННОСТИ</h2>
                    <div className="values-grid">
                        <div className="value-item">
                            <img src="../img/humanity_desk.jpg" alt="Человечность" />
                            <span>ЧЕЛОВЕЧНОСТЬ</span>
                        </div>
                        <div className="value-item">
                            <img src="../img/freedom_desk.jpg" alt="Свобода" />
                            <span>СВОБОДА</span>
                        </div>
                        <div className="value-item">
                            <img src="../img/innovation_desk.jpg" alt="Интеллект" />
                            <span>ИНТЕЛЛЕКТ И ИННОВАТИВНОСТЬ</span>
                        </div>
                        <div className="value-item">
                            <img src="../img/creativity_desk.jpg" alt="Креативность" />
                            <span>КРЕАТИВНОСТЬ</span>
                        </div>
                        <div className="value-item">
                            <img src="../img/sustainability_desk.jpg" alt="Будущее" />
                            <span>ОРИЕНТАЦИЯ НА БУДУЩЕЕ</span>
                        </div>
                    </div>
                </div>
                <div className="community-section">
                    <img
                        src="../img/community_desk_1.jpg"
                        alt=""
                        className="community-img-1"
                    />
                    <img
                        src="../img/community_desk_2.jpg"
                        alt=""
                        className="community-img-2"
                    />
                    <img
                        src="../img/community_desk_3.jpg"
                        alt=""
                        className="community-img-3"
                    />
                    <div className="community-content">
                        <h3>#BEFREECOMMUNITY</h3>
                        <p>
                            Мы создаем комьюнити из прогрессивных и творческих людей. Из тех,
                            кто смотрит в будущее и смело меняет мир, себя и окружающих.
                        </p>
                        <p>Присоединяйтесь!</p>
                        <div className="social-links">
                            <a
                                href="https://t.me/befree_official"
                                target="_blank"
                                title="Telegram"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={40}
                                    height={40}
                                    fill="none"
                                    viewBox="0 0 40 40"
                                >
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M0 20c0 11.046 8.954 20 20 20s20-8.954 20-20S31.046 0 20 0 0 8.954 0 20m16.333 9.167.34-5.099 9.274-8.369c.407-.361-.089-.537-.63-.21L13.873 22.71l-4.944-1.543c-1.067-.327-1.075-1.06.24-1.588l19.265-7.428c.88-.4 1.73.211 1.393 1.558l-3.28 15.46c-.23 1.099-.893 1.362-1.813.854l-4.998-3.692-2.402 2.336-.023.022c-.268.261-.49.478-.977.478"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                            <a href="https://vk.com/befree" target="_blank" title="ВКонтакте">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={40}
                                    height={40}
                                    fill="none"
                                    viewBox="0 0 40 40"
                                >
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0m1.628 26.314c-.197.207-.582.25-.582.25H19.77s-2.812.165-5.29-2.366c-2.703-2.763-5.09-8.243-5.09-8.243s-.137-.36.012-.533c.168-.196.626-.208.626-.208l3.048-.02s.287.047.492.195c.17.123.266.352.266.352s.492 1.222 1.144 2.329c1.274 2.16 1.867 2.632 2.299 2.4.63-.337.441-3.053.441-3.053s.012-.985-.317-1.425c-.255-.34-.735-.439-.947-.467-.172-.022.11-.413.475-.588.55-.264 1.517-.28 2.662-.268.892.01 1.149.064 1.497.147.81.191.784.805.73 2.13-.017.397-.036.857-.036 1.388q0 .181-.007.377c-.019.68-.04 1.457.415 1.746.234.148.805.021 2.233-2.359.677-1.128 1.184-2.455 1.184-2.455s.112-.236.284-.338c.177-.103.414-.072.414-.072l3.208-.019s.964-.114 1.12.314c.163.448-.36 1.495-1.671 3.21-1.243 1.626-1.848 2.225-1.793 2.755.04.387.434.737 1.189 1.424 1.575 1.436 1.997 2.191 2.099 2.373l.019.033c.706 1.15-.784 1.24-.784 1.24l-2.85.04s-.61.118-1.416-.425c-.422-.284-.834-.748-1.227-1.19-.6-.675-1.154-1.298-1.627-1.151-.794.248-.77 1.927-.77 1.927s.006.359-.174.55"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                            <a
                                href="https://www.tiktok.com/@befree.fashion"
                                target="_blank"
                                title="TikTok"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={40}
                                    height={40}
                                    fill="none"
                                    viewBox="0 0 40 40"
                                >
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M20 40c11.046 0 20-8.954 20-20S31.046 0 20 0 0 8.954 0 20s8.954 20 20 20m7.196-28.331a6.26 6.26 0 0 0 3.781 1.263l.01-.001v4.035c-1.385 0-2.736-.267-4.01-.806a10 10 0 0 1-2.279-1.327l.02 9.069a7.6 7.6 0 0 1-2.28 5.404 7.76 7.76 0 0 1-4.33 2.168 8 8 0 0 1-1.171.087 7.78 7.78 0 0 1-5.502-2.255 7.6 7.6 0 0 1-2.265-5.92 7.63 7.63 0 0 1 1.92-4.592 7.78 7.78 0 0 1 5.847-2.615q.596 0 1.17.087v4.112a3.678 3.678 0 0 0-4.836 3.543 3.66 3.66 0 0 0 1.794 3.096 3.69 3.69 0 0 0 3.043.335 3.68 3.68 0 0 0 2.522-3.485l.005-6.07V6.712h4.058q.006.606.122 1.176a6.28 6.28 0 0 0 2.381 3.78m3.79 1.259q.003.002 0 .003z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                            <a
                                href="https://www.youtube.com/c/befree"
                                target="_blank"
                                title="YouTube"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={40}
                                    height={40}
                                    fill="none"
                                    viewBox="0 0 40 40"
                                >
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0m8.334 13.125c.918.251 1.64.993 1.886 1.936.446 1.708.446 5.272.446 5.272s0 3.564-.446 5.273a2.71 2.71 0 0 1-1.886 1.936C26.671 28 19.999 28 19.999 28s-6.67 0-8.334-.458a2.71 2.71 0 0 1-1.887-1.936c-.445-1.709-.445-5.273-.445-5.273s0-3.564.445-5.272a2.71 2.71 0 0 1 1.887-1.937c1.663-.457 8.334-.457 8.334-.457s6.672 0 8.335.457"
                                        clipRule="evenodd"
                                    />
                                    <path fill="currentColor" d="M18 24v-6.667l5.333 3.334z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <img
                        src="../img/community_desk_4.jpg"
                        alt=""
                        className="community-img-4"
                    />
                </div>
                <div className="cocreate-section">
                    <div className="cocreate-content">
                        <h3>BEFREE CO:CREATE</h3>
                        <p>
                            Коммьюнити Befree — это люди разного возраста и типа внешности, с
                            разным опытом и жизненной позицией. Мы хотим создавать моду в
                            России вместе с вами.
                        </p>
                    </div>
                    <div className="cocreate-collections-wrapper">
                        <div className="cocreate-collections">
                            <div className="collection-item">
                                <img src="../img/cocreate_desk_1.jpg" alt="HELLO KITTY" />
                                <span>HELLO KITTY</span>
                            </div>
                            <div className="collection-item">
                                <img src="../img/cocreate_desk_2.jpg" alt="47 В ИГРЕ" />
                                <span>47 В ИГРЕ</span>
                            </div>
                            <div className="collection-item">
                                <img src="../img/cocreate_desk_3.jpg" alt="АННА" />
                                <span>АННА</span>
                            </div>
                            <div className="collection-item">
                                <img src="../img/cocreate_desk_4.jpg" alt="САМОКАТ" />
                                <span>САМОКАТ</span>
                            </div>
                            <div className="collection-item">
                                <img src="../img/cocreate_desk_5.jpg" alt="BANG BANG" />
                                <span>BANG! BANG!</span>
                            </div>
                            <div className="collection-item">
                                <img src="../img/cocreate_desk_6.jpg" alt="CITY LOVERS" />
                                <span>CITY LOVERS</span>
                            </div>
                        </div>
                        <p className="cocreate-description">
                            В 2021 году мы запустили проект Befree Co:Create, чтобы
                            разрабатывать коллекции с современными художниками и партнерами
                            бренда. Каждый месяц мы выпускаем минимум одну коллекцию в
                            сотрудничестве с нашим комьюнити!
                        </p>
                    </div>
                </div>
                <div className="future-section">
                    <h2>BETTER FUTURE СОЗДАВАЙ ЛУЧШЕЕ БУДУЩЕЕ</h2>
                    <div className="future-cards">
                        <img src="../img/better_future_1.jpg" alt="" />
                        <img src="../img/better_future_2.jpg" alt="" />
                        <img src="../img/better_future_3.jpg" alt="" />
                        <div className="future-card">
                            <h4>Меньше пакетов</h4>
                            <p>
                                Ваша покупка упакована в тот же пакет, в котором она пришла с
                                фабрики. Это минус 8 миллионов пластиковых пакетов в год!
                            </p>
                        </div>
                        <div className="future-card">
                            <h4>Новая жизнь старой одежды</h4>
                            <p>
                                Мы установили recycle-боксы в наших магазинах. Вещи не окажутся
                                на свалке благодаря партнёрству с проверенными компаниями.
                            </p>
                        </div>
                        <div className="future-card">
                            <h4>Ответственное производство</h4>
                            <p>
                                Используем переработанные материалы и сертифицированные
                                источники для минимизации воздействия на окружающую среду.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="shops-section">
                    <div className="shops-header">
                        <h2>МАГАЗИНЫ</h2>
                        <p>
                            Befree — это фэш-универмаги, в которых легко собрать образ. У нас
                            есть женский и мужской отделы, зоны денима, нижнего белья, обуви,
                            одежды для дома и спорта. Отдохнуть от шопинга можно в лаунж зоне
                            с мягкими диванами.
                        </p>
                    </div>
                    <div className="shops-grid">
                        <img
                            src="../img/shops_desk_1.jpg"
                            alt="Магазин"
                            className="shops-img-1"
                        />
                        <img
                            src="../img/shops_desk_2.jpg"
                            alt="Магазин"
                            className="shops-img-2"
                        />
                        <img
                            src="../img/shops_desk_3.jpg"
                            alt="Магазин"
                            className="shops-img-3"
                        />
                    </div>
                    <div className="shops-stats">
                        <div className="shops-stat shops-stat-1">
                            <div className="stat-number">260+</div>
                            <div className="stat-label">магазинов в России и Беларуси</div>
                        </div>
                        <div className="shops-stat shops-stat-2">
                            <div className="stat-number">30+</div>
                            <div className="stat-label">новых точек открыто в 2023 году</div>
                        </div>
                        <div className="shops-stat shops-stat-3">
                            <div className="stat-number">с 900 до 2500 м²</div>
                            <div className="stat-label">
                                увеличилась максимальная площадь магазинов в 2023 году
                            </div>
                        </div>
                    </div>
                </div>
                <div className="shops-interior-section">
                    <div className="shops-interior-wrapper">
                        <div className="shops-interior-text-block" id="custom">
                            <p>
                                Интерьер наших магазинов — минималистичный fusion. Большие
                                мультимедийные экраны, лаунж-зоны с мягкими диванами и удобные
                                примерочные с мягким светом для комфортного шопинга. Интерьеры
                                флагманских магазинов в ТЦ «Галерея» и «Авиапарк» мы дополнили
                                арт-объектами от художников, с которыми делаем коллекции Befree
                                Co:Create.
                            </p>
                            <p>
                                Открытия новых магазинов мы превращаем в праздник для комьюнити:
                                зовем диджеев, устраиваем розыгрыши, преобразуем одежду в{" "}
                                <a href="#custom">pop-up кастом-баре</a> и предлагаем оценить
                                цифровую коллекцию{" "}
                                <span className="highlight">Befree Denim Punk</span> в
                                виртуальной примерочной.
                            </p>
                        </div>
                        <div className="shops-interior-top-images">
                            <img src="../img/shops_desk_4.jpg" alt="Магазин" />
                            <img src="../img/shops_desk_5.jpg" alt="Магазин" />
                        </div>
                        <div className="shops-interior-bottom-images">
                            <img
                                src="../img/shops_desk_6.jpg"
                                alt="Магазин"
                                className="large-photo"
                            />
                            <img src="../img/shops_desk_7.jpg" alt="Магазин" />
                            <img src="../img/shops_desk_8.jpg" alt="Магазин" />
                        </div>
                    </div>
                </div>
                <div className="office-section">
                    <div className="office-content-wrapper">
                        <h2>ОФИС</h2>
                        <p>
                            Офис Befree находится в историческом здании в Санкт-Петербурге. В
                            XIX веке в нем открылась Женская рукодельная школа, позже ставшая
                            легендарным советским швейным производством «Первомайская заря».
                        </p>
                        <p>
                            На его базе появилась компания Melon Fashion Group и бренд Befree
                            — теперь мы создаем здесь коллекции, придумываем концепции
                            магазинов и ставим цели, которые потом делает реальность огромная
                            команда #befreepeople
                        </p>
                        <div className="office-gallery">
                            <img src="../img/office_1.jpg" alt="Место для кофе-брейка" />
                            <img src="../img/office_2.jpg" alt="Место для отдыха" />
                            <img src="../img/office_3.jpg" alt="Рабочее место" />
                        </div>
                    </div>
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
