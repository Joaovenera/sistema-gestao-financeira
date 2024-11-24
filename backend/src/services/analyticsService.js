const { pool } = require('../config/database');
const logger = require('../utils/logger');
const stats = require('simple-statistics');

const analyticsService = {
  async getFlowPrediction({ user_id, months_ahead = 3 }) {
    try {
      // Buscar histórico de transações
      const [transactions] = await pool.execute(`
        SELECT 
          DATE_FORMAT(date, '%Y-%m') as month,
          type,
          SUM(amount) as total
        FROM transactions 
        WHERE user_id = ? 
        GROUP BY DATE_FORMAT(date, '%Y-%m'), type
        ORDER BY date DESC
        LIMIT 12
      `, [user_id]);

      // Separar por tipo
      const incomes = transactions
        .filter(t => t.type === 'INCOME')
        .map(t => t.total);
      
      const expenses = transactions
        .filter(t => t.type === 'EXPENSE')
        .map(t => t.total);

      // Calcular tendências
      const incomePrediction = this._calculateTrend(incomes, months_ahead);
      const expensePrediction = this._calculateTrend(expenses, months_ahead);

      return {
        predictions: {
          income: incomePrediction,
          expense: expensePrediction,
          balance: incomePrediction.map((inc, i) => inc - expensePrediction[i])
        },
        confidence_score: this._calculateConfidenceScore(incomes, expenses)
      };
    } catch (error) {
      logger.error('Error generating flow prediction:', error);
      throw error;
    }
  },

  async detectAnomalies({ user_id, threshold = 2 }) {
    try {
      const [transactions] = await pool.execute(`
        SELECT 
          t.*,
          c.name as category_name
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ?
        ORDER BY t.date DESC
        LIMIT 100
      `, [user_id]);

      const categoryAverages = {};
      const anomalies = [];

      // Agrupar por categoria
      transactions.forEach(transaction => {
        if (!categoryAverages[transaction.category_id]) {
          categoryAverages[transaction.category_id] = {
            amounts: [],
            name: transaction.category_name
          };
        }
        categoryAverages[transaction.category_id].amounts.push(transaction.amount);
      });

      // Detectar anomalias por categoria
      Object.entries(categoryAverages).forEach(([category_id, data]) => {
        const { amounts, name } = data;
        const mean = stats.mean(amounts);
        const stdDev = stats.standardDeviation(amounts);

        transactions
          .filter(t => t.category_id === parseInt(category_id))
          .forEach(transaction => {
            const zScore = Math.abs((transaction.amount - mean) / stdDev);
            if (zScore > threshold) {
              anomalies.push({
                transaction_id: transaction.id,
                category_name: name,
                amount: transaction.amount,
                date: transaction.date,
                z_score: zScore,
                average_amount: mean,
                deviation: stdDev
              });
            }
          });
      });

      return {
        anomalies,
        metadata: {
          total_analyzed: transactions.length,
          anomalies_found: anomalies.length,
          threshold: threshold,
          analysis_date: new Date()
        }
      };
    } catch (error) {
      logger.error('Error detecting anomalies:', error);
      throw error;
    }
  },

  async getRecommendations({ user_id }) {
    try {
      // Análise de gastos por categoria
      const [categoryAnalysis] = await pool.execute(`
        SELECT 
          c.name,
          c.type,
          SUM(t.amount) as total,
          COUNT(*) as transaction_count,
          AVG(t.amount) as average_amount
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ?
        AND t.date >= DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH)
        GROUP BY c.id
        ORDER BY total DESC
      `, [user_id]);

      // Gerar recomendações baseadas na análise
      const recommendations = [];
      let totalExpenses = 0;

      categoryAnalysis.forEach(category => {
        if (category.type === 'EXPENSE') {
          totalExpenses += category.total;
        }
      });

      categoryAnalysis.forEach(category => {
        if (category.type === 'EXPENSE') {
          const percentageOfTotal = (category.total / totalExpenses) * 100;
          
          if (percentageOfTotal > 30) {
            recommendations.push({
              type: 'REDUCTION',
              category: category.name,
              message: `Gastos em ${category.name} representam ${percentageOfTotal.toFixed(1)}% do total. Considere reduzir.`,
              impact: 'HIGH'
            });
          }

          if (category.transaction_count > 20) {
            recommendations.push({
              type: 'FREQUENCY',
              category: category.name,
              message: `Alto número de transações em ${category.name}. Considere consolidar gastos.`,
              impact: 'MEDIUM'
            });
          }
        }
      });

      return {
        recommendations,
        analysis: {
          categories: categoryAnalysis,
          period: '3 months',
          total_expenses: totalExpenses
        }
      };
    } catch (error) {
      logger.error('Error generating recommendations:', error);
      throw error;
    }
  },

  _calculateTrend(data, periods_ahead) {
    const xValues = Array.from({ length: data.length }, (_, i) => i);
    const regression = stats.linearRegression(
      xValues.map(x => [x, data[x]])
    );

    return Array.from(
      { length: periods_ahead },
      (_, i) => regression.m * (data.length + i) + regression.b
    );
  },

  _calculateConfidenceScore(incomes, expenses) {
    const incomeVariation = stats.variance(incomes);
    const expenseVariation = stats.variance(expenses);
    const maxVariation = Math.max(incomeVariation, expenseVariation);
    
    return Math.max(0, 100 - (maxVariation / 1000));
  }
};

module.exports = analyticsService; 