const BaseModel = require('./BaseModel');
const bcrypt = require('bcryptjs');

class User extends BaseModel {
  constructor() {
    super('users');
  }

  async findByEmail(email) {
    const [rows] = await this.pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  async validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
  }

  async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.update(id, { password: hashedPassword });
  }
}

module.exports = new User(); 