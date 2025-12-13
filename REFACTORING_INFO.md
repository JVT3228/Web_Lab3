# Рефакторинг сайта: Переход на шаблоны и динамическую загрузку товаров

## Что было сделано

### 1. Централизованное хранилище товаров (`products.js`)
Создан файл, содержащий всех 9 товаров с полной информацией:
- **Структура**: объект с категориями (clothing, footwear, accessories)
- **Каждый товар включает**: id, name, price, cardImage, shortDesc, images[], characteristics[], description
- **Функции для работы**:
  - `findProduct(category, id)` — найти товар по категории и ID
  - `getProductsByCategory(category)` — получить все товары категории
  - `getAllProducts()` — получить всех товаров

### 2. Компоненты и утилиты (`components.js`)
Переиспользуемые функции для:
- `loadHeader()` — вставить единую header на страницу
- `loadFooter()` — вставить единую footer на страницу
- `renderProductCard(product, category)` — создать карточку товара
- `renderProductPage(product)` — создать страницу товара с полной инфо
- `initProductLightbox()` — инициализировать модальное окно для карусели
- `getURLParams()` — получить параметры из URL

### 3. Универсальная страница товара (`product.html`)
Одна страница для всех товаров с логикой:
- Читает параметры из URL: `product.html?id=clothing-1&category=clothing`
- Загружает товар из `products.js`
- Рендерит всю информацию динамически
- Инициализирует модальное окно карусели

### 4. Обновлены страницы категорий
**clothing.html, footwear.html, accessories.html:**
- Заменены статичные карточки на динамическую генерацию
- Используют `renderProductCard()` для создания карточек
- Ссылки автоматически указывают на `product.html?id=X&category=Y`
- Подключены `products.js` и `components.js`

## Структура ссылок

### Было (9 отдельных файлов):
```
product-clothing-1.html
product-clothing-2.html
product-clothing-3.html
product-footwear-1.html
product-footwear-2.html
product-footwear-3.html
product-accessories-1.html
product-accessories-2.html
product-accessories-3.html
```

### Стало (1 универсальный файл + параметры):
```
product.html?id=clothing-1&category=clothing
product.html?id=clothing-2&category=clothing
product.html?id=clothing-3&category=clothing
product.html?id=footwear-1&category=footwear
product.html?id=footwear-2&category=footwear
product.html?id=footwear-3&category=footwear
product.html?id=accessories-1&category=accessories
product.html?id=accessories-2&category=accessories
product.html?id=accessories-3&category=accessories
```

## Преимущества

1. **DRY (Don't Repeat Yourself)** — нет дублирования кода
2. **Масштабируемость** — легко добавить новый товар просто в `products.js`
3. **Централизованное управление** — все данные в одном месте
4. **Переиспользование компонентов** — header/footer/карточка используются везде
5. **Меньше файлов** — вместо 9+ файлов товаров, используется 1 универсальный

## Файлы

| Файл | Размер | Назначение |
|------|--------|-----------|
| `products.js` | ~21 KB | Хранилище данных всех товаров |
| `components.js` | ~10 KB | Функции для рендеринга компонентов |
| `product.html` | ~3 KB | Универсальная страница товара |
| `clothing.html` | Обновлен | Динамическая категория одежды |
| `footwear.html` | Обновлен | Динамическая категория обуви |
| `accessories.html` | Обновлен | Динамическая категория аксессуаров |

## Как это работает

### При переходе на категорию (например, clothing.html):
1. Страница загружается
2. JavaScript вызывает `getProductsByCategory('clothing')`
3. Для каждого товара вызывает `renderProductCard(product, 'clothing')`
4. Карточка добавляется в grid

### При клике на товар:
1. Ссылка ведет на `product.html?id=clothing-1&category=clothing`
2. JavaScript парсит URL параметры
3. Ищет товар в `products.js` через `findProduct()`
4. Рендерит полную информацию товара
5. Инициализирует модальное окно для карусели

## Следующие шаги (опционально)

1. Обновить все старые ссылки на `product-*-*.html` (если они еще используются)
2. Удалить старые файлы товаров (если они больше не нужны)
3. Добавить поиск/фильтрацию товаров через `products.js`
4. Реализовать покупку/корзину с использованием `products.js`
5. Добавить новые товары просто расширив массив в `products.js`
