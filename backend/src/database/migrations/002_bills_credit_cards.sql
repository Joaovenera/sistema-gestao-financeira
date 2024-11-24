-- Tabela de contas a pagar/receber
CREATE TABLE bills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    type ENUM('PAYABLE', 'RECEIVABLE') NOT NULL,
    status ENUM('PENDING', 'PAID', 'CANCELLED') DEFAULT 'PENDING',
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_amount DECIMAL(15,2),
    paid_date DATE,
    payment_method VARCHAR(50),
    recurrence ENUM('NONE', 'MONTHLY', 'YEARLY') DEFAULT 'NONE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabela de cartões de crédito
CREATE TABLE credit_cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    last_digits VARCHAR(4) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    credit_limit DECIMAL(15,2) NOT NULL,
    closing_day INT NOT NULL,
    due_day INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de transações do cartão de crédito
CREATE TABLE credit_card_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    status ENUM('PENDING', 'PAID') DEFAULT 'PENDING',
    installments INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES credit_cards(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Índices para otimização
CREATE INDEX idx_bills_user_status ON bills(user_id, status);
CREATE INDEX idx_bills_due_date ON bills(due_date);
CREATE INDEX idx_credit_cards_user ON credit_cards(user_id);
CREATE INDEX idx_card_transactions_date ON credit_card_transactions(transaction_date); 