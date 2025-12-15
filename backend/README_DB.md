How to apply DB schema for cart/orders

1) Ensure PostgreSQL is running and environment variables are set (DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT).

2) From project root run (Windows PowerShell example):

```powershell
$env:PGPASSWORD = 'your_db_password'
psql -h localhost -U postgres -d befree_shop -f backend/schema.sql
```

Or with psql directly using connection string:

```powershell
psql "host=localhost port=5432 dbname=befree_shop user=postgres password=your_db_password" -f backend/schema.sql
```

3) Restart backend Flask app if running.

Notes:
- The schema uses `users(id)` and `products(id)` foreign keys; ensure those tables exist or remove/adjust the FK clauses if they don't.
- The backend already supports storing guest carts with `session_id` and merging them on login (`/api/cart/merge`). Frontend stores `session_id` in `localStorage` and sends it with cart API requests (see `main/cart.js`).
