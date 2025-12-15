-- Migration: create table for static images served from DB
CREATE TABLE IF NOT EXISTS static_images (
    name TEXT PRIMARY KEY, -- path relative to main/, e.g. 'img/logo.png' or 'card-img/longsliv11.jpg'
    data BYTEA NOT NULL,
    mime VARCHAR(255) DEFAULT 'image/jpeg'
);

-- index to speed up lookups (name is primary key already)

-- Example usage:
-- INSERT INTO static_images (name, data, mime) VALUES ('img/logo.png', pg_read_binary_file('/path/to/main/img/logo.png'), 'image/png');
