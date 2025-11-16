import db from './dbcon';
import { Game, CreateGameDto, UpdateGameDto } from '../types/game';
import { getRandomBannerUrl } from '../utils/bannerUrls';

export class GameModel {
  static async findById(id: string): Promise<Game | null> {
    const result = await db.query('SELECT * FROM game WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByAccountId(accountId: string, page: number = 1, limit: number = 9): Promise<{ data: Game[], total: number }> {
    const offset = (page - 1) * limit;
    
    // Get paginated games
    const gamesResult = await db.query(
      'SELECT * FROM game WHERE account_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [accountId, limit, offset]
    );
    
    // Get total count for pagination
    const countResult = await db.query(
      'SELECT COUNT(*) as total FROM game WHERE account_id = $1',
      [accountId]
    );
    
    return {
      data: gamesResult.rows,
      total: parseInt(countResult.rows[0].total, 10)
    };
  }

  static async create(data: CreateGameDto): Promise<void> {
    const bannerUrl = getRandomBannerUrl();
    await db.query(
      'INSERT INTO game (title, slug, account_id, banner_url, created_at) VALUES ($1, $2, $3, $4, $5)',
      [data.title, data.slug, data.account_id, bannerUrl, Date.now()]
    );
  }

  static async update(id: string, data: UpdateGameDto): Promise<boolean> {
    const fields = Object.keys(data);
    if (fields.length === 0) return false;
    
    const setClause = fields.map((field, idx) => `"${field}" = $${idx + 1}`).join(', ');
    const values = [...Object.values(data), id];
    
    const result = await db.query(
      `UPDATE game SET ${setClause} WHERE id = $${fields.length + 1}`,
      values
    );
    return (result.rowCount ?? 0) > 0;
  }

  static async findFavoriteByAccountId(accountId: string, page: number = 1, limit: number = 9): Promise<{ data: Game[], total: number }> {
    const offset = (page - 1) * limit;
    
    // Get paginated favorite games
    const gamesResult = await db.query(
      `SELECT g.* FROM game g 
       JOIN member m ON g.id = m.game_id 
       WHERE m.account_id = $1 AND m.is_favorited = true 
       ORDER BY m.created_at DESC LIMIT $2 OFFSET $3`,
      [accountId, limit, offset]
    );
    
    // Get total count for pagination
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM game g 
       JOIN member m ON g.id = m.game_id 
       WHERE m.account_id = $1 AND m.is_favorited = true`,
      [accountId]
    );
    
    return {
      data: gamesResult.rows,
      total: parseInt(countResult.rows[0].total, 10)
    };
  }
}
