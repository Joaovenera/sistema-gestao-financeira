const mysqldump = require('mysqldump');
const path = require('path');
const fs = require('fs').promises;
const { compress } = require('../utils/compression');
const logger = require('../utils/logger');
const { pool } = require('../config/database');

const backupService = {
  async createBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(__dirname, '../../backups');
      const backupPath = path.join(backupDir, `backup-${timestamp}.sql`);
      
      // Garantir que o diretório existe
      await fs.mkdir(backupDir, { recursive: true });

      // Realizar o backup
      await mysqldump({
        connection: {
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        },
        dumpToFile: backupPath,
      });

      // Comprimir o arquivo
      const compressedPath = `${backupPath}.gz`;
      await compress(backupPath, compressedPath);

      // Remover arquivo SQL original
      await fs.unlink(backupPath);

      // Registrar o backup
      await this.logBackup({
        file_path: compressedPath,
        size: (await fs.stat(compressedPath)).size,
        status: 'SUCCESS'
      });

      return compressedPath;
    } catch (error) {
      logger.error('Error creating backup:', error);
      throw error;
    }
  },

  async restoreBackup(backupId) {
    try {
      // Buscar informações do backup
      const backup = await this.getBackupById(backupId);
      if (!backup) {
        throw new Error('Backup não encontrado');
      }

      // Descomprimir o arquivo
      const sqlPath = backup.file_path.replace('.gz', '');
      await decompress(backup.file_path, sqlPath);

      // Restaurar o banco
      const sql = await fs.readFile(sqlPath, 'utf8');
      await pool.query(sql);

      // Limpar arquivos temporários
      await fs.unlink(sqlPath);

      return true;
    } catch (error) {
      logger.error('Error restoring backup:', error);
      throw error;
    }
  },

  async listBackups(filters = {}) {
    try {
      let query = `
        SELECT * FROM backups 
        WHERE 1=1
      `;
      const params = [];

      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      if (filters.date_start) {
        query += ' AND created_at >= ?';
        params.push(filters.date_start);
      }

      if (filters.date_end) {
        query += ' AND created_at <= ?';
        params.push(filters.date_end);
      }

      query += ' ORDER BY created_at DESC';

      const [backups] = await pool.execute(query, params);
      return backups;
    } catch (error) {
      logger.error('Error listing backups:', error);
      throw error;
    }
  }
};

module.exports = backupService; 