-- Миграция: добавить столбцы для хранения изображений в бинарном виде
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS image_bytes bytea,
    ADD COLUMN IF NOT EXISTS image_mime varchar;

-- Создайте индекс если нужно искать по наличию изображения
CREATE INDEX IF NOT EXISTS idx_products_image_bytes_present ON products ((image_bytes IS NOT NULL));
