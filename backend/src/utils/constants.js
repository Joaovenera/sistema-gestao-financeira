const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  USER_NOT_FOUND: 'Usuário não encontrado',
  EMAIL_IN_USE: 'Email já está em uso',
  INVALID_TOKEN: 'Token inválido ou expirado',
  UNAUTHORIZED: 'Não autorizado',
  FORBIDDEN: 'Acesso negado',
  TRANSACTION_NOT_FOUND: 'Transação não encontrada',
  CATEGORY_NOT_FOUND: 'Categoria não encontrada',
  INTERNAL_ERROR: 'Erro interno do servidor',
  VALIDATION_ERROR: 'Dados inválidos'
};

const SUCCESS_MESSAGES = {
  USER_CREATED: 'Usuário criado com sucesso',
  PASSWORD_RESET_EMAIL: 'Email de recuperação enviado com sucesso',
  PASSWORD_RESET: 'Senha alterada com sucesso',
  TRANSACTION_CREATED: 'Transação criada com sucesso',
  TRANSACTION_UPDATED: 'Transação atualizada com sucesso',
  TRANSACTION_DELETED: 'Transação excluída com sucesso'
};

module.exports = {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
}; 