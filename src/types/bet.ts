export type BetType = 'category' | 'estimate';

export interface Bet {
  id: string;
  game_id: string;
  title: string;
  description: string;
  bet_type: BetType;
  member_count: number;
  in_pot: number;
  estimate__correct_answer: number;
  dynamic_odds: boolean;
  dynamic_odds_power: number;
  is_canceled: boolean;
  is_solved: boolean;
  is_paid: boolean;
  timelimit: number;
  estimate__step: number;
  estimate__min: number;
  estimate__max: number;
  estimate__winrate: number;
  created_at: number;
  solved_at: number;
  slug: string;
  isTipsHidden: boolean;
}

export interface CreateBetDto {
  title: string;
  desc: string;
  betType: BetType;
  dynamicOdds: boolean;
  dynamicOddsPower?: number;
  isTipsHidden: boolean;
  category_answers?: CategoryAnswer[];
  estimate_options?: EstimateOptions;
  timeLimit: string; // ISO string from frontend
}

export interface UpdateBetDto {
  title?: string;
  description?: string;
  is_canceled?: boolean;
  is_solved?: boolean;
  estimate__correct_answer?: number;
}

export interface CategoryAnswer {
  title: string;
  baseOdds: number;
}

export interface EstimateOptions {
  step: number;
  min: number;
  max: number;
  baseOdds: number;
  winRate: number;
}
