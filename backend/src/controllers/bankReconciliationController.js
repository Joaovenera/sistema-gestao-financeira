const bankFileProcessorService = require('../services/bankFileProcessorService');
const logger = require('../utils/logger');
const multer = require('multer');
const path = require('path');

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/bank_files');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.ret' && ext !== '.rem') {
      return cb(new Error('Apenas arquivos RET e REM são permitidos'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

const bankReconciliationController = {
  uploadFile: [
    upload.single('file'),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const fileType = path.extname(req.file.originalname)
          .toUpperCase()
          .replace('.', '');

        const transactions = await bankFileProcessorService.processFile(
          req.file.path,
          req.user.id,
          fileType
        );

        const reconciliationResults = await bankFileProcessorService
          .reconcileTransactions(transactions, req.user.id);

        res.json({
          message: 'Arquivo processado com sucesso',
          results: reconciliationResults
        });
      } catch (error) {
        logger.error('Error processing bank file:', error);
        res.status(500).json({ error: 'Erro ao processar arquivo bancário' });
      }
    }
  ],

  getReconciliationStatus: async (req, res) => {
    try {
      const reconciliations = await BankReconciliation
        .findPendingReconciliations(req.user.id);
      res.json(reconciliations);
    } catch (error) {
      logger.error('Error getting reconciliation status:', error);
      res.status(500).json({ error: 'Erro ao buscar status da conciliação' });
    }
  }
};

module.exports = bankReconciliationController; 