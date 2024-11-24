-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS financial_management;

USE financial_management;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    status ENUM('active', 'inactive') DEFAULT 'active',
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('INCOME', 'EXPENSE') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    type ENUM('INCOME', 'EXPENSE') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabela de logs de atividade
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    details JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Índices importantes
-- Verificar e adicionar índices se não existirem
SELECT COUNT(1) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'transactions' AND index_name = 'idx_transactions_user_date';

SET @query = IF(@exists = 0,
    'ALTER TABLE transactions ADD INDEX idx_transactions_user_date (user_id, date)',
    'SELECT ''Index idx_transactions_user_date already exists''');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COUNT(1) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'transactions' AND index_name = 'idx_transactions_category';

SET @query = IF(@exists = 0,
    'ALTER TABLE transactions ADD INDEX idx_transactions_category (category_id)',
    'SELECT ''Index idx_transactions_category already exists''');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COUNT(1) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'activity_logs' AND index_name = 'idx_activity_logs_user';

SET @query = IF(@exists = 0,
    'ALTER TABLE activity_logs ADD INDEX idx_activity_logs_user (user_id)',
    'SELECT ''Index idx_activity_logs_user already exists''');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt; 