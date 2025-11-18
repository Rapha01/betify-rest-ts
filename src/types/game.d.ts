export interface Game {
  id: string;
  account_id: string;
  title: string;
  slug: string;
  description: string;
  banner_url: string;
  currency_name: string;
  language: string;
  is_active: boolean;
  is_public: boolean;
  bet_count: number;
  member_count: number;
  start_currency: number;
  created_at: number;
}

export interface CreateGameDto {
  title: string;
  account_id: string;
}

export interface UpdateGameDto {
  title?: string;
  slug?: string;
  description?: string;
  banner_url?: string;
  currency_name?: string;
  language?: string;
  is_active?: boolean;
  is_public?: boolean;
  bet_count?: number;
  member_count?: number;
  start_currency?: number;
}
