require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

async function initializeDatabase() {
  try {
    // Primeiro, conectar sem selecionar banco de dados
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // Criar banco de dados se não existir
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);

    logger.info('Database created or already exists');

    // Verificar e criar cada tabela individualmente
    await createTableIfNotExists(connection, 'users', `
      CREATE TABLE users (
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
      )
    `);

    await createTableIfNotExists(connection, 'categories', `
      CREATE TABLE categories (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        type ENUM('INCOME', 'EXPENSE') NOT NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_categories_type (type),
        KEY idx_categories_name (name)
      )
    `);

    await createTableIfNotExists(connection, 'transactions', `
      CREATE TABLE transactions (
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
      )
    `);

    await createTableIfNotExists(connection, 'credit_cards', `
      CREATE TABLE credit_cards (
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
      )
    `);

    await createTableIfNotExists(connection, 'goals', `
      CREATE TABLE goals (
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
      )
    `);

    // Inserir categorias padrão se a tabela estiver vazia
    const [categories] = await connection.query('SELECT COUNT(*) as count FROM categories');
    if (categories[0].count === 0) {
      const defaultCategories = [
        ['Alimentação', 'EXPENSE'],
        ['Transporte', 'EXPENSE'],
        ['Moradia', 'EXPENSE'],
        ['Saúde', 'EXPENSE'],
        ['Educação', 'EXPENSE'],
        ['Lazer', 'EXPENSE'],
        ['Salário', 'INCOME'],
        ['Investimentos', 'INCOME'],
        ['Outros', 'EXPENSE']
      ];

      for (const [name, type] of defaultCategories) {
        await connection.query(
          'INSERT INTO categories (name, type) VALUES (?, ?)',
          [name, type]
        );
      }
      logger.info('Default categories inserted');
    }

    await connection.end();
    logger.info('Database initialization completed');

  } catch (error) {
    logger.error('Error initializing database:', error);
    process.exit(1);
  }
}

async function createTableIfNotExists(connection, tableName, createTableSQL) {
  try {
    const [tables] = await connection.query(
      `SELECT COUNT(*) as count 
       FROM information_schema.tables 
       WHERE table_schema = ? AND table_name = ?`,
      [process.env.DB_NAME, tableName]
    );

    if (tables[0].count === 0) {
      await connection.query(createTableSQL);
      logger.info(`Table ${tableName} created`);
    } else {
      logger.info(`Table ${tableName} already exists`);
    }
  } catch (error) {
    logger.error(`Error creating table ${tableName}:`, error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase; 