const { pool } = require('../config/dbconfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  static async create({ name, email, password, role = 'student' }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async authenticate(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }
      return user;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  static generateAuthToken(user) {
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return token;
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, password, role FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  static async update(id, { name, email, role }) {
    try {
      await pool.query(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
        [name, email, role, id]
      );
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await pool.query(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = User;