export interface Member {
  id: string;
  game_id: string;
  account_id: string;
  is_moderator: boolean;
  is_banned: boolean;
  is_favorited: boolean;
  currency: number;
  created_at: number;
}

export interface UpdateMemberDto {
  is_banned?: boolean;
  is_favorited?: boolean;
  is_moderator?: boolean
}