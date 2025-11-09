import { Request, Response, NextFunction } from 'express';
import { GameModel } from '../models/game.model';
import ApiError from '../utils/ApiError';

class GameController {
  async getGames(req: Request, res: Response, next: NextFunction) {
    const games = await GameModel.findAll();
    res.json(games);
  }

  async getGameById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const game = await GameModel.findById(id);
    if (!game) {
      throw new ApiError(404, 'Game not found');
    }
    res.json(game);
  }

  async createGame(req: Request, res: Response, next: NextFunction) {
    const { name, genre, releaseDate } = req.body;
    const ownerId = req.user!.id;
    const game = await GameModel.create({ name, genre, releaseDate, ownerId });
    res.status(201).json(game);
  }

  async updateGame(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userId = req.user!.id;
    const { field, value } = req.body;

    const allowedFields = ['name', 'genre', 'releaseDate'];
    if (!allowedFields.includes(field)) {
      throw new ApiError(400, 'Invalid field for update');
    }

    if (value === undefined || value === null) {
      throw new ApiError(400, 'Value is required');
    }

    const game = await GameModel.findById(id);
    if (!game) {
      throw new ApiError(404, 'Game not found');
    }

    if (game.ownerId !== userId) {
      throw new ApiError(403, 'Forbidden: You do not own this game');
    }

    const updateData: any = {};
    updateData[field] = value;

    const updatedGame = await GameModel.update(id, updateData);
    if (!updatedGame) {
      throw new ApiError(404, 'Game not found');
    }
    res.json(updatedGame);
  }

  async deleteGame(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userId = req.user!.id;

    const game = await GameModel.findById(id);
    if (!game) {
      throw new ApiError(404, 'Game not found');
    }

    if (game.ownerId !== userId) {
      throw new ApiError(403, 'Forbidden: You do not own this game');
    }

    const deleted = await GameModel.delete(id);
    if (!deleted) {
      throw new ApiError(404, 'Game not found');
    }
    res.json({ message: 'Game deleted' });
  }
}

export const gameController = new GameController();
