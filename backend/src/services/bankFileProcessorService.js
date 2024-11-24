const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const BankReconciliation = require('../models/BankReconciliation');
const Transaction = require('../models/Transaction');

const bankFileProcessorService = {
  async processFile(filePath, userId, fileType) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());

      if (fileType === 'RET') {
        return await this.processRetFile(lines, userId);
      } else if (fileType === 'REM') {
        return await this.processRemFile(lines, userId);
      }

      throw new Error('Tipo de arquivo não suportado');
    } catch (error) {
      logger.error('Error processing bank file:', error);
      throw error;
    }
  },

  async processRetFile(lines, userId) {
    const transactions = [];
    let currentTransaction = {};

    for (const line of lines) {
      // Implementar lógica de parsing do arquivo RET
      // Exemplo básico:
      if (line.startsWith('1')) { // Header
        continue;
      } else if (line.startsWith('3')) { // Detalhe
        currentTransaction = {
          date: line.substring(137, 145),
          amount: parseFloat(line.substring(152, 167)) / 100,
          description: line.substring(167, 207).trim(),
          type: line.substring(108, 109) === 'C' ? 'INCOME' : 'EXPENSE'
        };
        transactions.push(currentTransaction);
      }
    }

    return transactions;
  },

  async processRemFile(lines, userId) {
    // Implementar lógica similar para arquivo REM
    // ...
  },

  async reconcileTransactions(transactions, userId) {
    const results = {
      matched: [],
      unmatched: [],
      created: []
    };

    for (const bankTx of transactions) {
      // Procurar transação correspondente
      const matchedTx = await Transaction.findOne({
        user_id: userId,
        amount: bankTx.amount,
        date: bankTx.date,
        // Adicionar mais critérios de matching conforme necessário
      });

      if (matchedTx) {
        results.matched.push({ bank: bankTx, system: matchedTx });
      } else {
        results.unmatched.push(bankTx);
      }
    }

    return results;
  }
};

module.exports = bankFileProcessorService; 