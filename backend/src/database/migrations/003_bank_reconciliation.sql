-- Tabela para conciliação bancária
CREATE TABLE bank_reconciliation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    file_type ENUM('REM', 'RET') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'PROCESSED', 'ERROR') DEFAULT 'PENDING',
    details JSON,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Índices
CREATE INDEX idx_bank_reconciliation_user ON bank_reconciliation(user_id); 