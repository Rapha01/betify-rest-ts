import db from './dbcon';
import { Member, UpdateMemberDto } from '../types/member';

export class MemberModel {
  static async findAll(): Promise<Member[]> {
    const result = await db.query('SELECT * FROM member');
    return result.rows;
  }

  static async findById(id: string): Promise<Member | null> {
    const result = await db.query('SELECT * FROM member WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByGameId(gameId: string): Promise<Member[]> {
    const result = await db.query('SELECT * FROM member WHERE game_id = $1', [gameId]);
    return result.rows;
  }

  static async findByAccountId(accountId: string): Promise<Member[]> {
    const result = await db.query('SELECT * FROM member WHERE account_id = $1', [accountId]);
    return result.rows;
  }

  static async findByGameAndAccountId(gameId: string, accountId: string): Promise<Member | null> {
    const result = await db.query('SELECT * FROM member WHERE game_id = $1 AND account_id = $2', [gameId, accountId]);
    return result.rows[0] || null;
  }

  static async create(gameId: string, accountId: string, currency: number): Promise<void> {
    await db.query(
      'INSERT INTO member (game_id, account_id, currency) VALUES ($1, $2, $3)',
      [gameId, accountId, currency]
    );
  }

  static async update(gameId: string, accountId: string, data: UpdateMemberDto): Promise<Member | null> {
    const fields = Object.keys(data);
    if (fields.length === 0) return null;

    const setClause = fields.map((field, idx) => `"${field}" = $${idx + 1}`).join(', ');
    const values = [...Object.values(data), gameId, accountId];

    const result = await db.query(
      `UPDATE member SET ${setClause} WHERE game_id = $${fields.length + 1} AND account_id = $${fields.length + 2}`,
      values
    );

    if ((result.rowCount ?? 0) > 0) {
      return await MemberModel.findByGameAndAccountId(gameId, accountId);
    }
    return null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.query('DELETE FROM member WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  static async deleteByGameAndAccountId(gameId: string, accountId: string): Promise<boolean> {
    const result = await db.query('DELETE FROM member WHERE game_id = $1 AND account_id = $2', [gameId, accountId]);
    return (result.rowCount ?? 0) > 0;
  }
}
