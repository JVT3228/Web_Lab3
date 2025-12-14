# Backend: Быстрый запуск без Docker-а

Коротко: этот бэкенд на Flask использует PostgreSQL. Docker не требуется — инструкции ниже для Windows (PowerShell).

Требования
- Python 3.10+ (установлен в PATH)
- PostgreSQL (локально) и утилита `psql` или доступ через pgAdmin

Шаги (PowerShell)

1) Создать и активировать виртуальное окружение, установить зависимости

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r backend/requirements.txt
```

2) Создать базу данных (если ещё нет)

```powershell
# заменить имя и пользователя при необходимости
# Создать базу данных
createdb befree_shop
# Применить схему и сиды
psql -d befree_shop -f database/schema.sql
psql -d befree_shop -f database/seed.sql
```

Если у вас нет `createdb`/`psql`, можно создать БД через pgAdmin или другой клиент.

3) Установить переменные окружения (пример для PowerShell)

```powershell
$env:DB_HOST='localhost'
$env:DB_PORT='5432'
$env:DB_NAME='befree_shop'
$env:DB_USER='postgres'
$env:DB_PASSWORD='your_password'
$env:SECRET_KEY='some-secret'
$env:JWT_SECRET_KEY='some-jwt-secret'
```

4) Запустить приложение

```powershell
python backend/app.py
```

После старта сервер доступен по умолчанию на http://127.0.0.1:5000

Краткие примеры запросов
- Регистрация:

POST /api/auth/register
```json
{
  "username": "ivan",
  "email": "ivan@example.com",
  "phone": "+7 (999) 111-22-33",
  "password": "secret"
}
```

- Вход:

POST /api/auth/login
```json
{ "login": "ivan@example.com", "password": "secret" }
```

Фронтенд
- Страницы клиента находятся в каталоге `main/`. Для локальной проверки просто откройте HTML-файлы в браузере (например, `main/index.html`) или используйте простой статический сервер.

Тесты
- В проект добавлены простые `pytest` тесты, которые мокируют подключение к базе, поэтому для их запуска Postgres не обязателен.

Пример запуска тестов (PowerShell):
```powershell
# активировать venv (если ещё не активирован)
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
pytest -q
```

Быстрая проверка фронтенда
- Чтобы открыть фронтенд как статический сайт (удобно при разработке), можно запустить лёгкий HTTP-сервер из каталога `main`:

```powershell
cd main
python -m http.server 8000
# затем открыть http://127.0.0.1:8000
```

Если нужно — могу добавить сценарии запуска (`Makefile`/PowerShell скрипты), подробнее покрыть тестами `orders`/`reviews` или подготовить инструкции для CI.

Замечания
- Пароли хэшируются с помощью `Flask-Bcrypt`.
- Номера телефонов очищаются до формата (10/11 цифр → `7XXXXXXXXXX`) в `app.py`.
- Если хочешь, могу добавить альтернативный режим с SQLite (чтобы полностью избежать установки Postgres) — скажи, если нужно.

Полезные файлы:
- [backend/app.py](backend/app.py)
- [database/schema.sql](database/schema.sql)
- [database/seed.sql](database/seed.sql)
