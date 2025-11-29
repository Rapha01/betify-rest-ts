import { Request, Response, NextFunction } from 'express';
import { GameModel } from '../models/game.model';
import { UpdateGameDto } from '../types/game';
import ApiError from '../utils/ApiError';
import { httpStatus } from '../utils/httpStatus';

class GameController {
  getGameById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const game = await GameModel.findById(id);
    if (!game) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
    }
    res.json(game);
  }

  getGameBySlug = async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const game = await GameModel.findBySlug(slug);
    if (!game) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
    }
    res.json(game);
  }

  getGamesByAccountId = async (req: Request, res: Response, next: NextFunction) => {
    const { accountId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    
    const result = await GameModel.findByAccountId(accountId, page, limit);
    res.json(result);
  }

  getFavoriteGamesByAccountId = async (req: Request, res: Response, next: NextFunction) => {
    const { accountId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    
    const result = await GameModel.findFavoriteByAccountId(accountId, page, limit);
    res.json(result);
  }

  createGame = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.account) 
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You must be logged in to create a game');
    
    const { title } = req.body;
    const account_id = req.account.id as unknown as string;
    await GameModel.create({ title, account_id });
    res.status(201).json({ message: 'Game created' });
  }

  updateGame = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    if (!req.account) 
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You must be logged in to update a game');
    
    const accountId = req.account.id;
    
    const game = await GameModel.findById(id);
    if (!game) 
      throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
    
    if (game.account_id !== accountId) 
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden: You do not own this game');
    
    const allowedFields: (keyof UpdateGameDto)[] = [
      'title', 'description', 'banner_url', 'currency_name', 
      'language', 'is_active', 'is_public', 'start_currency'
    ];
    console.log(req.body);
    const updates: Partial<UpdateGameDto> = {};
    allowedFields.forEach(field => {if (req.body[field] !== undefined) { updates[field] = req.body[field]; }});
    
    if (Object.keys(updates).length === 0) 
      throw new ApiError(httpStatus.BAD_REQUEST, 'No valid fields to update');
    
    await GameModel.update(id, updates);
    res.json({ message: 'Game updated' });
  }
}

export const gameController = new GameController();
