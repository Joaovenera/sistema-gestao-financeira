-- Adicionando campos faltantes na tabela users
ALTER TABLE users
ADD COLUMN role ENUM('admin', 'user') DEFAULT 'user',
ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active',
ADD COLUMN last_login TIMESTAMP NULL,
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expires TIMESTAMP NULL;

-- Índices importantes
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id); 