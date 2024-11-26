-- Criação das tabelas em ordem correta considerando as dependências

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY idx_users_email (email),
  KEY idx_users_role (role)
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  type ENUM('INCOME', 'EXPENSE') NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_categories_type (type),
  KEY idx_categories_name (name)
);

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  type ENUM('INCOME', 'EXPENSE') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_transactions_user_date (user_id, date),
  KEY idx_transactions_category (category_id),
  KEY idx_transactions_type (type),
  KEY idx_transactions_date (date),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabela de cartões de crédito
CREATE TABLE IF NOT EXISTS credit_cards (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  last_digits VARCHAR(4) NOT NULL,
  brand VARCHAR(50) NOT NULL,
  credit_limit DECIMAL(15,2) NOT NULL,
  closing_day INT NOT NULL,
  due_day INT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_credit_cards_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de metas
CREATE TABLE IF NOT EXISTS goals (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  target DECIMAL(10,2) NOT NULL,
  current DECIMAL(10,2) DEFAULT 0,
  type ENUM('SAVING', 'SPENDING', 'INVESTMENT') NOT NULL,
  deadline DATE NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de logs de atividade
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT,
  details JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_activity_logs_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS system_settings (
  id INT NOT NULL AUTO_INCREMENT,
  setting_name VARCHAR(100) NOT NULL,
  setting_data TEXT NOT NULL,
  description VARCHAR(255),
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT,
  PRIMARY KEY (id),
  UNIQUE KEY setting_name (setting_name)
); 