import db from './dbcon';
import { Game, CreateGameDto, UpdateGameDto } from '../types/game';

export class GameModel {
  static async findAll(): Promise<Game[]> {
    const result = await db.query('SELECT id, name, genre, release_date as "releaseDate", owner_id as "ownerId" FROM public.game');
    return result.rows;
  }

  static async findById(id: string): Promise<Game | null> {
    const result = await db.query('SELECT id, name, genre, release_date as "releaseDate", owner_id as "ownerId" FROM public.game WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(data: CreateGameDto): Promise<Game> {
    const result = await db.query(
      'INSERT INTO public.game (name, genre, release_date, owner_id) VALUES ($1, $2, $3, $4) RETURNING id, name, genre, release_date as "releaseDate", owner_id as "ownerId"',
      [data.name, data.genre, data.releaseDate, data.ownerId]
    );
    return result.rows[0];
  }

  static async update(id: string, data: UpdateGameDto): Promise<Game | null> {
    const fields = [];
    const values = [];
    let idx = 1;
    if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name); }
    if (data.genre !== undefined) { fields.push(`genre = $${idx++}`); values.push(data.genre); }
    if (data.releaseDate !== undefined) { fields.push(`release_date = $${idx++}`); values.push(data.releaseDate); }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    const result = await db.query(
      `UPDATE public.game SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, name, genre, release_date as "releaseDate", owner_id as "ownerId"`,
      values
    );
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.query('DELETE FROM public.game WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }
}
