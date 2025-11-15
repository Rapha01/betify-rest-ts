import { Request, Response, NextFunction } from 'express';
import { MemberModel } from '../models/member.model';
import { UpdateMemberDto } from '../types/member';
import ApiError from '../utils/ApiError';
import { httpStatus } from '../utils/httpStatus';
import { GameModel } from '../models/game.model';

class MemberController {
  async getMembersByGameId(req: Request, res: Response, next: NextFunction) {
    const { gameId } = req.params;
    const members = await MemberModel.findByGameId(gameId);
    res.json(members);
  }

  async updateMember(req: Request, res: Response, next: NextFunction) {
    if (!req.account) 
      throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized.');
    
    const game = await GameModel.findById(req.params.gameId);
    if (!game)
      throw new ApiError(httpStatus.NOT_FOUND, 'Game not found.');
  
    const member = await MemberModel.findByGameAndAccountId(game.id,req.account.id);
    const isAdminOrMod = game.account_id == req.account.id || (member && member.is_moderator);
  
    if ('is_favorited' in req.body && req.account.id != req.params.accountId) 
      throw new ApiError(httpStatus.FORBIDDEN, 'You can only update your own member data.');
    if ('is_banned' in req.body && !isAdminOrMod) 
      throw new ApiError(httpStatus.FORBIDDEN, 'Only admin and mods are allowed to ban members.');
    if ('is_moderator' in req.body && req.account.id != game.account_id) 
      throw new ApiError(httpStatus.FORBIDDEN, 'Only admin is allowed to assign the mod role.');
    
    let memberToUpdate = await MemberModel.findByGameAndAccountId(req.params.gameId,req.params.accountId);
    if (!memberToUpdate) {
      await MemberModel.create(req.params.gameId, req.params.accountId, game.start_currency);
      memberToUpdate = await MemberModel.findByGameAndAccountId(req.params.gameId,req.params.accountId);
    }

    memberToUpdate = await MemberModel.update(req.params.gameId, req.params.accountId, req.body);
    res.send(memberToUpdate);
  }  
  
}

export const memberController = new MemberController();
