SET client_encoding = 'UTF8';

-- Seed minimal products
INSERT INTO products (name, description, short_description, price, category, images, characteristics, stock_quantity)
VALUES
('Тестовая футболка', 'Комфортная футболка', 'Футболка в базовом стиле', 999.00, 'clothing', '["/img/tshirt1.jpg"]', '{"sizes":["S","M","L"]}', 10)
ON CONFLICT DO NOTHING;
