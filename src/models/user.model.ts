import db from './dbcon';
import { User, CreateUserDto, UpdateUserDto } from '../types/user';

export class UserModel {
  static async findAll(): Promise<Omit<User, 'password'>[]> {
    const result = await db.query('SELECT id, username, email, role, is_email_verified FROM public.user');
    return result.rows;
  }

  static async findById(id: string): Promise<Omit<User, 'password'> | null> {
    const result = await db.query('SELECT id, username, email, role, is_email_verified FROM public.user WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(user: CreateUserDto): Promise<Omit<User, 'password'>> {
    const result = await db.query(
      'INSERT INTO public.user (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [user.username, user.email, user.password]
    );
    return result.rows[0];
  }

  static async updatePassword(id: string, password: string): Promise<Omit<User, 'password'> | null> {
    const query = `UPDATE public.user SET password = $1 WHERE id = $2 RETURNING id, username, email, role, is_email_verified`;
    const result = await db.query(query, [password, id]);
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.query('DELETE FROM public.user WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }

  static async findByUsername(username: string) {
    const result = await db.query('SELECT * FROM public.user WHERE username = $1', [username]);
    return result.rows[0] || null;
  }

  static async findByEmail(email: string) {
    const result = await db.query('SELECT * FROM public.user WHERE email = $1', [email]);
    return result.rows[0] || null;
  }
}
