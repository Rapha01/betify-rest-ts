import { Request } from 'express';

export const betValidator = {
  create(req: Request): string {
    const { title, betType, category_answers, estimate_options, dynamicOdds, dynamicOddsPower } = req.body;
    
    if (!title) return 'Bet title is required.';
    if (typeof title !== 'string' || title.length > 128) return 'Bet title must be a string with max 128 characters.';
    
    if (!betType) return 'Bet type is required.';
    if (betType !== 'category' && betType !== 'estimate') return 'Bet type must be either "category" or "estimate".';
    
    // Validate category bet
    if (betType === 'category') {
      if (!category_answers || !Array.isArray(category_answers)) return 'Category answers are required for category bets.';
      if (category_answers.length < 2) return 'Category bets must have at least 2 answers.';
      
      for (let i = 0; i < category_answers.length; i++) {
        const answer = category_answers[i];
        if (!answer.title || typeof answer.title !== 'string') return `Answer ${i + 1} must have a valid title.`;
        if (answer.title.length > 128) return `Answer ${i + 1} title must be max 128 characters.`;
        if (typeof answer.baseOdds !== 'number' || answer.baseOdds < 0) return `Answer ${i + 1} must have valid base odds (number >= 0).`;
      }
      
      if (estimate_options) return 'Estimate options should not be provided for category bets.';
    }
    
    // Validate estimate bet
    if (betType === 'estimate') {
      if (!estimate_options || typeof estimate_options !== 'object') return 'Estimate options are required for estimate bets.';
      
      const { step, min, max, baseOdds, winRate } = estimate_options;
      if (typeof step !== 'number') return 'Estimate step must be a number.';
      if (typeof min !== 'number') return 'Estimate min must be a number.';
      if (typeof max !== 'number') return 'Estimate max must be a number.';
      if (min >= max) return 'Estimate min must be less than max.';
      if (typeof baseOdds !== 'number' || baseOdds < 0) return 'Estimate base odds must be a number >= 0.';
      if (typeof winRate !== 'number' || winRate < 0 || winRate > 100) return 'Estimate win rate must be a number between 0 and 100.';
      
      if (category_answers) return 'Category answers should not be provided for estimate bets.';
    }
    
    // Validate dynamic odds
    if (dynamicOdds === true && (typeof dynamicOddsPower !== 'number' || dynamicOddsPower < 0)) {
      return 'Dynamic odds power must be a number >= 0 when dynamic odds is enabled.';
    }
    
    return '';
  },

  update(req: Request): string {
    const allowedFields = ['title', 'description', 'is_canceled', 'is_solved', 'estimate__correct_answer'];
    const bodyFields = Object.keys(req.body);
    
    if (bodyFields.length === 0) return 'At least one field to update is required.';
    
    for (const field of bodyFields) {
      if (!allowedFields.includes(field)) return `Invalid field for update: ${field}`;
    }
    
    if ('title' in req.body) {
      if (typeof req.body.title !== 'string' || req.body.title.length > 128) {
        return 'Title must be a string with max 128 characters.';
      }
    }
    
    if ('is_canceled' in req.body && typeof req.body.is_canceled !== 'boolean') {
      return 'is_canceled must be a boolean.';
    }
    
    if ('is_solved' in req.body && typeof req.body.is_solved !== 'boolean') {
      return 'is_solved must be a boolean.';
    }
    
    if ('estimate__correct_answer' in req.body && typeof req.body.estimate__correct_answer !== 'number') {
      return 'estimate__correct_answer must be a number.';
    }
    
    return '';
  },
};
