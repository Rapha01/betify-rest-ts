import { Request, Response, NextFunction } from 'express';
import { GameModel } from '../models/game.model';
import { UpdateGameDto } from '../types/game';
import ApiError from '../utils/ApiError';
import { httpStatus } from '../utils/httpStatus';

class GameController {
  async getGameById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const game = await GameModel.findById(id);
    if (!game) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
    }
    res.json(game);
  }

  async getGamesByAccountId(req: Request, res: Response, next: NextFunction) {
    const { accountId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    
    const result = await GameModel.findByAccountId(accountId, page, limit);
    res.json(result);
  }

  async createGame(req: Request, res: Response, next: NextFunction) {
    const { title } = req.body;
    const account_id = req.account!.id as unknown as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await GameModel.create({ title, slug, account_id });
    res.status(201).json({ message: 'Game created' });
  }

  async updateGame(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const accountId = req.account!.id;
    
    // Validate ownership
    const game = await GameModel.findById(id);
    if (!game) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
    }
    
    if (game.account_id !== accountId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden: You do not own this game');
    }
    
    // Filter allowed fields from request body
    const allowedFields: (keyof UpdateGameDto)[] = [
      'title', 'description', 'banner_url', 'currency_name', 
      'language', 'is_active', 'is_public', 'start_currency'
    ];
    
    const updates: Partial<UpdateGameDto> = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    if (Object.keys(updates).length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No valid fields to update');
    }
    
    await GameModel.update(id, updates);
    res.json({ message: 'Game updated' });
  }
}

export const gameController = new GameController();
