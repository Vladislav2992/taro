CREATE TABLE IF NOT EXISTS telegram_users (
  telegram_id TEXT PRIMARY KEY,
  free_readings_balance INTEGER NOT NULL DEFAULT 1 CHECK (free_readings_balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
