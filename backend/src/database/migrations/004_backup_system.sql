CREATE TABLE backups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    file_path VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,
    status ENUM('SUCCESS', 'FAILED') NOT NULL,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    restored_at TIMESTAMP NULL,
    UNIQUE KEY idx_file_path (file_path)
);

-- Índices
CREATE INDEX idx_backup_status ON backups(status);
CREATE INDEX idx_backup_date ON backups(created_at); 