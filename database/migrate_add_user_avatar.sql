-- Add avatar columns to users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS avatar bytea;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS avatar_mime varchar(255);

-- Optional: index for faster lookup if needed
CREATE INDEX IF NOT EXISTS idx_users_avatar_present ON users ((avatar IS NOT NULL));
