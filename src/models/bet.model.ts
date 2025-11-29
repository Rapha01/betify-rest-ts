import db from './dbcon';
import { Bet, CreateBetDto, UpdateBetDto, CategoryAnswer } from '../types/bet';

export class BetModel {
  static async findById(id: string): Promise<Bet | null> {
    const result = await db.query('SELECT * FROM bet WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findBySlug(slug: string): Promise<Bet | null> {
    const result = await db.query('SELECT * FROM bet WHERE slug = $1', [slug]);
    return result.rows[0] || null;
  }

  static async generateSlug(title: string): Promise<string> {
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // Try base slug first
    if (!(await this.findBySlug(baseSlug))) {
      return baseSlug;
    }
    
    // Find the highest existing suffix for this base slug
    const result = await db.query(`
      SELECT MAX(CAST(SUBSTRING(slug FROM LENGTH($1) + 2) AS INTEGER)) as max_suffix
      FROM bet 
      WHERE slug LIKE $1 || '-%' AND slug ~ ($1 || '-[0-9]+$')
    `, [baseSlug]);
    
    const maxSuffix = result.rows[0].max_suffix || 0;
    const nextSuffix = maxSuffix + 1;
    
    return `${baseSlug}-${nextSuffix}`;
  }

  static async findByGameId(gameId: string): Promise<Bet[]> {
    const result = await db.query(
      'SELECT * FROM bet WHERE game_id = $1 ORDER BY created_at DESC',
      [gameId]
    );
    return result.rows;
  }

  static async create(gameId: string, data: CreateBetDto): Promise<void> {
    const slug = await this.generateSlug(data.title);
    const createdAt = Date.now();
    // Handle no time limit case: if timeLimit is '0', set to 0, otherwise convert to timestamp
    const timeLimit = data.timeLimit === '0' ? 0 : new Date(data.timeLimit).getTime();
    
    // Insert the bet
    const betResult = await db.query(
      `INSERT INTO bet (
        game_id, title, description, bet_type, slug, dynamic_odds, 
        dynamic_odds_power, timelimit, "isTipsHidden", created_at,
        estimate__step, estimate__min, estimate__max, estimate__winrate
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id`,
      [
        gameId,
        data.title,
        data.desc || '',
        data.betType,
        slug,
        data.dynamicOdds,
        data.dynamicOddsPower || 5,
        timeLimit,
        data.isTipsHidden,
        createdAt,
        data.estimate_options?.step || 1,
        data.estimate_options?.min || 0,
        data.estimate_options?.max || 100,
        data.estimate_options?.winRate || 50
      ]
    );

    const betId = betResult.rows[0].id;

    // If category bet, insert answers
    if (data.betType === 'category' && data.category_answers) {
      for (const answer of data.category_answers) {
        await db.query(
          `INSERT INTO answer (bet_id, category__title, base_odds, current_odds, created_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [betId, answer.title, answer.baseOdds, answer.baseOdds, createdAt]
        );
      }
    }
  }

  static async update(id: string, data: UpdateBetDto): Promise<boolean> {
    const fields = Object.keys(data);
    if (fields.length === 0) return false;
    
    const setClause = fields.map((field, idx) => `"${field}" = $${idx + 1}`).join(', ');
    const values = [...Object.values(data), id];
    
    const result = await db.query(
      `UPDATE bet SET ${setClause} WHERE id = $${fields.length + 1}`,
      values
    );
    return (result.rowCount ?? 0) > 0;
  }

  static async delete(id: string): Promise<boolean> {
    // First delete related answers
    await db.query('DELETE FROM answer WHERE bet_id = $1', [id]);
    
    // Then delete related tips (through answers)
    await db.query(`
      DELETE FROM tip WHERE answer_id IN (
        SELECT id FROM answer WHERE bet_id = $1
      )
    `, [id]);
    
    // Finally delete the bet
    const result = await db.query('DELETE FROM bet WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  static async getAnswersByBetId(betId: string): Promise<any[]> {
    const result = await db.query(
      'SELECT * FROM answer WHERE bet_id = $1 ORDER BY created_at ASC',
      [betId]
    );
    return result.rows;
  }
}
