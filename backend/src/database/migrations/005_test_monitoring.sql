CREATE TABLE test_runs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('unit', 'integration', 'e2e', 'security') NOT NULL,
    total INT NOT NULL,
    passed INT NOT NULL,
    failed INT NOT NULL,
    skipped INT NOT NULL,
    duration FLOAT NOT NULL,
    coverage FLOAT,
    branch VARCHAR(100),
    commit_hash VARCHAR(40),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_failures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    test_run_id INT NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    error_message TEXT,
    file_path VARCHAR(255),
    line_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_run_id) REFERENCES test_runs(id)
);

CREATE INDEX idx_test_runs_type ON test_runs(type);
CREATE INDEX idx_test_runs_date ON test_runs(created_at);
CREATE INDEX idx_test_failures_run ON test_failures(test_run_id); 