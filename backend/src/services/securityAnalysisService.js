const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const logger = require('../utils/logger');

const securityAnalysisService = {
  async runDependencyCheck() {
    try {
      const { stdout } = await execAsync('npm audit --json');
      const auditResult = JSON.parse(stdout);
      
      return {
        vulnerabilities: auditResult.vulnerabilities,
        metadata: auditResult.metadata,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Erro na análise de dependências:', error);
      throw new Error('Falha na análise de segurança das dependências');
    }
  },

  async checkSecurityHeaders(url) {
    try {
      const response = await fetch(url);
      const headers = response.headers;
      
      const securityHeaders = {
        'Strict-Transport-Security': headers.get('strict-transport-security'),
        'Content-Security-Policy': headers.get('content-security-policy'),
        'X-Frame-Options': headers.get('x-frame-options'),
        'X-Content-Type-Options': headers.get('x-content-type-options'),
        'Referrer-Policy': headers.get('referrer-policy'),
        'Permissions-Policy': headers.get('permissions-policy')
      };

      return {
        headers: securityHeaders,
        timestamp: new Date(),
        url
      };
    } catch (error) {
      logger.error('Erro na verificação de headers:', error);
      throw new Error('Falha na análise dos headers de segurança');
    }
  },

  async runSecurityScan() {
    const results = {
      timestamp: new Date(),
      dependencyCheck: null,
      headerCheck: null,
      configCheck: this.checkSecurityConfig(),
      recommendations: []
    };

    try {
      results.dependencyCheck = await this.runDependencyCheck();
      results.headerCheck = await this.checkSecurityHeaders(process.env.API_URL);
      
      // Análise dos resultados e recomendações
      this.analyzeResults(results);
      
      return results;
    } catch (error) {
      logger.error('Erro no scan de segurança:', error);
      throw new Error('Falha na análise de segurança');
    }
  },

  checkSecurityConfig() {
    const config = {
      rateLimit: !!process.env.RATE_LIMIT_MAX_REQUESTS,
      httpsOnly: process.env.NODE_ENV === 'production',
      secureHeaders: true,
      csrfProtection: true
    };

    return {
      config,
      recommendations: this.generateConfigRecommendations(config)
    };
  },

  generateConfigRecommendations(config) {
    const recommendations = [];

    if (!config.rateLimit) {
      recommendations.push('Configurar rate limiting para proteção contra DDoS');
    }
    if (!config.httpsOnly) {
      recommendations.push('Forçar HTTPS em produção');
    }

    return recommendations;
  },

  analyzeResults(results) {
    if (results.dependencyCheck?.vulnerabilities?.length > 0) {
      results.recommendations.push('Atualizar dependências vulneráveis');
    }

    if (!results.headerCheck?.headers['Strict-Transport-Security']) {
      results.recommendations.push('Implementar HSTS');
    }

    return results;
  }
};

module.exports = securityAnalysisService; 