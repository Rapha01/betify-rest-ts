import { Request, Response, NextFunction } from 'express';
import { BetModel } from '../models/bet.model';
import { GameModel } from '../models/game.model';
import { MemberModel } from '../models/member.model';
import { UpdateBetDto } from '../types/bet';
import ApiError from '../utils/ApiError';
import { httpStatus } from '../utils/httpStatus';

class BetController {
  getBetById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const bet = await BetModel.findById(id);
    if (!bet) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Bet not found');
    }
    
    // Get answers if category bet
    if (bet.bet_type === 'category') {
      const answers = await BetModel.getAnswersByBetId(bet.id);
      res.json({ ...bet, answers });
    } else {
      res.json(bet);
    }
  }

  getBetBySlug = async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    
    const bet = await BetModel.findBySlug(slug);
    if (!bet) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Bet not found');
    }
    
    res.json(bet);
  }

  getBetsByGameId = async (req: Request, res: Response, next: NextFunction) => {
    const { gameId } = req.params;
    
    // Verify game exists
    const game = await GameModel.findById(gameId);
    if (!game) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
    }
    
    const bets = await BetModel.findByGameId(gameId);
    
    // Get answers for category bets
    const betsWithAnswers = await Promise.all(
      bets.map(async (bet) => {
        if (bet.bet_type === 'category') {
          const answers = await BetModel.getAnswersByBetId(bet.id);
          return { ...bet, answers };
        }
        return bet;
      })
    );
    
    res.json({ bets: betsWithAnswers });
  }

  createBet = async (req: Request, res: Response, next: NextFunction) => {
    const { gameId } = req.params;
    
    if (!req.account) 
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You must be logged in to create a bet');
    
    // Verify game exists
    const game = await GameModel.findById(gameId);
    if (!game) 
      throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
    
    // Verify user is game owner or moderator
    const isOwner = game.account_id === req.account.id;
    if (!isOwner) {
      const member = await MemberModel.findByGameAndAccountId(gameId, req.account.id);
      if (!member || !member.is_moderator) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Only the game owner or moderators can create bets');
      }
    }
    
    await BetModel.create(gameId, req.body);
    res.status(201).json({ message: 'Bet created successfully' });
  }

  updateBet = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    if (!req.account) 
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You must be logged in to update a bet');
    
    const bet = await BetModel.findById(id);
    if (!bet) 
      throw new ApiError(httpStatus.NOT_FOUND, 'Bet not found');
    
    // Verify game ownership or moderator status
    const game = await GameModel.findById(bet.game_id);
    if (!game) 
      throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
    
    const isOwner = game.account_id === req.account.id;
    if (!isOwner) {
      const member = await MemberModel.findByGameAndAccountId(bet.game_id, req.account.id);
      if (!member || !member.is_moderator) 
        throw new ApiError(httpStatus.FORBIDDEN, 'Only the game owner or moderators can update bets');
    }
    
    const allowedFields: (keyof UpdateBetDto)[] = [
      'title', 'description', 'is_canceled', 'is_solved', 'estimate__correct_answer'
    ];
    
    const updates: Partial<UpdateBetDto> = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    if (Object.keys(updates).length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No valid fields to update');
    }
    
    await BetModel.update(id, updates);
    res.json({ message: 'Bet updated successfully' });
  }

  deleteBet = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    if (!req.account) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You must be logged in to delete a bet');
    }
    
    const bet = await BetModel.findById(id);
    if (!bet) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Bet not found');
    }
    
    // Verify game ownership or moderator status
    const game = await GameModel.findById(bet.game_id);
    if (!game) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
    }
    
    const isOwner = game.account_id === req.account.id;
    if (!isOwner) {
      const member = await MemberModel.findByGameAndAccountId(bet.game_id, req.account.id);
      if (!member || !member.is_moderator) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Only the game owner or moderators can delete bets');
      }
    }
    
    await BetModel.delete(id);
    res.json({ message: 'Bet deleted successfully' });
  }
}

export const betController = new BetController();
