const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const emailTemplates = {
  passwordRecovery: (token) => ({
    subject: 'Recuperação de Senha',
    html: `
      <h1>Recuperação de Senha</h1>
      <p>Você solicitou a recuperação de senha. Use o código abaixo para redefinir sua senha:</p>
      <h2>${token}</h2>
      <p>Este código expira em 1 hora.</p>
      <p>Se você não solicitou esta recuperação, ignore este email.</p>
    `
  }),

  transactionAlert: (transaction) => ({
    subject: 'Nova Transação Registrada',
    html: `
      <h1>Nova Transação</h1>
      <p>Uma nova transação foi registrada em sua conta:</p>
      <ul>
        <li>Tipo: ${transaction.type}</li>
        <li>Valor: R$ ${transaction.amount}</li>
        <li>Data: ${new Date(transaction.date).toLocaleDateString()}</li>
        <li>Descrição: ${transaction.description}</li>
      </ul>
    `
  })
};

const emailService = {
  sendEmail: async (to, template, data) => {
    try {
      const { subject, html } = emailTemplates[template](data);

      const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        html
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info('Email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  },

  sendPasswordRecovery: async (email, token) => {
    return emailService.sendEmail(email, 'passwordRecovery', token);
  },

  sendTransactionAlert: async (email, transaction) => {
    return emailService.sendEmail(email, 'transactionAlert', transaction);
  }
};

module.exports = emailService; 