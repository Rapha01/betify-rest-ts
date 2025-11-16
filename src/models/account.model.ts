import db from './dbcon';
import { Account, CreateAccountDto, UpdateAccountDto } from '../types/account';

export class AccountModel {
  static async findById(id: string): Promise<Omit<Account, 'password'> | null> {
    const result = await db.query('SELECT id, username, email, role, is_email_verified, avatar_url, created_at FROM account WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(account: CreateAccountDto): Promise<void> {
    await db.query(
      'INSERT INTO account (username, email, password, created_at) VALUES ($1, $2, $3, $4)',
      [account.username, account.email, account.password, Date.now()]
    );
  }

  static async update(id: string, data: Omit<UpdateAccountDto, 'id'>): Promise<boolean> {
    const fields = Object.keys(data);
    if (fields.length === 0) return false;

    const setClause = fields.map((field, idx) => `"${field}" = $${idx + 1}`).join(', ');
    const values = [...Object.values(data), id];

    const result = await db.query(
      `UPDATE account SET ${setClause} WHERE id = $${fields.length + 1}`,
      values
    );
    return (result.rowCount ?? 0) > 0;
  }

  static async findByUsername(username: string) {
    const result = await db.query('SELECT id, username, email, role, is_email_verified, avatar_url, created_at FROM account WHERE username = $1', [username]);
    return result.rows[0] || null;
  }

  static async findByEmail(email: string) {
    const result = await db.query('SELECT id, username, email, password, role, is_email_verified, avatar_url, created_at FROM account WHERE email = $1', [email]);
    return result.rows[0] || null;
  }
}