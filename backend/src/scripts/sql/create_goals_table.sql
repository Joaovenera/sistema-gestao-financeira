CREATE TABLE IF NOT EXISTS goals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  target DECIMAL(10,2) NOT NULL,
  current DECIMAL(10,2) DEFAULT 0,
  type ENUM('SAVING', 'SPENDING', 'INVESTMENT') NOT NULL,
  deadline DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
); 